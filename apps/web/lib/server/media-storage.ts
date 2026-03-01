import crypto from "node:crypto";
import path from "node:path";
import sharp from "sharp";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerEnv } from "./env";

const DEFAULT_BUCKET = process.env.SUPABASE_MEDIA_BUCKET || "media-library";
const ORIGINALS_PREFIX = "originals";
const VARIANTS_PREFIX = "variants";
const TARGET_WIDTHS = [320, 640, 1024, 1600];
const TARGET_FORMATS = ["avif", "webp"] as const;

let bucketEnsured = false;

type SupportedFormat = (typeof TARGET_FORMATS)[number];

export type MediaVariant = {
  width: number;
  format: SupportedFormat;
  path: string;
  url: string;
  contentType: string;
};

export type MediaAsset = {
  id: string;
  fileName: string;
  originalPath: string;
  originalUrl: string;
  originalSize: number;
  createdAt: string;
  variants: MediaVariant[];
};

function getStorageClient() {
  const env = getServerEnv();
  const url = env.supabaseUrl;
  const serviceRole = env.supabaseServiceRole;

  if (!url || !serviceRole) {
    throw new Error("Supabase storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE.");
  }

  return createClient(url, serviceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

async function ensureBucket(client: SupabaseClient) {
  if (bucketEnsured) return;

  const { data, error } = await client.storage.getBucket(DEFAULT_BUCKET);
  if (error || !data) {
    const { error: createError } = await client.storage.createBucket(DEFAULT_BUCKET, {
      public: true,
      fileSizeLimit: "15MB"
    });

    if (createError && !String(createError.message || "").toLowerCase().includes("already exists")) {
      throw createError;
    }
  }

  bucketEnsured = true;
}

function extFromMime(mimeType: string) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/avif") return "avif";
  if (mimeType === "image/gif") return "gif";
  return "jpg";
}

function buildBaseId(fileName: string) {
  const stem = path.parse(fileName).name
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

  const suffix = crypto.randomUUID().slice(0, 8);
  return `${stem || "media"}-${Date.now()}-${suffix}`;
}

function publicUrl(client: SupabaseClient, objectPath: string) {
  return client.storage.from(DEFAULT_BUCKET).getPublicUrl(objectPath).data.publicUrl;
}

async function uploadObject(client: SupabaseClient, objectPath: string, body: Buffer, contentType: string) {
  const { error } = await client.storage.from(DEFAULT_BUCKET).upload(objectPath, body, {
    contentType,
    upsert: false,
    cacheControl: "31536000"
  });
  if (error) {
    throw error;
  }
}

export async function uploadMediaAsset(input: {
  fileName: string;
  fileBuffer: Buffer;
  mimeType: string;
}) {
  const client = getStorageClient();
  await ensureBucket(client);

  const { fileName, fileBuffer, mimeType } = input;
  const baseId = buildBaseId(fileName);
  const originalExt = extFromMime(mimeType);
  const originalPath = `${ORIGINALS_PREFIX}/${baseId}.${originalExt}`;

  await uploadObject(client, originalPath, fileBuffer, mimeType || "image/jpeg");

  const source = sharp(fileBuffer, { failOn: "none" });
  const metadata = await source.metadata();
  const originalWidth = metadata.width || 0;
  const widths = TARGET_WIDTHS.filter((size) => size <= originalWidth);
  if (!widths.length) {
    widths.push(Math.max(1, originalWidth || 320));
  }

  const variants: MediaVariant[] = [];

  for (const width of widths) {
    for (const format of TARGET_FORMATS) {
      const objectPath = `${VARIANTS_PREFIX}/${baseId}-${width}.${format}`;
      const transformer = sharp(fileBuffer)
        .rotate()
        .resize({ width, withoutEnlargement: true, fit: "inside" });

      const output = format === "avif"
        ? await transformer.avif({ quality: 60, effort: 4 }).toBuffer()
        : await transformer.webp({ quality: 78 }).toBuffer();

      const contentType = format === "avif" ? "image/avif" : "image/webp";
      await uploadObject(client, objectPath, output, contentType);

      variants.push({
        width,
        format,
        contentType,
        path: objectPath,
        url: publicUrl(client, objectPath)
      });
    }
  }

  return {
    bucket: DEFAULT_BUCKET,
    asset: {
      id: baseId,
      fileName,
      originalPath,
      originalUrl: publicUrl(client, originalPath),
      originalSize: fileBuffer.length,
      createdAt: new Date().toISOString(),
      variants
    } satisfies MediaAsset
  };
}

export async function listMediaAssets(limit = 120) {
  const client = getStorageClient();
  await ensureBucket(client);

  const { data, error } = await client.storage
    .from(DEFAULT_BUCKET)
    .list(ORIGINALS_PREFIX, {
      limit,
      sortBy: { column: "created_at", order: "desc" }
    });

  if (error) {
    throw error;
  }

  const items = (data || [])
    .filter((file) => file.name && !file.name.endsWith("/"))
    .map((file) => {
      const id = path.parse(file.name).name;
      const originalPath = `${ORIGINALS_PREFIX}/${file.name}`;
      const variants: MediaVariant[] = TARGET_WIDTHS.flatMap((width) =>
        TARGET_FORMATS.map((format) => {
          const objectPath = `${VARIANTS_PREFIX}/${id}-${width}.${format}`;
          return {
            width,
            format,
            contentType: format === "avif" ? "image/avif" : "image/webp",
            path: objectPath,
            url: publicUrl(client, objectPath)
          };
        })
      );

      return {
        id,
        fileName: file.name,
        originalPath,
        originalUrl: publicUrl(client, originalPath),
        originalSize: Number(file.metadata?.size || 0),
        createdAt: file.created_at || new Date().toISOString(),
        variants
      } satisfies MediaAsset;
    });

  return {
    bucket: DEFAULT_BUCKET,
    items
  };
}

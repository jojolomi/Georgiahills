import { createClient } from "@supabase/supabase-js";
import { Pool } from "pg";
import { randomUUID } from "node:crypto";
import { getServerEnv } from "./env";

export type BookingRecord = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  destinationSlug: string;
  travelDate: string;
  guests: number;
  amount?: number;
  currency?: string;
  status: "pending" | "paid" | "failed";
  notes?: string;
  stripeSessionId?: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;
};

export type BookingSortKey = "createdAt" | "travelDate" | "fullName" | "status" | "amount";
export type BookingSortDirection = "asc" | "desc";

export type BookingPageInput = {
  page: number;
  pageSize: number;
  sortBy?: BookingSortKey;
  sortDirection?: BookingSortDirection;
};

export type BookingPageResult = {
  rows: BookingRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sortBy: BookingSortKey;
  sortDirection: BookingSortDirection;
};

type CreateBookingInput = Omit<BookingRecord, "id" | "createdAt" | "updatedAt" | "status"> & {
  status?: BookingRecord["status"];
};

type BookingRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  destination_slug: string;
  travel_date: string;
  guests: number;
  amount: number | null;
  currency: string | null;
  status: BookingRecord["status"];
  notes: string | null;
  stripe_session_id: string | null;
  payment_status: string | null;
  created_at: string;
  updated_at: string;
};

declare global {
  var __GH_BOOKING_STORE__: BookingRecord[] | undefined;
}

const poolCache: { pool?: Pool } = {};

function getMemoryStore() {
  if (!globalThis.__GH_BOOKING_STORE__) {
    globalThis.__GH_BOOKING_STORE__ = [];
  }

  return globalThis.__GH_BOOKING_STORE__;
}

function getPgPool() {
  const { databaseUrl } = getServerEnv();
  if (!databaseUrl || !databaseUrl.startsWith("postgres")) return null;

  if (!poolCache.pool) {
    poolCache.pool = new Pool({ connectionString: databaseUrl });
  }

  return poolCache.pool;
}

function getSupabaseClient() {
  const { supabaseUrl, supabaseServiceRole } = getServerEnv();
  if (!supabaseUrl || !supabaseServiceRole) return null;

  return createClient(supabaseUrl, supabaseServiceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function createBooking(input: CreateBookingInput): Promise<BookingRecord> {
  const now = new Date().toISOString();
  const record: BookingRecord = {
    id: randomUUID(),
    status: input.status || "pending",
    createdAt: now,
    updatedAt: now,
    ...input
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        id: record.id,
        full_name: record.fullName,
        email: record.email,
        phone: record.phone,
        destination_slug: record.destinationSlug,
        travel_date: record.travelDate,
        guests: record.guests,
        amount: record.amount,
        currency: record.currency,
        status: record.status,
        notes: record.notes,
        stripe_session_id: record.stripeSessionId,
        payment_status: record.paymentStatus,
        created_at: record.createdAt,
        updated_at: record.updatedAt
      })
      .select("id")
      .single();

    if (!error && data) return record;
  }

  const pool = getPgPool();
  if (pool) {
    await pool.query(
      `INSERT INTO bookings (id, full_name, email, phone, destination_slug, travel_date, guests, amount, currency, status, notes, stripe_session_id, payment_status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [
        record.id,
        record.fullName,
        record.email,
        record.phone || null,
        record.destinationSlug,
        record.travelDate,
        record.guests,
        record.amount || null,
        record.currency || null,
        record.status,
        record.notes || null,
        record.stripeSessionId || null,
        record.paymentStatus || null,
        record.createdAt,
        record.updatedAt
      ]
    );
    return record;
  }

  const store = getMemoryStore();
  store.push(record);
  return record;
}

export async function updateBookingPaymentState(input: {
  bookingId: string;
  paymentStatus: string;
  status?: BookingRecord["status"];
  stripeSessionId?: string;
}) {
  const now = new Date().toISOString();
  const nextStatus = input.status || (input.paymentStatus === "paid" ? "paid" : "pending");

  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase
      .from("bookings")
      .update({
        status: nextStatus,
        payment_status: input.paymentStatus,
        stripe_session_id: input.stripeSessionId,
        updated_at: now
      })
      .eq("id", input.bookingId);

    if (!error) return;
  }

  const pool = getPgPool();
  if (pool) {
    await pool.query(
      `UPDATE bookings
       SET status = $2,
           payment_status = $3,
           stripe_session_id = COALESCE($4, stripe_session_id),
           updated_at = $5
       WHERE id = $1`,
      [input.bookingId, nextStatus, input.paymentStatus, input.stripeSessionId || null, now]
    );
    return;
  }

  const store = getMemoryStore();
  const target = store.find((item) => item.id === input.bookingId);
  if (target) {
    target.status = nextStatus;
    target.paymentStatus = input.paymentStatus;
    target.stripeSessionId = input.stripeSessionId || target.stripeSessionId;
    target.updatedAt = now;
  }
}

function rowToBookingRecord(row: BookingRow): BookingRecord {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone || undefined,
    destinationSlug: row.destination_slug,
    travelDate: row.travel_date,
    guests: row.guests,
    amount: row.amount || undefined,
    currency: row.currency || undefined,
    status: row.status,
    notes: row.notes || undefined,
    stripeSessionId: row.stripe_session_id || undefined,
    paymentStatus: row.payment_status || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function normalizePageInput(input: BookingPageInput) {
  const page = Number.isFinite(input.page) ? Math.max(1, Math.floor(input.page)) : 1;
  const pageSize = Number.isFinite(input.pageSize) ? Math.min(100, Math.max(1, Math.floor(input.pageSize))) : 10;
  const sortBy: BookingSortKey = input.sortBy || "createdAt";
  const sortDirection: BookingSortDirection = input.sortDirection === "asc" ? "asc" : "desc";
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return { page, pageSize, sortBy, sortDirection, from, to };
}

function sortValue(booking: BookingRecord, key: BookingSortKey): string | number {
  if (key === "createdAt") return booking.createdAt;
  if (key === "travelDate") return booking.travelDate;
  if (key === "fullName") return booking.fullName.toLowerCase();
  if (key === "status") return booking.status;
  return booking.amount || 0;
}

function compareBookingRows(left: BookingRecord, right: BookingRecord, sortBy: BookingSortKey, sortDirection: BookingSortDirection) {
  const leftValue = sortValue(left, sortBy);
  const rightValue = sortValue(right, sortBy);
  const multiplier = sortDirection === "asc" ? 1 : -1;

  if (leftValue < rightValue) return -1 * multiplier;
  if (leftValue > rightValue) return 1 * multiplier;
  return 0;
}

export async function getBookingsPage(input: BookingPageInput): Promise<BookingPageResult> {
  const normalized = normalizePageInput(input);
  const sortColumnMap: Record<BookingSortKey, string> = {
    createdAt: "created_at",
    travelDate: "travel_date",
    fullName: "full_name",
    status: "status",
    amount: "amount"
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error, count } = await supabase
      .from("bookings")
      .select(
        "id, full_name, email, phone, destination_slug, travel_date, guests, amount, currency, status, notes, stripe_session_id, payment_status, created_at, updated_at",
        { count: "exact" }
      )
      .order(sortColumnMap[normalized.sortBy], { ascending: normalized.sortDirection === "asc", nullsFirst: false })
      .range(normalized.from, normalized.to);

    if (!error && data) {
      const total = count || 0;
      return {
        rows: (data as BookingRow[]).map(rowToBookingRecord),
        total,
        page: normalized.page,
        pageSize: normalized.pageSize,
        totalPages: Math.max(1, Math.ceil(total / normalized.pageSize)),
        sortBy: normalized.sortBy,
        sortDirection: normalized.sortDirection
      };
    }
  }

  const pool = getPgPool();
  if (pool) {
    const orderBy = sortColumnMap[normalized.sortBy];
    const direction = normalized.sortDirection === "asc" ? "ASC" : "DESC";
    const totalResult = await pool.query<{ total: string }>("SELECT COUNT(*)::text AS total FROM bookings");
    const total = Number(totalResult.rows[0]?.total || "0");

    const result = await pool.query<BookingRow>(
      `SELECT id, full_name, email, phone, destination_slug, travel_date, guests, amount, currency, status, notes, stripe_session_id, payment_status, created_at, updated_at
       FROM bookings
       ORDER BY ${orderBy} ${direction}
       LIMIT $1 OFFSET $2`,
      [normalized.pageSize, normalized.from]
    );

    return {
      rows: result.rows.map(rowToBookingRecord),
      total,
      page: normalized.page,
      pageSize: normalized.pageSize,
      totalPages: Math.max(1, Math.ceil(total / normalized.pageSize)),
      sortBy: normalized.sortBy,
      sortDirection: normalized.sortDirection
    };
  }

  const store = getMemoryStore();
  const sorted = [...store].sort((left, right) => compareBookingRows(left, right, normalized.sortBy, normalized.sortDirection));
  const rows = sorted.slice(normalized.from, normalized.to + 1);
  const total = sorted.length;

  return {
    rows,
    total,
    page: normalized.page,
    pageSize: normalized.pageSize,
    totalPages: Math.max(1, Math.ceil(total / normalized.pageSize)),
    sortBy: normalized.sortBy,
    sortDirection: normalized.sortDirection
  };
}

export async function getBookingsByEmail(email: string): Promise<BookingRecord[]> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return [];

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        "id, full_name, email, phone, destination_slug, travel_date, guests, amount, currency, status, notes, stripe_session_id, payment_status, created_at, updated_at"
      )
      .eq("email", normalized)
      .order("created_at", { ascending: false });

    if (!error && data) {
      return (data as BookingRow[]).map(rowToBookingRecord);
    }
  }

  const pool = getPgPool();
  if (pool) {
    const result = await pool.query<BookingRow>(
      `SELECT id, full_name, email, phone, destination_slug, travel_date, guests, amount, currency, status, notes, stripe_session_id, payment_status, created_at, updated_at
       FROM bookings
       WHERE LOWER(email) = LOWER($1)
       ORDER BY created_at DESC`,
      [normalized]
    );

    return result.rows.map(rowToBookingRecord);
  }

  const store = getMemoryStore();
  return store
    .filter((item) => item.email.trim().toLowerCase() === normalized)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}
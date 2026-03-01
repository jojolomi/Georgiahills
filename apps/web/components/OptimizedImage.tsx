import Image, { type ImageProps } from "next/image";

type OptimizedImageProps = Omit<ImageProps, "placeholder" | "blurDataURL" | "sizes" | "priority"> & {
  alt: string;
  priority?: boolean;
  withBlur?: boolean;
  blurDataURL?: string;
  sizes?: string;
  fetchPriority?: "high" | "low" | "auto";
};

const defaultBlurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PSc5Jz48cmVjdCB3aWR0aD0nMTYnIGhlaWdodD0nOScgZmlsbD0nI2UyZThmMCcvPjwvc3ZnPg==";

export function OptimizedImage({
  alt,
  priority = false,
  withBlur = true,
  blurDataURL,
  sizes = "(max-width: 768px) 100vw, 50vw",
  fetchPriority,
  ...props
}: OptimizedImageProps) {
  const shouldUseBlur = withBlur;

  return (
    <Image
      {...props}
      alt={alt}
      priority={priority}
      sizes={sizes}
      placeholder={shouldUseBlur ? "blur" : "empty"}
      blurDataURL={shouldUseBlur ? (blurDataURL || defaultBlurDataURL) : undefined}
      fetchPriority={fetchPriority || (priority ? "high" : "auto")}
    />
  );
}
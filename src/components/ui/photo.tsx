import type { CSSProperties } from "react"
import { photos } from "@/data/photos.generated"
import { cn } from "@/lib/utils"

interface PhotoProps {
  name: keyof typeof photos | string
  alt: string
  sizes?: string
  className?: string
  /** Load immediately (above-the-fold images). */
  priority?: boolean
  style?: CSSProperties
}

/** Responsive WebP with a tiny blurred placeholder behind it while the real image loads. */
export function Photo({ name, alt, sizes = "100vw", className, priority = false, style }: PhotoProps) {
  const photo = photos[name]
  if (!photo) return null
  const srcSet = photo.sources.map((s) => `/images/${s.file} ${s.w}w`).join(", ")
  const first = photo.sources[0]
  return (
    <img
      src={`/images/${first.file}`}
      srcSet={srcSet}
      sizes={sizes}
      width={photo.w}
      height={photo.h}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn("bg-cover bg-center", className)}
      style={{ backgroundImage: `url(${photo.lqip})`, ...style }}
    />
  )
}

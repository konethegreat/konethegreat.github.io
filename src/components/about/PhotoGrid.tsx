import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Photo } from "@/components/ui/photo"
import { gallery } from "@/data/gallery"

export function PhotoGrid() {
  const [active, setActive] = useState<number | null>(null)
  const item = active === null ? null : gallery[active]

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((photo, index) => (
          <li key={photo.photo} className={index === 0 ? "sm:col-span-2 lg:col-span-1" : undefined}>
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Open photo: ${photo.caption}`}
              className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-card text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Photo
                name={photo.photo}
                alt=""
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10 text-sm font-medium text-white">
                {photo.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={item !== null} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent variant="lightbox" closeLabel="Close photo" className="p-3 sm:p-5">
          {item && (
            <div>
              <DialogTitle className="sr-only">{item.caption}</DialogTitle>
              <DialogDescription className="sr-only">A larger view of this photo.</DialogDescription>
              <Photo
                name={item.photo}
                alt={item.alt}
                sizes="96vw"
                className="mx-auto max-h-[78dvh] w-full rounded-xl object-contain"
              />
              <p className="mt-3 px-2 pb-1 text-sm text-slate-200">{item.caption}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

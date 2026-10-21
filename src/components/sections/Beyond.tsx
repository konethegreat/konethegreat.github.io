import { useCallback, useMemo, useState, type KeyboardEvent } from "react"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Photo } from "@/components/ui/photo"
import { SectionHeading } from "@/components/ui/section-heading"
import { gallery, type GalleryItem } from "@/data/gallery"
import { photos } from "@/data/photos.generated"
import { useMediaQuery } from "@/lib/hooks"

type Entry = GalleryItem & { index: number }

/** Vertical gap between photos, in units of one column width (about 18px on a 380px column). */
const GAP = 0.05

/**
 * Masonry with level columns. A greedy "shortest column next" pass leaves ragged bottoms when a
 * few photos are very tall, so for a gallery this small every split is tried (columns keep the
 * reading order) and the one with the smallest difference between the tallest and shortest
 * column wins. Larger galleries fall back to the greedy pass.
 */
function distribute(items: GalleryItem[], columns: number): Entry[][] {
  const heights = items.map((item) => 1 / (photos[item.photo]?.ratio ?? 1))
  const assign: number[] = new Array<number>(items.length).fill(0)

  if (columns > 1 && items.length <= 12) {
    const colHeight = new Array<number>(columns).fill(0)
    const colCount = new Array<number>(columns).fill(0)
    let best = Infinity
    let bestAssign = assign.slice()

    const search = (i: number, used: number) => {
      if (i === items.length) {
        const spread = Math.max(...colHeight) - Math.min(...colHeight)
        if (spread < best - 1e-9) {
          best = spread
          bestAssign = assign.slice()
        }
        return
      }
      // `used` stops mirror-image splits (the same columns in another order) being tried twice.
      for (let c = 0; c < Math.min(columns, used + 1); c++) {
        const add = heights[i] + (colCount[c] > 0 ? GAP : 0)
        assign[i] = c
        colHeight[c] += add
        colCount[c] += 1
        search(i + 1, Math.max(used, c + 1))
        colCount[c] -= 1
        colHeight[c] -= add
      }
    }
    search(0, 0)
    assign.splice(0, assign.length, ...bestAssign)
  } else if (columns > 1) {
    const colHeight = new Array<number>(columns).fill(0)
    items.forEach((_, i) => {
      const shortest = colHeight.indexOf(Math.min(...colHeight))
      assign[i] = shortest
      colHeight[shortest] += heights[i] + GAP
    })
  }

  const cols: Entry[][] = Array.from({ length: columns }, () => [])
  items.forEach((item, index) => cols[assign[index]].push({ ...item, index }))
  return cols
}

export function Beyond() {
  const three = useMediaQuery("(min-width: 1024px)")
  const columns = three ? 3 : 2
  // `index` stays put while the dialog animates out, so the photo does not vanish mid-fade.
  const [isOpen, setIsOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const layout = useMemo(() => distribute(gallery, columns), [columns])
  const n = gallery.length
  const move = useCallback((dir: 1 | -1) => setIndex((i) => (i + dir + n) % n), [n])
  const current = gallery[index]

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      move(1)
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      move(-1)
    }
  }

  return (
    <section id="beyond" aria-labelledby="beyond-title" className="section-anchor relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="beyond-title"
          index="08"
          eyebrow="Beyond the code"
          title={
            <>
              The rest of <span className="text-gradient">the picture.</span>
            </>
          }
          lead="A sunny rooftop, graduation day, some puppies, an open road and a match-day shirt. Tap a photo to see it larger."
        />

        <div className="flex gap-4 sm:gap-5">
          {layout.map((col, c) => (
            <div key={c} className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5">
              {col.map((item, i) => (
                <Reveal key={item.photo} delay={((c + i) % 3) * 0.06}>
                  <figure>
                    <button
                      type="button"
                      onClick={() => {
                        setIndex(item.index)
                        setIsOpen(true)
                      }}
                      aria-haspopup="dialog"
                      className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d1b] text-left shadow-[0_20px_60px_-30px_rgb(0_0_0/0.9)] transition hover:border-cyan-300/40"
                    >
                      <Photo
                        name={item.photo}
                        alt={item.alt}
                        sizes="(min-width: 1024px) 28rem, 46vw"
                        className="w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#05060d]/95 via-[#05060d]/65 to-transparent"
                      />
                      <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs font-medium leading-snug text-white sm:p-4 sm:text-sm">{item.caption}</figcaption>
                      <span
                        aria-hidden="true"
                        className="glass-strong absolute right-3 top-3 grid size-9 place-items-center rounded-full text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"
                      >
                        <Maximize2 className="size-4" />
                      </span>
                    </button>
                  </figure>
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent variant="lightbox" closeLabel="Close the photo" onKeyDown={onKeyDown}>
          <div className="flex max-h-[94dvh] flex-col">
              <div className="flex min-h-0 flex-1 items-center justify-center bg-black/40 p-3 sm:p-5">
                <Photo
                  name={current.photo}
                  alt={current.alt}
                  sizes="96vw"
                  priority
                  className="max-h-[72dvh] w-auto max-w-full rounded-xl object-contain"
                />
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-3 sm:px-6">
                <div className="min-w-0">
                  <DialogTitle className="truncate text-base sm:text-lg">{current.caption}</DialogTitle>
                  <DialogDescription className="font-mono text-xs text-slate-400">
                    {index + 1} of {n} · use the arrow keys to move
                  </DialogDescription>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button variant="outline" size="icon" className="size-9" onClick={() => move(-1)} aria-label="Previous photo">
                    <ChevronLeft aria-hidden="true" />
                  </Button>
                  <Button variant="outline" size="icon" className="size-9" onClick={() => move(1)} aria-label="Next photo">
                    <ChevronRight aria-hidden="true" />
                  </Button>
                </div>
              </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

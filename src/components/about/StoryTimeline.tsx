import { useEffect, useRef, useState } from "react"
import { EvidenceTag } from "@/components/about/EvidenceTag"
import type { AboutChapter } from "@/data/about"
import { cn } from "@/lib/utils"

export function StoryTimeline({ chapters }: { chapters: AboutChapter[] }) {
  const [active, setActive] = useState(chapters[0]?.id ?? "")
  const refs = useRef(new Map<string, HTMLElement>())

  useEffect(() => {
    const nodes = Array.from(refs.current.values())
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.getAttribute("data-chapter")
          if (id) setActive(id)
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    )
    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [chapters])

  return (
    <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
      <nav aria-label="Story timeline" className="hidden lg:block">
        <ol className="sticky top-24 space-y-1">
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-current={active === chapter.id ? "location" : undefined}
                className={cn(
                  "block rounded-xl border px-3 py-2 transition",
                  active === chapter.id
                    ? "border-primary/40 bg-card"
                    : "border-transparent hover:border-border hover:bg-card/60",
                )}
              >
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {chapter.year}
                </span>
                <span className="mt-1 block text-sm font-medium">{chapter.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <ol aria-label="Story chapters" className="relative space-y-10 border-l border-border pl-6">
        {chapters.map((chapter) => (
          <li
            key={chapter.id}
            id={chapter.id}
            data-chapter={chapter.id}
            ref={(node) => {
              if (node) refs.current.set(chapter.id, node)
            }}
            className="relative scroll-mt-24"
          >
            <span
              aria-hidden="true"
              className="absolute -left-[1.9rem] top-1.5 size-2.5 rounded-full border-2 border-background bg-primary"
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{chapter.date}</p>
            <h3 className="mt-2 font-serif text-3xl leading-tight">{chapter.title}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{chapter.body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {chapter.evidence.map((link) => (
                <EvidenceTag key={link.to} link={link} />
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

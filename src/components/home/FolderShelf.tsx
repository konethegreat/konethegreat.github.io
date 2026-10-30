import type { MouseEvent } from "react"
import GlassFolder, { type ArtPreset, type FolderFile } from "@/components/ui/glass-folder"
import { projectBySlug } from "@/data/projects"
import { useMediaQuery } from "@/lib/hooks"
import { useRouter } from "@/lib/router"

interface Shelf {
  label: string
  meta: string
  seed: number
  art: ArtPreset
  files: FolderFile[]
}

const fileArt: ArtPreset[] = ["ember", "aurora", "dusk", "glacier", "verdant"]

function projectFiles(slugs: string[]): FolderFile[] {
  return slugs.flatMap((slug, index) => {
    const project = projectBySlug(slug)
    if (!project) return []
    return [
      {
        name: project.title,
        meta: project.period,
        href: `/work/${project.slug}`,
        art: fileArt[index % fileArt.length],
      },
    ]
  })
}

const shelves: Shelf[] = [
  {
    label: "Client work",
    meta: "Billable, shipped, in the open",
    seed: 11,
    art: "ember",
    files: projectFiles(["sa-jas", "clearcut", "munisolve", "timelex"]),
  },
  {
    label: "Studio",
    meta: "Built for the craft",
    seed: 27,
    art: "dusk",
    files: projectFiles(["vigil", "k-one", "reservoir"]),
  },
  {
    label: "Play",
    meta: "Experiments and toys",
    seed: 43,
    art: "glacier",
    files: [
      ...projectFiles(["ui-vault"]),
      { name: "Playground", meta: "Live lab", href: "/playground", art: "glacier" },
    ],
  },
]

export function FolderShelf() {
  const { navigate } = useRouter()
  const wide = useMediaQuery("(min-width: 640px)")
  const width = wide ? 340 : 288

  const openFile = (href: string) => (event: MouseEvent<HTMLElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    const root = event.currentTarget.closest<HTMLElement>(".gf-root")
    if (root) root.style.viewTransitionName = "case-hero"
    navigate(href)
  }

  return (
    <section aria-labelledby="shelf-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Selected work</p>
          <h2 id="shelf-title" className="mt-3 max-w-2xl font-serif text-4xl leading-[1.02] sm:text-5xl lg:text-6xl">
            Three folders, eight places to look.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Open a folder, then pick a file. Every one is a real case study with the constraints, the
          build and what changed.
        </p>
      </div>

      <ul className="mt-14 grid justify-items-center gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {shelves.map((shelf, index) => (
          <li key={shelf.label} className="flex flex-col items-center">
            <GlassFolder
              label={shelf.label}
              meta={shelf.meta}
              tone={index === 1 ? "light" : "dark"}
              art={shelf.art}
              seed={shelf.seed}
              files={shelf.files}
              action="none"
              labelPlacement={index === 1 ? "top-right" : "bottom-left"}
              width={width}
              appear
              appearDelay={index * 120}
              onFileSelect={(file, _index, event) => {
                if (file.href) openFile(file.href)(event)
              }}
            />
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {shelf.files.length} {shelf.label === "Play" ? "toys" : "case studies"}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-16 text-center font-serif text-2xl italic text-muted-foreground">
        Folders open. Nothing here is a dead end.
      </p>
      <p className="sr-only">
        Folder cards adapted from Glass Folder Cards by Kedhareswer Naidu, MIT licensed, via ui-vault.
      </p>
    </section>
  )
}

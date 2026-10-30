import * as Dialog from "@radix-ui/react-dialog"
import { Command } from "cmdk"
import { ArrowUpRight, CornerDownLeft, Search } from "lucide-react"
import { navItems } from "@/data/nav"
import { caseStudies } from "@/data/case-studies"
import { liveProjects } from "@/data/live"
import { projectBySlug } from "@/data/projects"
import { useRouter } from "@/lib/router"

interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const routeOf = (id: string) => (id === "home" ? "/" : `/${id}`)

const itemClass =
  "flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground outline-none data-[selected=true]:bg-accent"

const groupClass =
  "px-1 py-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-muted-foreground"

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const { navigate } = useRouter()

  const go = (to: string) => {
    onOpenChange(false)
    navigate(to)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-background/80 backdrop-blur-xl data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in" />
        <Dialog.Content className="fixed left-1/2 top-[10vh] z-[90] w-[min(92vw,40rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl data-[state=closed]:animate-pop-out data-[state=open]:animate-pop-in focus:outline-none">
          <Dialog.Title className="sr-only">Command menu</Dialog.Title>
          <Dialog.Description className="sr-only">
            Search pages and live projects. Use the arrow keys to move and Enter to select.
          </Dialog.Description>

          <Command label="Command menu" loop className="flex flex-col">
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <Command.Input
                autoFocus
                aria-label="Search pages and projects"
                placeholder="Jump to a page or a live project"
                className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
              />
              <kbd className="shrink-0 rounded border border-border bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                Esc
              </kbd>
            </div>

            <Command.List className="max-h-[min(56vh,26rem)] overflow-y-auto overscroll-contain p-2">
              <Command.Empty className="px-4 py-10 text-center text-sm text-muted-foreground">
                Nothing matches that. Try a page name or a project.
              </Command.Empty>

              <Command.Group heading="Pages" className={groupClass}>
                {[...navItems, { id: "credits", label: "Credits" }].map((item) => (
                  <Command.Item
                    key={item.id}
                    value={`go ${item.label} ${routeOf(item.id)}`}
                    onSelect={() => go(routeOf(item.id))}
                    className={itemClass}
                  >
                    <span className="font-mono text-[10px] text-primary">/</span>
                    <span>{item.label}</span>
                  </Command.Item>
                ))}
              </Command.Group>

              <Command.Group heading="Case studies" className={groupClass}>
                {caseStudies.map((study) => {
                  const project = projectBySlug(study.slug)
                  return (
                    <Command.Item
                      key={study.slug}
                      value={`${project?.title ?? study.slug} ${study.tagline}`}
                      keywords={study.stack}
                      onSelect={() => go(`/work/${study.slug}`)}
                      className={itemClass}
                    >
                      <span className="min-w-0 flex-1 truncate">{project?.title ?? study.slug}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{study.year}</span>
                    </Command.Item>
                  )
                })}
              </Command.Group>

              <Command.Group heading="Live now" className={groupClass}>
                {liveProjects.map((project) => (
                  <Command.Item
                    key={project.slug}
                    value={`live ${project.name} ${project.url}`}
                    onSelect={() => {
                      onOpenChange(false)
                      window.open(project.url, "_blank", "noopener,noreferrer")
                    }}
                    className={itemClass}
                  >
                    <span className="min-w-0 flex-1 truncate">{project.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{new URL(project.url).host}</span>
                    <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>

            <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CornerDownLeft className="size-3.5" aria-hidden="true" /> to select
              </span>
              <span className="hidden sm:inline">Ctrl K opens this menu</span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

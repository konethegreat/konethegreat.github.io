import { useEffect, useState, type ReactNode } from "react"
import { Command } from "cmdk"
import {
  ArrowUpRight,
  BadgeCheck,
  Compass,
  CornerDownLeft,
  Copy,
  Download,
  FolderGit2,
  Mail,
  Search,
  Sparkles,
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { GithubIcon, LinkedinIcon } from "@/lib/icons"
import { navItems } from "@/data/nav"
import { buildEmail, links } from "@/data/profile"
import { projects } from "@/data/projects"
import { scrollToId } from "@/lib/hooks"
import { useFx } from "@/lib/fx"
import { useProjects } from "@/lib/project-dialog"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Substring search instead of cmdk's fuzzy default. Projects carry long keyword lists (stack, tags), and a
 * fuzzy match against those lets a query like "toggle visual" surface unrelated projects first. Every
 * typed word must appear somewhere; a hit at the start of a word in the item's name ranks highest, a hit
 * elsewhere in the name next, and a hit only in the keywords last.
 */
function matchScore(value: string, search: string, keywords: string[] = []): number {
  const terms = search.toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return 1
  const name = value.toLowerCase()
  const extra = keywords.join(" ").toLowerCase()
  let total = 0
  for (const term of terms) {
    if (name.startsWith(term) || name.includes(` ${term}`)) total += 3
    else if (name.includes(term)) total += 2
    else if (extra.includes(term)) total += 1
    else return 0
  }
  return total / (3 * terms.length)
}

const itemClass =
  "flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 outline-none data-[selected=true]:bg-white/[0.07] data-[selected=true]:text-white"
const groupClass =
  "px-1.5 py-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:text-slate-400"

export default function CommandPalette({ open, onOpenChange }: Props) {
  const { openProject } = useProjects()
  const { effects, toggleEffects, reduced } = useFx()
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!open) setMessage("")
  }, [open])

  const run = (fn: () => void, { keepOpen = false } = {}) => {
    if (!keepOpen) onOpenChange(false)
    window.setTimeout(fn, keepOpen ? 0 : 200)
  }

  const external = (href: string) => run(() => window.open(href, "_blank", "noopener,noreferrer"))

  const copyEmail = () =>
    run(
      async () => {
        try {
          await navigator.clipboard.writeText(buildEmail())
          setMessage("Email address copied to the clipboard.")
        } catch {
          setMessage("Could not copy automatically. Use the Contact section instead.")
        }
      },
      { keepOpen: true },
    )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="palette" hideClose aria-describedby="palette-desc">
        <DialogTitle className="sr-only">Command menu</DialogTitle>
        <DialogDescription id="palette-desc" className="sr-only">
          Search sections, projects and links. Use the arrow keys to move and Enter to select.
        </DialogDescription>
        <Command label="Command menu" loop filter={matchScore} className="flex max-h-[min(70vh,34rem)] flex-col">
          <div className="flex items-center gap-3 border-b border-white/10 px-4">
            <Search className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
            <Command.Input
              autoFocus
              placeholder="Jump to a section, open a project, find a skill…"
              className="h-14 w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-slate-400"
            />
            <kbd className="shrink-0 rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
              Esc
            </kbd>
          </div>

          <Command.List className="overflow-y-auto overscroll-contain p-2">
            <Command.Empty className="px-4 py-10 text-center text-sm text-muted-foreground">
              Nothing matches that. Try “Claude”, “RAG”, “live” or a project name.
            </Command.Empty>

            <Command.Group heading="Go to" className={groupClass}>
              {[{ id: "top", label: "Top" }, ...navItems, { id: "contact", label: "Contact" }].map((item) => (
                <Command.Item
                  key={item.id}
                  value={`go ${item.label}`}
                  onSelect={() => run(() => scrollToId(item.id))}
                  className={itemClass}
                >
                  <Compass className="size-4 text-cyan-300" aria-hidden="true" />
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Projects" className={groupClass}>
              {projects.map((p) => (
                <Command.Item
                  key={p.slug}
                  value={`${p.title} ${p.kicker}`}
                  keywords={[...p.stack, ...p.tags, p.status.label, p.role]}
                  onSelect={() => run(() => openProject(p.slug))}
                  className={itemClass}
                >
                  <FolderGit2 className="size-4 shrink-0 text-violet-300" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">
                    {p.title}
                    <span className="ml-2 text-xs text-slate-400">{p.kicker}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    {p.status.label}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Links" className={groupClass}>
              <LinkItem icon={<GithubIcon className="size-4" />} label="GitHub · konethegreatest (primary)" onSelect={() => external(links.githubMain)} />
              <LinkItem icon={<GithubIcon className="size-4" />} label="GitHub · konethegreat (personal & coursework)" onSelect={() => external(links.githubPersonal)} />
              <LinkItem icon={<LinkedinIcon className="size-4" />} label="LinkedIn" onSelect={() => external(links.linkedin)} />
              <LinkItem icon={<BadgeCheck className="size-4" />} label="Credly badges" onSelect={() => external(links.credly)} />
              <LinkItem icon={<BadgeCheck className="size-4" />} label="Verify the IBM certificate" onSelect={() => external(links.ibmCert)} />
              <Command.Item value="download cv resume pdf" onSelect={() => run(() => window.open(links.cv, "_blank", "noopener"))} className={itemClass}>
                <Download className="size-4 text-emerald-300" aria-hidden="true" />
                Download CV (PDF)
              </Command.Item>
              <Command.Item value="copy email address contact" onSelect={copyEmail} className={itemClass}>
                <Copy className="size-4 text-emerald-300" aria-hidden="true" />
                Copy email address
              </Command.Item>
              <Command.Item value="send email mail contact" onSelect={() => run(() => (window.location.href = `mailto:${buildEmail()}`))} className={itemClass}>
                <Mail className="size-4 text-emerald-300" aria-hidden="true" />
                Write an email
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Preferences" className={groupClass}>
              <Command.Item
                value="toggle visual effects particles cursor motion"
                onSelect={() => run(toggleEffects, { keepOpen: true })}
                disabled={reduced}
                className={itemClass}
              >
                <Sparkles className="size-4 text-fuchsia-300" aria-hidden="true" />
                {reduced ? "Visual effects are off (reduced motion)" : effects ? "Turn visual effects off" : "Turn visual effects on"}
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-2.5 text-xs text-slate-400">
            <span role="status" aria-live="polite" className="min-h-4 text-emerald-300">
              {message}
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <CornerDownLeft className="size-3.5" aria-hidden="true" /> to select
              <ArrowUpRight className="ml-2 size-3.5" aria-hidden="true" /> links open in a new tab
            </span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function LinkItem({ icon, label, onSelect }: { icon: ReactNode; label: string; onSelect: () => void }) {
  return (
    <Command.Item value={`link ${label}`} onSelect={onSelect} className={itemClass}>
      <span className="text-emerald-300" aria-hidden="true">
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      <ArrowUpRight className="size-3.5 text-slate-400" aria-hidden="true" />
    </Command.Item>
  )
}

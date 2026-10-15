import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { clearHash, pushHash, setHash } from "@/lib/hooks"
import { projectBySlug } from "@/data/projects"

const ProjectDialog = lazy(() => import("@/components/sections/ProjectDialog"))

interface Ctx {
  openProject: (slug: string) => void
  closeProject: () => void
  activeSlug: string | null
}

const ProjectCtx = createContext<Ctx | null>(null)
const PREFIX = "project/"
/** Stored in history.state for the entry this dialog added, so closing knows it may step back. */
const MARK = "project-dialog"
const hasProjectHash = () => window.location.hash.startsWith(`#${PREFIX}`)

export function ProjectDialogProvider({ children }: { children: ReactNode }) {
  // `slug` is kept mounted for a moment after closing so the exit animation can play.
  const [slug, setSlug] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const timer = useRef<number | undefined>(undefined)

  const show = useCallback((next: string) => {
    window.clearTimeout(timer.current)
    openRef.current = true
    setSlug(next)
    setOpen(true)
  }, [])

  const hide = useCallback(() => {
    openRef.current = false
    setOpen(false)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setSlug(null), 260)
  }, [])

  const openProject = useCallback(
    (next: string) => {
      if (!projectBySlug(next)) return
      show(next)
      // The first case study opened from the page adds one history entry, so Back closes it instead of
      // leaving the site. Moving between case studies (previous / next) swaps that entry's hash.
      if (hasProjectHash()) setHash(`${PREFIX}${next}`, window.history.state)
      else pushHash(`${PREFIX}${next}`, MARK)
    },
    [show],
  )

  const closeProject = useCallback(() => {
    hide()
    if (window.history.state === MARK) window.history.back()
    else if (hasProjectHash()) clearHash()
  }, [hide])

  // Deep links and history: /#project/sentinel opens that case study on load and whenever the address
  // changes to it; Back, Forward or an edited address that leaves a case study closes it.
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.replace(/^#/, "")
      const target = hash.startsWith(PREFIX) ? hash.slice(PREFIX.length) : ""
      if (target && projectBySlug(target)) show(target)
      else if (openRef.current) hide()
    }
    sync()
    window.addEventListener("hashchange", sync)
    window.addEventListener("popstate", sync)
    return () => {
      window.removeEventListener("hashchange", sync)
      window.removeEventListener("popstate", sync)
      window.clearTimeout(timer.current)
    }
  }, [show, hide])

  const value = useMemo(
    () => ({ openProject, closeProject, activeSlug: open ? slug : null }),
    [openProject, closeProject, open, slug],
  )

  return (
    <ProjectCtx.Provider value={value}>
      {children}
      {slug && (
        <Suspense fallback={null}>
          <ProjectDialog slug={slug} open={open} onClose={closeProject} onNavigate={openProject} />
        </Suspense>
      )}
    </ProjectCtx.Provider>
  )
}

export function useProjects(): Ctx {
  const ctx = useContext(ProjectCtx)
  if (!ctx) throw new Error("useProjects must be used inside <ProjectDialogProvider>")
  return ctx
}

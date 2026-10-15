import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Download, Menu, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { GithubIcon, LinkedinIcon } from "@/lib/icons"
import { navItems, sectionIds } from "@/data/nav"
import { links } from "@/data/profile"
import { useFinePointer, useScrollSpy, scrollToId } from "@/lib/hooks"
import { useFx } from "@/lib/fx"
import { cn } from "@/lib/utils"

interface NavbarProps {
  onOpenPalette: () => void
}

export function Navbar({ onOpenPalette }: NavbarProps) {
  const active = useScrollSpy(sectionIds)
  const [scrolled, setScrolled] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const { effects, toggleEffects, reduced } = useFx()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const go = (id: string) => {
    setSheetOpen(false)
    window.setTimeout(() => scrollToId(id), sheetOpen ? 220 : 0)
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled ? "border-b border-white/[0.07] bg-[#05060d]/70 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            scrollToId("top")
          }}
          className="group flex items-center gap-3"
          aria-label="Kone Tshivhinda, back to top"
        >
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-xl bg-[image:var(--grad)] font-display text-lg font-bold text-[#05060d] shadow-[0_8px_30px_-8px_rgb(139_92_246/0.9)] transition group-hover:scale-105"
          >
            K
          </span>
          <span aria-hidden="true" className="hidden font-mono text-sm text-slate-300 sm:block">
            kone<span className="text-cyan-300">@</span>jhb<span className="fx-anim animate-blink text-cyan-300">_</span>
          </span>
        </a>

        <div className="absolute left-1/2 top-3 hidden -translate-x-1/2 xl:block">
          <StackingNav active={active} onGo={go} />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenPalette}
            aria-label="Search: open the command menu"
            aria-keyshortcuts="Control+K Meta+K"
            className="gap-2 pr-2.5 text-slate-300"
          >
            <Search aria-hidden="true" />
            <span className="hidden md:inline">Search</span>
            <kbd
              aria-hidden="true"
              className="hidden rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 md:inline"
            >
              Ctrl K
            </kbd>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleEffects}
            aria-pressed={effects && !reduced}
            aria-label={reduced ? "Visual effects are off (your system prefers reduced motion)" : "Visual effects"}
            title={reduced ? "Effects off: reduced motion is on" : effects ? "Turn visual effects off" : "Turn visual effects on"}
            disabled={reduced}
            className={cn("size-9", effects && !reduced ? "text-cyan-300" : "text-slate-400")}
          >
            <Sparkles aria-hidden="true" />
          </Button>

          <Button asChild variant="glow" size="sm" className="hidden xl:inline-flex">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                scrollToId("contact")
              }}
            >
              Contact <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="size-9 xl:hidden"
            aria-label="Open the menu"
            aria-haspopup="dialog"
            onClick={() => setSheetOpen(true)}
          >
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </div>

      <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
        <DialogContent variant="sheet" closeLabel="Close the menu">
          <DialogTitle className="sr-only">Menu</DialogTitle>
          <DialogDescription className="sr-only">Jump to a section of the portfolio.</DialogDescription>
          <div className="mx-auto flex min-h-full max-w-lg flex-col px-6 pb-10 pt-20">
            <nav aria-label="Sections">
              <ul className="space-y-1">
                {[...navItems, { id: "contact", label: "Contact" }].map((item, i) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => go(item.id)}
                      className={cn(
                        "flex w-full items-baseline gap-4 rounded-xl px-3 py-3 text-left font-display text-4xl font-semibold tracking-tight transition hover:bg-white/[0.05]",
                        active === item.id ? "text-gradient" : "text-foreground",
                      )}
                    >
                      <span className="font-mono text-xs font-normal text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="glow">
                <a href={links.cv} download>
                  Download CV <Download aria-hidden="true" />
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSheetOpen(false)
                  window.setTimeout(onOpenPalette, 220)
                }}
              >
                <Search aria-hidden="true" /> Search
              </Button>
            </div>

            <div className="mt-auto flex items-center gap-5 pt-10 text-slate-300">
              <a href={links.githubMain} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm hover:text-white">
                <GithubIcon className="size-4" /> konethegreatest
              </a>
              <a href={links.githubPersonal} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm hover:text-white">
                <GithubIcon className="size-4" /> konethegreat
              </a>
              <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm hover:text-white">
                <LinkedinIcon className="size-4" /> LinkedIn
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}

/* ------------------------------------------------------------------------------------------
   Stacking navbar — adapted from the 21st.dev "Stacking navbar".
   Collapsed: the pills fold into a deck behind the section you are in.
   Expanded (hover or keyboard focus): they fan out into a row, staggered by distance.
------------------------------------------------------------------------------------------- */
const W = 84
const GAP = 4
const PEEK = 8
const MAX_PEEK = 3

function StackingNav({ active, onGo }: { active: string; onGo: (id: string) => void }) {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const [hover, setHover] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const leaveTimer = useRef<number | undefined>(undefined)
  const expanded = !fine || hover || focusWithin

  const n = navItems.length
  const foundIndex = navItems.findIndex((item) => item.id === active)
  // Above the first section the deck sits at the start; at the contact section (the last stop, which has
  // its own button) it folds behind the last pill, and no pill is highlighted in either case.
  const activeIndex = active === "contact" ? n - 1 : Math.max(0, foundIndex)
  const widthExpanded = n * W + (n - 1) * GAP
  const widthCollapsed = W + 2 * MAX_PEEK * PEEK

  useEffect(() => () => window.clearTimeout(leaveTimer.current), [])

  return (
    <motion.nav
      aria-label="Sections"
      className="relative h-10"
      initial={false}
      animate={{ width: expanded ? widthExpanded : widthCollapsed }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
      onPointerEnter={() => {
        window.clearTimeout(leaveTimer.current)
        setHover(true)
      }}
      onPointerLeave={() => {
        window.clearTimeout(leaveTimer.current)
        leaveTimer.current = window.setTimeout(() => setHover(false), 140)
      }}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false)
      }}
    >
      {navItems.map((item, i) => {
        const dist = i - activeIndex
        const absDist = Math.abs(dist)
        const isActive = foundIndex >= 0 && i === foundIndex
        const collapsedX = MAX_PEEK * PEEK + Math.max(-MAX_PEEK, Math.min(MAX_PEEK, dist)) * PEEK
        const x = expanded ? i * (W + GAP) : collapsedX
        return (
          <motion.a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault()
              onGo(item.id)
            }}
            aria-current={isActive ? "location" : undefined}
            tabIndex={0}
            initial={false}
            animate={{
              x,
              scale: expanded ? 1 : Math.max(0.84, 1 - absDist * 0.045),
              opacity: expanded ? 1 : isActive ? 1 : Math.max(0.28, 0.85 - absDist * 0.22),
            }}
            transition={
              reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 28, delay: expanded ? absDist * 0.03 : 0 }
            }
            style={{ zIndex: 60 - absDist, width: W }}
            className={cn(
              "absolute left-0 top-0 grid h-10 place-items-center rounded-full text-[13px] font-medium no-underline backdrop-blur-lg transition-colors duration-300",
              // While the deck is folded only the front pill is a target; the slivers behind it are too small to hit,
              // so they take no pointer events. Hovering the deck fans it out, and keyboard focus does the same.
              !expanded && !isActive && "pointer-events-none",
              isActive
                ? "bg-[image:var(--grad)] text-[#05060d] shadow-[0_8px_28px_-10px_rgb(139_92_246/0.9)]"
                : "border border-white/10 bg-[#0c1024]/80 text-slate-300 hover:bg-white/15 hover:text-white",
            )}
          >
            {item.label}
          </motion.a>
        )
      })}
    </motion.nav>
  )
}

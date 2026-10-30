import * as Dialog from "@radix-ui/react-dialog"
import {
  BadgeCheck,
  FlaskConical,
  FolderKanban,
  House,
  Layers,
  Mail,
  Moon,
  Sun,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { CommandMenu } from "@/components/nav/command-menu"
import { RadialTrigger } from "@/components/nav/radial-trigger"
import { Link } from "@/components/ui/link"
import { useRouter } from "@/lib/router"
import { useTheme } from "@/lib/theme"

type Mode = "radial" | "command" | null

interface RadialItem {
  label: string
  to: string
  icon: LucideIcon
  current: (path: string) => boolean
}

const items: RadialItem[] = [
  { label: "Home", to: "/", icon: House, current: (path) => path === "/" },
  { label: "Work", to: "/work", icon: FolderKanban, current: (path) => path === "/work" || path.startsWith("/work/") },
  { label: "Services", to: "/services", icon: Layers, current: (path) => path === "/services" },
  { label: "About", to: "/about", icon: UserRound, current: (path) => path === "/about" },
  { label: "Playground", to: "/playground", icon: FlaskConical, current: (path) => path === "/playground" },
  { label: "Contact", to: "/contact", icon: Mail, current: (path) => path === "/contact" },
  { label: "Credo", to: "/credits", icon: BadgeCheck, current: (path) => path === "/credits" },
]

const itemClass =
  "radial-item flex size-24 flex-col items-center justify-center gap-1 rounded-full border border-border bg-card/80 text-center text-sm font-medium text-foreground shadow-sm backdrop-blur transition hover:border-primary hover:bg-accent focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring lg:size-28"

const currentClass = "border-primary ring-2 ring-primary/35 text-primary"

export function NavigationMenu() {
  const [mode, setMode] = useState<Mode>(null)
  const { path } = useRouter()
  const { resolved, toggle } = useTheme()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mode) return
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return
      const target = event.target as HTMLElement | null
      if (target?.isContentEditable || (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
      event.preventDefault()
      setMode("command")
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mode])

  useEffect(() => {
    if (mode !== "radial") return
    const frame = requestAnimationFrame(() => visibleItems(contentRef.current)[0]?.focus())
    return () => cancelAnimationFrame(frame)
  }, [mode])

  const onRingKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return
    const focusable = visibleItems(contentRef.current)
    if (!focusable.length) return
    event.preventDefault()
    const at = focusable.indexOf(document.activeElement as HTMLElement)
    const last = focusable.length - 1
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? last
          : event.key === "ArrowRight" || event.key === "ArrowDown"
            ? at >= last ? 0 : at + 1
            : at <= 0 ? last : at - 1
    focusable[next]?.focus()
  }

  const renderItem = (item: RadialItem, index: number, mobile = false): ReactNode => {
    const Icon = item.icon
    const isCurrent = item.current(path)
    return (
      <Link
        to={item.to}
        data-radial-item
        aria-current={isCurrent ? "page" : undefined}
        onClick={() => setMode(null)}
        className={
          mobile
            ? "radial-item flex items-center gap-3 rounded-xl border border-border bg-card/80 px-4 py-3 text-sm font-medium backdrop-blur transition hover:border-primary hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring " +
              (isCurrent ? currentClass : "")
            : itemClass + " " + (isCurrent ? currentClass : "")
        }
        style={{ animationDelay: `${80 + index * 36}ms` }}
      >
        <Icon className={mobile ? "size-4 text-primary" : "size-5 text-primary"} aria-hidden="true" />
        <span className={mobile ? "flex-1" : ""}>{item.label}</span>
      </Link>
    )
  }

  const themeItem = (mobile = false): ReactNode => {
    const Icon = resolved === "dark" ? Sun : Moon
    return (
      <button
        type="button"
        data-radial-item
        onClick={toggle}
        aria-label={`Switch to ${resolved === "dark" ? "light" : "dark"} theme`}
        aria-pressed={resolved === "dark"}
        style={{ animationDelay: `${80 + items.length * 36}ms` }}
        className={
          mobile
            ? "radial-item flex items-center gap-3 rounded-xl border border-border bg-card/80 px-4 py-3 text-sm font-medium backdrop-blur transition hover:border-primary hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
            : itemClass
        }
      >
        <Icon className={mobile ? "size-4 text-primary" : "size-5 text-primary"} aria-hidden="true" />
        <span className={mobile ? "flex-1" : ""}>Theme</span>
      </button>
    )
  }

  return (
    <>
      <Dialog.Root open={mode === "radial"} onOpenChange={(next) => setMode(next ? "radial" : null)}>
        <Dialog.Trigger asChild>
          <RadialTrigger onClick={() => setMode("radial")} />
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-background/85 backdrop-blur-2xl data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in" />
          <Dialog.Content
            ref={contentRef}
            onOpenAutoFocus={(event) => event.preventDefault()}
            onKeyDown={onRingKeyDown}
            className="radial-content fixed inset-0 z-[90] flex flex-col items-center justify-center gap-10 px-4 py-16 focus:outline-none data-[state=closed]:animate-overlay-out"
          >
            <Dialog.Title className="sr-only">Site menu</Dialog.Title>
            <Dialog.Description className="sr-only">
              Seven pages and a theme switch arranged in a ring. Use the arrow keys to move, Enter to
              open, Escape to close.
            </Dialog.Description>

            <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:left-8 sm:top-8">
              Kone Tshivhinda / Index
            </div>
            <Dialog.Close
              aria-label="Close menu"
              className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/70 text-muted-foreground backdrop-blur transition hover:text-foreground sm:right-8 sm:top-8"
            >
              <X className="size-4" aria-hidden="true" />
            </Dialog.Close>

            <div className="radial-ring relative hidden size-[min(84vw,36rem)] sm:block">
              <span aria-hidden="true" className="absolute inset-[6%] rounded-full border border-dashed border-border" />
              <span aria-hidden="true" className="absolute inset-[24%] rounded-full border border-border/60" />
              <span
                aria-hidden="true"
                className="absolute inset-[24%] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_10%,transparent),transparent_70%)]"
              />
              <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
                <span className="font-serif text-3xl italic text-muted-foreground">Index</span>
              </div>
              <ul aria-label="Site">
                {items.map((item, index) => {
                  const angle = (index / 8) * 360
                  return (
                    <li
                      key={item.label}
                      className="absolute left-1/2 top-1/2"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(var(--radial-radius) * -1)) rotate(${-angle}deg)`,
                      }}
                    >
                      {renderItem(item, index)}
                    </li>
                  )
                })}
                <li
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform:
                      "translate(-50%, -50%) rotate(315deg) translateY(calc(var(--radial-radius) * -1)) rotate(-315deg)",
                  }}
                >
                  {themeItem()}
                </li>
              </ul>
            </div>

            <ul aria-label="Site" className="grid w-full max-w-md grid-cols-2 gap-2 sm:hidden">
              {items.map((item, index) => (
                <li key={item.label}>{renderItem(item, index, true)}</li>
              ))}
              <li>{themeItem(true)}</li>
            </ul>

            <p className="absolute bottom-6 left-1/2 w-full -translate-x-1/2 px-6 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Arrow keys move · Enter opens · Esc closes · Ctrl K searches
            </p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <CommandMenu open={mode === "command"} onOpenChange={(next) => setMode(next ? "command" : null)} />
    </>
  )
}

function visibleItems(root: HTMLElement | null): HTMLElement[] {
  if (!root) return []
  return Array.from(root.querySelectorAll<HTMLElement>("[data-radial-item]")).filter(
    (element) => element.offsetParent !== null,
  )
}

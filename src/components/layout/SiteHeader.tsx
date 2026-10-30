import { Moon, Sun } from "lucide-react"
import { Link } from "@/components/ui/link"
import { navItems } from "@/data/nav"
import { useTheme } from "@/lib/theme"

export function SiteHeader() {
  const { resolved, toggle } = useTheme()
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-sm uppercase tracking-[0.18em]">
          Kone Tshivhinda
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.id === "home" ? "/" : `/${item.id}`}
              className="rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${resolved === "dark" ? "light" : "dark"} theme`}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:text-foreground"
          >
            {resolved === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <Link
            to="/contact"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground sm:inline-flex"
          >
            Start a project
          </Link>
        </div>
      </div>
    </header>
  )
}

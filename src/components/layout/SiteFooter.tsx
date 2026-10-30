import { Link } from "@/components/ui/link"
import { links } from "@/data/profile"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© 2026 Kone Tshivhinda. Built in Johannesburg.</p>
        <div className="flex flex-wrap items-center gap-4">
          <a href={links.github} rel="noopener noreferrer" target="_blank" className="hover:text-foreground">
            GitHub
          </a>
          <a href={links.linkedin} rel="noopener noreferrer" target="_blank" className="hover:text-foreground">
            LinkedIn
          </a>
          <Link to="/credits" className="hover:text-foreground">
            Credits
          </Link>
        </div>
      </div>
    </footer>
  )
}

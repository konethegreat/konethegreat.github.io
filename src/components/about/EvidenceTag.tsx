import { ArrowUpRight } from "lucide-react"
import { Link } from "@/components/ui/link"
import type { EvidenceLink } from "@/data/about"
import { cn } from "@/lib/utils"

export function EvidenceTag({ link, className }: { link: EvidenceLink; className?: string }) {
  const classes = cn(
    "inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium transition hover:border-primary hover:text-primary",
    className,
  )
  const content = (
    <>
      {link.label}
      <ArrowUpRight className="size-3" aria-hidden="true" />
    </>
  )
  if (link.to.startsWith("/")) {
    return (
      <Link to={link.to} className={classes}>
        {content}
      </Link>
    )
  }
  return (
    <a href={link.to} target="_blank" rel="noopener noreferrer" className={classes}>
      {content}
    </a>
  )
}

import type { ReactNode } from "react"
import { Reveal } from "@/components/fx/Reveal"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  id: string
  index?: string
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  align?: "left" | "center"
  className?: string
}

export function SectionHeading({ id, index, eyebrow, title, lead, align = "left", className }: SectionHeadingProps) {
  return (
    <header className={cn("mb-10 max-w-3xl md:mb-14", align === "center" && "mx-auto text-center", className)}>
      <Reveal>
        <p
          className={cn(
            "mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-cyan-300",
            align === "center" && "justify-center",
          )}
        >
          {index && (
            <>
              <span className="text-slate-400">{index}</span>
              <span aria-hidden="true" className="h-px w-10 bg-gradient-to-r from-cyan-400 to-transparent" />
            </>
          )}
          {eyebrow}
        </p>
        <h2 id={id} className="font-display text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h2>
        {lead && <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">{lead}</p>}
      </Reveal>
    </header>
  )
}

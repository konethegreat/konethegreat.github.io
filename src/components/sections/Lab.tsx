/* Written by Kone Tshivhinda & Claude */
import { useRef, useState, type KeyboardEvent } from "react"
import { Reveal } from "@/components/fx/Reveal"
import { AgentLoopDemo } from "@/components/lab/AgentLoopDemo"
import { AgenticRagDemo } from "@/components/lab/AgenticRagDemo"
import { AutonomyLadder } from "@/components/lab/AutonomyLadder"
import { HybridRagDemo } from "@/components/lab/HybridRagDemo"
import { Practices } from "@/components/lab/Practices"
import { SectionHeading } from "@/components/ui/section-heading"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "hybrid", label: "Hybrid RAG", Panel: HybridRagDemo },
  { id: "agentic", label: "Agentic RAG", Panel: AgenticRagDemo },
  { id: "loop", label: "Agent loop", Panel: AgentLoopDemo },
  { id: "ladder", label: "Autonomy ladder", Panel: AutonomyLadder },
] as const

export function Lab() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("hybrid")
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const move = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "Home" ? -i : e.key === "End" ? tabs.length - 1 - i : 0
    if (!move) return
    e.preventDefault()
    const next = (i + move + tabs.length) % tabs.length
    setActive(tabs[next].id)
    refs.current[next]?.focus()
  }
  const current = tabs.find((t) => t.id === active) ?? tabs[0]

  return (
    <section id="lab" aria-labelledby="lab-title" className="section-anchor relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="lab-title"
          index="03"
          eyebrow="AI lab"
          title={
            <>
              How I think about agents, <span className="text-gradient">RAG and trust.</span>
            </>
          }
          lead="Four small working models of the ideas behind my agent projects. Two run real retrieval over this portfolio's own project data, in your browser, with no model, no network and no tracking. Each is labelled with exactly what is real and what is scripted."
        />

        <Reveal>
          <div role="tablist" aria-label="AI lab demos" className="mb-8 flex flex-wrap gap-2">
            {tabs.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => {
                  refs.current[i] = el
                }}
                id={`lab-tab-${t.id}`}
                role="tab"
                type="button"
                aria-selected={active === t.id}
                aria-controls={`lab-panel-${t.id}`}
                tabIndex={active === t.id ? 0 : -1}
                onClick={() => setActive(t.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition",
                  active === t.id
                    ? "border-transparent bg-[image:var(--grad)] font-semibold text-[#05060d]"
                    : "border-white/12 bg-white/[0.03] text-slate-300 hover:border-white/30 hover:text-white",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div id={`lab-panel-${current.id}`} role="tabpanel" aria-labelledby={`lab-tab-${current.id}`} tabIndex={0} className="outline-none">
          <current.Panel />
        </div>

        <Practices />
      </div>
    </section>
  )
}

/* Written by Kone Tshivhinda & Claude */
import { Reveal } from "@/components/fx/Reveal"
import { Badge } from "@/components/ui/badge"
import { practiceStatusLabel, practices, type PracticeStatus } from "@/data/lab"
import { useProjects } from "@/lib/project-dialog"

const variant: Record<PracticeStatus, "code" | "wip" | "live"> = { built: "code", designed: "wip", here: "live" }

export function Practices() {
  const { openProject } = useProjects()
  return (
    <div className="mt-20">
      <Reveal>
        <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Practices, with the proof beside them</h3>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Eight things I would expect from a serious agent system, and where each one actually exists. A practice marked designed is written down
          but not built, and says so.
        </p>
      </Reveal>
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {practices.map((p, i) => (
          <li key={p.id} className="h-full">
            <Reveal delay={(i % 4) * 0.05} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <Badge variant={variant[p.status]} className="self-start font-mono text-[10px] font-medium uppercase tracking-wider">
                  {practiceStatusLabel[p.status]}
                </Badge>
                <h4 className="mt-3 font-display text-lg font-semibold leading-snug">{p.title}</h4>
                <p className="mt-1 text-sm text-slate-200">{p.line}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{p.body}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                  {p.proof.map((x) => (
                    <button
                      key={x.slug}
                      type="button"
                      onClick={() => openProject(x.slug)}
                      className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-2 py-1 font-mono text-[11px] text-cyan-100 transition hover:bg-cyan-300/20"
                    >
                      {x.label}
                    </button>
                  ))}
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  )
}

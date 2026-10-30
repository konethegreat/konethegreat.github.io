import { EvidenceTag } from "@/components/about/EvidenceTag"
import { stackProof } from "@/data/about"
import { aiSkills, techSkills } from "@/data/skills"

export function StackGrid() {
  const groups = [...aiSkills, ...techSkills]
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => {
        const proof = stackProof[group.id] ?? []
        return (
          <article key={group.id} className="flex h-full flex-col rounded-3xl border border-border bg-card/60 p-5">
            <h3 className="font-serif text-2xl leading-tight">{group.title}</h3>
            {group.blurb && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.blurb}</p>}
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[10px] leading-none text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
            {proof.length > 0 && (
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                {proof.map((link) => (
                  <EvidenceTag key={link.to} link={link} />
                ))}
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

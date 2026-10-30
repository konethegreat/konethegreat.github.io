import type { CreditEntry } from "@/data/types"
import { credits } from "@/data/credits"

const groups: Array<{ id: CreditEntry["group"]; title: string; lead: string }> = [
  {
    id: "components",
    title: "Components and inspiration",
    lead: "Components adapted from the UI Vault and older studio work, plus the references that shaped original implementations.",
  },
  {
    id: "libraries",
    title: "Libraries",
    lead: "Runtime and build dependencies, used unmodified.",
  },
  {
    id: "typefaces",
    title: "Typefaces",
    lead: "Fonts self-hosted with Fontsource under the SIL Open Font License.",
  },
]

const licenseHref: Record<CreditEntry["license"], string | null> = {
  MIT: "/licenses/mit.txt",
  ISC: "/licenses/isc.txt",
  OFL: "/licenses/ofl-1.1.txt",
  original: null,
  inspiration: null,
}

const licenseLabel: Record<CreditEntry["license"], string> = {
  MIT: "MIT license",
  ISC: "ISC license",
  OFL: "OFL license",
  original: "Original work",
  inspiration: "No license recorded",
}

export function CreditsPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Credits</p>
          <h1 className="mt-4 max-w-4xl text-balance font-serif text-5xl leading-[0.94] sm:text-7xl">
            Credits and licenses.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Every third-party piece, with its author, source, license and what changed. Components
            adapted from the UI Vault are also credited where they appear.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 lg:px-8">
        {groups.map((group) => {
          const entries = credits.filter((credit) => credit.group === group.id)
          return (
            <section key={group.id} aria-labelledby={`credits-${group.id}-title`}>
              <div className="max-w-2xl">
                <h2 id={`credits-${group.id}-title`} className="font-serif text-4xl leading-[1.02] sm:text-5xl">
                  {group.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{group.lead}</p>
              </div>
              <ul className="mt-8 grid gap-4 md:grid-cols-2">
                {entries.map((credit) => {
                  const href = licenseHref[credit.license]
                  return (
                    <li key={credit.name}>
                      <article className="h-full rounded-3xl border border-border bg-card/60 p-5 sm:p-6">
                        <h3 className="font-serif text-2xl leading-tight">
                          <a
                            href={credit.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline-offset-4 hover:underline"
                          >
                            {credit.name}
                          </a>
                        </h3>
                        <dl className="mt-4 space-y-3 text-sm leading-relaxed">
                          <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
                            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                              Author
                            </dt>
                            <dd>{credit.author}</dd>
                          </div>
                          <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
                            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                              License
                            </dt>
                            <dd>
                              {href ? (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium underline underline-offset-4 hover:text-primary"
                                >
                                  {licenseLabel[credit.license]}
                                </a>
                              ) : (
                                <span>{licenseLabel[credit.license]}</span>
                              )}
                            </dd>
                          </div>
                          <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
                            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                              Used for
                            </dt>
                            <dd>{credit.usedFor}</dd>
                          </div>
                          <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
                            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                              What changed
                            </dt>
                            <dd>{credit.adapted}</dd>
                          </div>
                        </dl>
                      </article>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card/60 p-6 text-sm leading-relaxed text-muted-foreground">
          The two inspiration entries record no license because none was recorded at the source. No
          source code from them was used. If a rights holder believes an attribution is wrong, the
          email on the contact page reaches me directly.
        </div>
      </section>
    </>
  )
}

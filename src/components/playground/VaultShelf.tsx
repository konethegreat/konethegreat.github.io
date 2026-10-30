import { ArrowUpRight } from "lucide-react"
import { Link } from "@/components/ui/link"
import { vaultHref, vaultShelf } from "@/data/playground"

export function VaultShelf() {
  return (
    <section aria-labelledby="vault-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">UI Vault</p>
          <h2 id="vault-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
            From the vault, running here.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Selected patterns from the UI Vault that are live on this site. Every adapted component is
            credited beside where it appears, with the author and the license.
          </p>
        </div>
        <a
          href={vaultHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary"
        >
          Open the full vault
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </div>

      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {vaultShelf.map((item) => {
          const external = item.live.to.startsWith("http")
          return (
            <li key={item.id}>
              <article className="flex h-full flex-col rounded-3xl border border-border bg-card/60 p-6">
                <h3 className="font-serif text-2xl leading-tight">{item.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                  <a
                    href={item.credit.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline underline-offset-4 hover:text-foreground"
                  >
                    {item.credit.author}, {item.credit.license}
                  </a>
                </p>
                {external ? (
                  <a
                    href={item.live.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {item.live.label}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    to={item.live.to}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {item.live.label}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </Link>
                )}
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

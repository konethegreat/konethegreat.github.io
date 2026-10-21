import { ArrowUp } from "lucide-react"
import { navItems } from "@/data/nav"
import { links, site } from "@/data/profile"
import { GithubIcon, LinkedinIcon } from "@/lib/icons"
import { scrollToId } from "@/lib/hooks"

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] bg-[#04050b]/80 pb-10 pt-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault()
                scrollToId("top")
              }}
              className="inline-flex items-center gap-3"
              aria-label={`${site.name}, back to the top`}
            >
              <span aria-hidden="true" className="grid size-10 place-items-center rounded-xl bg-[image:var(--grad)] font-display text-xl font-bold text-[#05060d]">
                K
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">{site.name}</span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {site.title}. Building agentic, auditable and sovereign AI systems from {site.location}.
            </p>
            <div className="mt-5 flex items-center gap-4 text-slate-300">
              <a href={links.github} target="_blank" rel="noopener noreferrer" aria-label="konethegreat on GitHub (opens in a new tab)" className="transition hover:text-white">
                <GithubIcon className="size-5" />
              </a>
              <a href={links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" className="transition hover:text-white">
                <LinkedinIcon className="size-5" />
              </a>
            </div>
          </div>

          <nav aria-label="Footer">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">Sections</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {[...navItems, { id: "contact", label: "Contact" }].map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToId(item.id)
                    }}
                    className="text-slate-300 transition hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">How this site is built</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              React, TypeScript, Vite, Tailwind CSS and Framer Motion, deployed to GitHub Pages. Interface ideas are adapted from community
              components on{" "}
              <a
                href="https://21st.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 underline decoration-cyan-300/50 underline-offset-4 transition hover:decoration-cyan-300"
              >
                21st.dev<span className="sr-only"> (opens in a new tab)</span>
              </a>{" "}
              (shutter hero, animated hero, stacking navbar, radial orbital timeline) and from my own UI Vault.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.07] pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl leading-relaxed">
            Status labels are meant literally: <span className="text-slate-300">Live</span> runs today, <span className="text-slate-300">Public source</span>{" "}
            can be read, <span className="text-slate-300">Local</span> lives only on my machine.
          </p>
          <div className="flex items-center gap-4">
            <p className="font-mono">&copy; 2026 {site.name} · updated {site.updated}</p>
            <button
              type="button"
              onClick={() => scrollToId("top")}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-slate-300 transition hover:border-white/30 hover:text-white"
            >
              <ArrowUp className="size-3.5" aria-hidden="true" /> Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

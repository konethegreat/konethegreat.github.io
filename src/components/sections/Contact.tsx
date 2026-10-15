import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react"
import { ArrowUpRight, Award, BadgeCheck, Check, Copy, Download, Eye, Mail } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { Button } from "@/components/ui/button"
import { buildEmail, links, site } from "@/data/profile"
import { GithubIcon, LinkedinIcon } from "@/lib/icons"

type IconType = ComponentType<SVGProps<SVGSVGElement> & { className?: string }>

const channels: { label: string; handle: string; href: string; Icon: IconType }[] = [
  { label: "LinkedIn", handle: "Kone Tshivhinda", href: links.linkedin, Icon: LinkedinIcon },
  { label: "GitHub · primary", handle: "@konethegreatest", href: links.githubMain, Icon: GithubIcon },
  { label: "GitHub · personal", handle: "@konethegreat", href: links.githubPersonal, Icon: GithubIcon },
  { label: "Credly", handle: "Verified badges", href: links.credly, Icon: BadgeCheck },
  { label: "IBM certificate", handle: "Verify on Coursera", href: links.ibmCert, Icon: Award },
]

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section-anchor relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#070916]/80 p-7 shadow-[0_40px_140px_-50px_rgb(139_92_246/0.65)] sm:p-12 lg:p-16">
            <div aria-hidden="true" className="bg-grid mask-radial absolute inset-0 opacity-50" />
            <div
              aria-hidden="true"
              className="absolute -left-24 -top-24 size-96 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.2),transparent)]"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-32 -right-20 size-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(244,114,182,0.2),transparent)]"
            />

            <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
              <div>
                <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-cyan-300">
                  <span className="text-slate-400">08</span>
                  <span aria-hidden="true" className="h-px w-10 bg-gradient-to-r from-cyan-400 to-transparent" />
                  Contact
                </p>
                <h2 id="contact-title" className="font-display text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl md:text-6xl">
                  Let&rsquo;s build something <span className="text-gradient">auditable.</span>
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  A question about one of the systems above, a project you have in mind, or a conversation about agentic engineering in
                  South Africa: write to me, or find me wherever I am most active.
                </p>

                <div className="mt-8">
                  <ContactActions />
                </div>

                <p className="mt-8 font-mono text-xs text-slate-400">{site.location} · replies by email or LinkedIn</p>
              </div>

              <ul className="grid grid-cols-1 gap-3" aria-label="Where to find me">
                {channels.map(({ label, handle, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:border-cyan-300/40 hover:bg-white/[0.07]"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 transition group-hover:border-cyan-300/40 group-hover:text-cyan-200">
                        <Icon className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">{label}</span>
                        <span className="block truncate text-base font-medium text-foreground">
                          {handle}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </span>
                      </span>
                      <ArrowUpRight className="size-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-300" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/**
 * The email button and the CV download sit side by side. The address is assembled in the browser
 * and only on request, so it never sits in the page source as plain text for scrapers.
 */
function ContactActions() {
  const [shown, setShown] = useState(false)
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    window.clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(buildEmail())
      setStatus("copied")
    } catch {
      setStatus("failed")
    }
    timer.current = window.setTimeout(() => setStatus("idle"), 3500)
  }

  const email = shown ? buildEmail() : ""
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {shown ? (
          <>
            <a
              href={`mailto:${email}`}
              className="break-all rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-5 py-3 font-mono text-base text-cyan-100 transition hover:bg-cyan-300/20 sm:text-lg"
            >
              {email}
            </a>
            <Button variant="outline" size="lg" onClick={copy} aria-label="Copy the email address">
              {status === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              {status === "copied" ? "Copied" : "Copy"}
            </Button>
          </>
        ) : (
          <Button variant="glow" size="lg" onClick={() => setShown(true)}>
            <Mail aria-hidden="true" /> Show my email address <Eye aria-hidden="true" />
          </Button>
        )}
        <Button asChild variant="outline" size="lg">
          <a href={links.cv} download>
            <Download aria-hidden="true" /> Download CV (PDF)
          </a>
        </Button>
      </div>
      {shown && (
        <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm text-emerald-300">
          {status === "copied" ? "Email address copied to the clipboard." : status === "failed" ? "Could not copy automatically. Select the address and copy it." : ""}
        </p>
      )}
    </div>
  )
}

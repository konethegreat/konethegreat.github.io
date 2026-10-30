import { ArrowUpRight, Check, Copy, Mail, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { availability, buildEmail, links } from "@/data/profile"
import { mailtoHref, projectPrompt } from "@/lib/mail"

const include = [
  "The problem, in your own words.",
  "The deadline that actually matters.",
  "The constraints: stack, compliance, team and anything already decided.",
  "Whether there is an existing codebase, and who else has touched it.",
]

export function ContactPage() {
  const email = buildEmail()
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")

  useEffect(() => {
    if (status === "idle") return
    const timer = window.setTimeout(() => setStatus("idle"), 3000)
    return () => window.clearTimeout(timer)
  }, [status])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email)
      setStatus("copied")
    } catch {
      setStatus("failed")
    }
  }

  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Contact</p>
          <h1 className="mt-4 max-w-4xl text-balance font-serif text-5xl leading-[0.94] sm:text-7xl lg:text-[6rem]">
            Tell me what you are building.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            A short email is enough. I will tell you whether it is a fit, what shape the work could
            take and what it would need in rand.
          </p>
        </div>
      </section>

      <section aria-labelledby="availability-title" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 id="availability-title" className="sr-only">
          Availability
        </h2>
        <div className="grid gap-6 rounded-3xl border border-border bg-card/60 p-6 sm:grid-cols-3 sm:p-8">
          <div>
            <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-teal">
              <span aria-hidden="true" className="size-2 rounded-full bg-teal" />
              {availability.status}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{availability.detail}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm leading-relaxed">{availability.reply}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              No contact form. A form that quietly fails is worse than an email that works.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="email-title" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
          <div>
            <h2 id="email-title" className="font-serif text-4xl leading-[1.02] sm:text-5xl">
              Start with an email.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              The address is assembled in your browser, so it is not sitting in the page source as
              plain text. Copy it, or open your mail app with the project prompt already filled in.
            </p>

            <div className="mt-6 rounded-2xl border border-border bg-card/60 p-4 sm:p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Email
              </p>
              <code className="mt-2 block select-all break-all text-lg font-semibold">{email}</code>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {status === "copied" ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : (
                    <Copy className="size-4" aria-hidden="true" />
                  )}
                  Copy email address
                </button>
                <a
                  href={mailtoHref("Project enquiry", projectPrompt)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  Open in your mail app
                </a>
              </div>
              <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm">
                {status === "copied" && "Email address copied."}
                {status === "failed" && "Copy failed. Select the address and copy it manually."}
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              What to include
            </h2>
            <ol className="mt-4 space-y-3">
              {include.map((item, index) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed">
                  <span aria-hidden="true" className="font-mono text-xs text-primary">0{index + 1}</span>
                  {item}
                </li>
              ))}
            </ol>

            <h2 className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Elsewhere
            </h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {[
                { label: "LinkedIn", href: links.linkedin },
                { label: "GitHub", href: links.github },
                { label: "Credly badges", href: links.credly },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 py-3 text-sm font-medium hover:text-primary"
                  >
                    {link.label}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" aria-hidden="true" />
              {availability.detail}
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0 -z-10 opacity-80" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Not ready to write?</p>
          <h2 className="mt-4 max-w-2xl font-serif text-5xl leading-[0.98] sm:text-6xl">
            Look at the work first.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            The case studies show the constraints, the decisions and the limits. If one of them looks
            like your problem, that is a good place to start.
          </p>
          <a
            href={`mailto:${email}`}
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
          >
            Email {email}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  )
}

import { buildEmail, links } from "@/data/profile"

export function ContactPage() {
  const email = buildEmail()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl uppercase sm:text-7xl">Contact</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Tell me the problem, the deadline and the constraints. If there is an existing codebase, say so.
      </p>
      <a
        href={`mailto:${email}`}
        className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
      >
        {email}
      </a>
      <ul className="mt-8 space-y-3 text-lg">
        <li>
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
            LinkedIn
          </a>
        </li>
        <li>
          <a href={links.github} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
            GitHub
          </a>
        </li>
        <li>
          <a href={links.credly} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
            Credly badges
          </a>
        </li>
      </ul>
    </div>
  )
}

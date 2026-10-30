import { Link } from "@/components/ui/link"
import { aboutParagraphs, stats } from "@/data/profile"
import { featuredProjects } from "@/data/projects"

export function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
        AI systems engineer · Johannesburg
      </p>
      <h1 className="mt-4 font-display text-5xl uppercase leading-[0.9] sm:text-7xl lg:text-8xl">
        Kone Tshivhinda
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{aboutParagraphs[0]}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/work" className="rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground">
          Open the work
        </Link>
        <Link to="/contact" className="rounded-full border border-border px-5 py-3 font-semibold">
          Start a project
        </Link>
      </div>
      <dl className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-4">
            <dt className="text-xs text-muted-foreground">{stat.label}</dt>
            <dd className="mt-1 font-display text-3xl">{stat.value}</dd>
          </div>
        ))}
      </dl>
      <section aria-labelledby="featured-title" className="mt-16">
        <h2 id="featured-title" className="font-serif text-3xl">
          Featured work
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <li key={project.slug} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{project.status.label}</p>
              <h3 className="mt-2 text-xl font-semibold">
                <Link to={`/work/${project.slug}`}>{project.title}</Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.pitch}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

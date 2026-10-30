import { aboutParagraphs, principles } from "@/data/profile"

export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl uppercase sm:text-7xl">About</h1>
      {aboutParagraphs.map((paragraph, index) => (
        <p
          key={paragraph}
          className={
            index === 0
              ? "mt-6 text-xl leading-relaxed"
              : "mt-4 text-lg leading-relaxed text-muted-foreground"
          }
        >
          {paragraph}
        </p>
      ))}
      <h2 className="mt-12 font-serif text-3xl">Principles</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {principles.map((principle) => (
          <li key={principle.id} className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-semibold">{principle.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{principle.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

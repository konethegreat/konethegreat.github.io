const offers = [
  "Agent systems",
  "Knowledge and retrieval",
  "Product engineering",
  "Sovereign and local-first AI",
  "Cloud delivery and operations",
  "Technical audits and documentation",
]

export function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl uppercase sm:text-7xl">Services</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Six ways to work together. Scoped in a short conversation, quoted in rand.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {offers.map((offer) => (
          <li key={offer} className="rounded-2xl border border-border bg-card p-6 text-xl font-semibold">
            {offer}
          </li>
        ))}
      </ul>
    </div>
  )
}

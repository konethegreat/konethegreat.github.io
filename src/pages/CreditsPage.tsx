const credits = [
  { name: "React", license: "MIT", href: "https://react.dev" },
  { name: "Vite", license: "MIT", href: "https://vite.dev" },
  { name: "Tailwind CSS", license: "MIT", href: "https://tailwindcss.com" },
  { name: "Framer Motion", license: "MIT", href: "https://www.framer.com/motion/" },
  { name: "Radix UI", license: "MIT", href: "https://www.radix-ui.com" },
  { name: "lucide", license: "ISC", href: "https://lucide.dev" },
]

export function CreditsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl uppercase sm:text-7xl">Credits</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Third-party work used by this site, with source and license. Components adapted from the UI Vault are credited here and beside where they appear.
      </p>
      <ul className="mt-8 divide-y divide-border">
        {credits.map((credit) => (
          <li key={credit.name} className="flex flex-wrap items-center justify-between gap-2 py-4">
            <a href={credit.href} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
              {credit.name}
            </a>
            <span className="text-sm text-muted-foreground">{credit.license}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

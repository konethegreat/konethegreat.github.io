import { Link } from "@/components/ui/link"

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">404</p>
      <h1 className="mt-4 font-display text-5xl uppercase sm:text-7xl">This page is not here</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The address may have changed. The work and the home page are good places to continue.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground">
          Home
        </Link>
        <Link to="/work" className="rounded-full border border-border px-5 py-3 font-semibold">
          Work
        </Link>
      </div>
    </div>
  )
}

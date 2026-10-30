import { stations, type StationId } from "@/data/work"
import { cn } from "@/lib/utils"

interface Props {
  active: StationId | null
  onSelect: (station: StationId | null) => void
  count: number
}

export function StationFilters({ active, onSelect, count }: Props) {
  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by capability">
        <button
          type="button"
          aria-pressed={active === null}
          onClick={() => onSelect(null)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active === null
              ? "border-primary bg-primary font-semibold text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          All work
        </button>
        {stations.map((station) => (
          <button
            key={station.id}
            type="button"
            aria-pressed={active === station.id}
            onClick={() => onSelect(station.id)}
            title={station.blurb}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active === station.id
                ? "border-primary bg-primary font-semibold text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {station.label}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="mt-3 font-mono text-xs text-muted-foreground">
        {count} case {count === 1 ? "study" : "studies"} shown
      </p>
    </div>
  )
}

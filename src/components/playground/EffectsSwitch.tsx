import { useFx } from "@/lib/fx"
import { cn } from "@/lib/utils"

export function EffectsSwitch() {
  const { effects, toggleEffects, reduced } = useFx()
  const on = effects && !reduced

  return (
    <div className="rounded-3xl border border-border bg-card/60 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold">Ambient effects</h2>
          <p id="effects-note" className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {reduced
              ? "Your system asks for reduced motion, so effects stay off. Every demo still works when you press play."
              : on
                ? "On, the demos autoplay and ambient motion runs. Off, they wait for you to press play. Every demo still works either way."
                : "Off, the demos wait for you to press play and ambient motion is paused. Every demo still works."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-describedby="effects-note"
          disabled={reduced}
          onClick={toggleEffects}
          className={cn(
            "relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-border transition disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            on ? "bg-primary" : "bg-muted",
          )}
        >
          <span className="sr-only">Ambient effects</span>
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-1 size-6 rounded-full bg-background shadow-sm transition-transform",
              on ? "translate-x-[22px]" : "translate-x-0",
            )}
          />
        </button>
      </div>
    </div>
  )
}

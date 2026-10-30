export function withViewTransition(update: () => void) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (!reduced && typeof document.startViewTransition === "function") {
    document.startViewTransition(update)
    return
  }
  update()
}

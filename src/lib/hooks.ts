import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react"

/** Subscribe to a CSS media query without tearing. */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    [query],
  )
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])
  return useSyncExternalStore(subscribe, getSnapshot, () => serverValue)
}

export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)")
/** True for mouse / trackpad style pointers (used to gate hover-only effects). */
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)")
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)", true)

/** Highlights the section currently crossing the middle of the viewport. */
export function useScrollSpy(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? "")
  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (!elements.length) return
    const visible = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio)
          else visible.delete(entry.target.id)
        }
        if (visible.size) {
          // choose the earliest section in document order among the visible ones
          const first = ids.find((id) => visible.has(id))
          if (first) setActive(first)
        }
      },
      { rootMargin: "-40% 0px -52% 0px", threshold: [0, 0.01, 0.5, 1] },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])
  return active
}

/** Count up to `target` once `start` flips true. */
export function useCountUp(target: number, start: boolean, duration = 1400, reduced = false): number {
  const [value, setValue] = useState(reduced ? target : 0)
  const raf = useRef(0)
  useEffect(() => {
    if (reduced) {
      setValue(target)
      return
    }
    if (!start) return
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 4)
      setValue(Math.round(target * eased))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, start, duration, reduced])
  return value
}

/** Updates the URL hash without adding a history entry (and without the browser jumping to an anchor). */
export function setHash(hash: string, state: unknown = null) {
  try {
    const url = new URL(window.location.href)
    url.hash = hash
    window.history.replaceState(state, "", url)
  } catch {
    /* ignore */
  }
}

/** Adds a history entry for the hash, so the Back button undoes it (used when a case study opens). */
export function pushHash(hash: string, state: unknown) {
  try {
    const url = new URL(window.location.href)
    url.hash = hash
    window.history.pushState(state, "", url)
  } catch {
    /* ignore */
  }
}

export function clearHash() {
  try {
    const url = new URL(window.location.href)
    url.hash = ""
    window.history.replaceState(null, "", url.pathname + url.search)
  } catch {
    /* ignore */
  }
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
  setHash(id)
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useFinePointer, usePrefersReducedMotion } from "./hooks"

interface FxState {
  /** The visitor's own switch (persisted per browser). */
  effects: boolean
  setEffects: (value: boolean) => void
  toggleEffects: () => void
  /** True when the OS asks for reduced motion. */
  reduced: boolean
  /** Ambient effects (particles, vortex drift, auto-rotation) may animate. */
  animate: boolean
  /** The splash cursor trail may run (needs a fine pointer as well). */
  cursor: boolean
}

const FxContext = createContext<FxState | null>(null)
const KEY = "kt-effects"

function readStored(): boolean {
  try {
    return window.localStorage.getItem(KEY) !== "off"
  } catch {
    return true
  }
}

export function FxProvider({ children }: { children: ReactNode }) {
  const [effects, setEffectsState] = useState<boolean>(readStored)
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()

  const setEffects = useCallback((value: boolean) => {
    setEffectsState(value)
    try {
      window.localStorage.setItem(KEY, value ? "on" : "off")
    } catch {
      /* storage may be blocked; the switch still works for this visit */
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.fx = effects && !reduced ? "on" : "off"
  }, [effects, reduced])

  const value = useMemo<FxState>(
    () => ({
      effects,
      setEffects,
      toggleEffects: () => setEffects(!effects),
      reduced,
      animate: effects && !reduced,
      cursor: effects && !reduced && fine,
    }),
    [effects, reduced, fine, setEffects],
  )

  return <FxContext.Provider value={value}>{children}</FxContext.Provider>
}

export function useFx(): FxState {
  const ctx = useContext(FxContext)
  if (!ctx) throw new Error("useFx must be used inside <FxProvider>")
  return ctx
}

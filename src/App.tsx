import { lazy, Suspense, useCallback, useEffect, useState } from "react"
import { ScrollProgress } from "@/components/fx/ScrollProgress"
import { Vortex } from "@/components/fx/Vortex"
import { About } from "@/components/sections/About"
import { Beyond } from "@/components/sections/Beyond"
import { Career } from "@/components/sections/Career"
import { Contact } from "@/components/sections/Contact"
import { Footer } from "@/components/sections/Footer"
import { GitHub } from "@/components/sections/GitHub"
import { Hero } from "@/components/sections/Hero"
import { Journey } from "@/components/sections/Journey"
import { Navbar } from "@/components/sections/Navbar"
import { Stack } from "@/components/sections/Stack"
import { Work } from "@/components/sections/Work"
import { FxProvider, useFx } from "@/lib/fx"
import { ProjectDialogProvider } from "@/lib/project-dialog"

// Heavy or optional pieces load after the first paint.
const Particles = lazy(() => import("@/components/fx/Particles").then((m) => ({ default: m.Particles })))
const SplashCursor = lazy(() => import("@/components/fx/SplashCursor").then((m) => ({ default: m.SplashCursor })))
const CommandPalette = lazy(() => import("@/components/sections/CommandPalette"))

function Shell() {
  const { effects, cursor } = useFx()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteMounted, setPaletteMounted] = useState(false)

  const openPalette = useCallback(() => {
    setPaletteMounted(true)
    setPaletteOpen(true)
  }, [])

  // Ctrl/Cmd + K toggles the command menu from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setPaletteMounted(true)
        setPaletteOpen((open) => !open)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Vortex />
      {effects && (
        <Suspense fallback={null}>
          <Particles />
        </Suspense>
      )}
      {cursor && (
        <Suspense fallback={null}>
          <SplashCursor />
        </Suspense>
      )}
      <ScrollProgress />

      <Navbar onOpenPalette={openPalette} />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero onOpenPalette={openPalette} />
        <About />
        <Work />
        <Stack />
        <Journey />
        <Career />
        <GitHub />
        <Beyond />
        <Contact />
      </main>

      <Footer />

      {paletteMounted && (
        <Suspense fallback={null}>
          <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
        </Suspense>
      )}
    </>
  )
}

export default function App() {
  return (
    <FxProvider>
      <ProjectDialogProvider>
        <Shell />
      </ProjectDialogProvider>
    </FxProvider>
  )
}

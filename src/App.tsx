import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { RouterProvider, useRouteMatch } from "@/lib/router"
import { AboutPage } from "@/pages/AboutPage"
import { ContactPage } from "@/pages/ContactPage"
import { CreditsPage } from "@/pages/CreditsPage"
import { HomePage } from "@/pages/HomePage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { PlaygroundPage } from "@/pages/PlaygroundPage"
import { ProjectPage } from "@/pages/ProjectPage"
import { ServicesPage } from "@/pages/ServicesPage"
import { WorkPage } from "@/pages/WorkPage"

function RouteView() {
  const match = useRouteMatch()
  if (!match) return <NotFoundPage />
  switch (match.path) {
    case "/":
      return <HomePage />
    case "/work":
      return <WorkPage />
    case "/services":
      return <ServicesPage />
    case "/about":
      return <AboutPage />
    case "/playground":
      return <PlaygroundPage />
    case "/contact":
      return <ContactPage />
    case "/credits":
      return <CreditsPage />
    default:
      return match.path.startsWith("/work/") ? <ProjectPage /> : <NotFoundPage />
  }
}

export default function App() {
  return (
    <RouterProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="min-h-[70vh] outline-none">
        <RouteView />
      </main>
      <SiteFooter />
    </RouterProvider>
  )
}

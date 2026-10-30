import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { flushSync } from "react-dom"
import { site } from "@/data/profile"
import { matchRoute, normalizePath, routeMeta } from "@/lib/routes"
import { withViewTransition } from "@/lib/view-transition"

interface RouterValue {
  path: string
  navigate: (to: string, options?: { replace?: boolean }) => void
}

const RouterContext = createContext<RouterValue | null>(null)

function currentPath() {
  return normalizePath(window.location.pathname)
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    const onPop = () => setPath(currentPath())
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  useEffect(() => {
    const meta = routeMeta(path)
    const canonical = `${site.url}${path === "/" ? "/" : path}`
    document.title = meta.title
    const setMeta = (selector: string, attribute: string, value: string) => {
      const node = document.querySelector(selector)
      if (node) node.setAttribute(attribute, value)
    }
    setMeta('meta[name="description"]', "content", meta.description)
    setMeta('link[rel="canonical"]', "href", canonical)
    setMeta('meta[property="og:url"]', "content", canonical)
    setMeta('meta[property="og:title"]', "content", meta.title)
    setMeta('meta[property="og:description"]', "content", meta.description)
    setMeta('meta[name="twitter:title"]', "content", meta.title)
    setMeta('meta[name="twitter:description"]', "content", meta.description)
    setMeta('meta[name="twitter:url"]', "content", canonical)

    const hash = window.location.hash.slice(1)
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView())
    } else {
      window.scrollTo(0, 0)
      const main = document.getElementById("main")
      if (main && !main.contains(document.activeElement)) main.focus({ preventScroll: true })
    }
  }, [path])

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const url = new URL(to, window.location.origin)
    const next = normalizePath(url.pathname)
    if (next === currentPath() && url.hash === window.location.hash) return
    withViewTransition(() => {
      flushSync(() => {
        if (options?.replace) window.history.replaceState(null, "", url)
        else window.history.pushState(null, "", url)
        setPath(next)
      })
    })
  }, [])

  const value = useMemo(() => ({ path, navigate }), [path, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter(): RouterValue {
  const value = useContext(RouterContext)
  if (!value) throw new Error("useRouter must be used inside RouterProvider")
  return value
}

export function useRouteMatch() {
  const { path } = useRouter()
  return matchRoute(path)
}

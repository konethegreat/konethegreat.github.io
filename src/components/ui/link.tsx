import type { AnchorHTMLAttributes, MouseEvent } from "react"
import { useRouter } from "@/lib/router"
import { matchRoute } from "@/lib/routes"

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
}

export function Link({ to, onClick, children, ...props }: LinkProps) {
  const { navigate } = useRouter()
  const target = to.split("#")[0]
  const internal = to.startsWith("/") && matchRoute(target) !== null

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (!internal || event.defaultPrevented) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    navigate(to)
  }

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}

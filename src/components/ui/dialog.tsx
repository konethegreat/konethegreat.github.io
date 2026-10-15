import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Radix only returns focus to a <Dialog.Trigger>. Most dialogs here are opened from code (a project card,
 * the command menu, a keyboard shortcut), so a controlled dialog remembers the element that had focus at
 * the moment it opened and hands focus back to it on close. Uncontrolled dialogs keep Radix's behaviour.
 */
const OpenerContext = React.createContext<React.RefObject<HTMLElement | null> | null>(null)

const Dialog = ({ open, ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) => {
  const opener = React.useRef<HTMLElement | null>(null)
  // A layout effect runs before Radix moves focus into the dialog, so the opener is still focused here.
  React.useLayoutEffect(() => {
    if (!open) return
    const active = document.activeElement
    opener.current = active instanceof HTMLElement && active !== document.body ? active : null
  }, [open])
  return (
    <OpenerContext.Provider value={opener}>
      <DialogPrimitive.Root open={open} {...props} />
    </OpenerContext.Provider>
  )
}
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[80] bg-[#02030a]/80 backdrop-blur-md data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out",
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = "DialogOverlay"

type Variant = "modal" | "palette" | "lightbox" | "sheet"

const variantClass: Record<Variant, string> = {
  modal:
    "left-1/2 top-1/2 max-h-[90dvh] w-[min(94vw,58rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/10 bg-[#080a18]/95 shadow-[0_30px_120px_-20px_rgb(0_0_0/0.9),0_0_80px_-30px_rgb(139_92_246/0.5)] data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out",
  palette:
    "left-1/2 top-[12vh] w-[min(92vw,40rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#080a18]/95 shadow-[0_30px_120px_-20px_rgb(0_0_0/0.9),0_0_80px_-30px_rgb(34_211_238/0.45)] data-[state=open]:animate-drop-in data-[state=closed]:animate-drop-out",
  lightbox:
    "left-1/2 top-1/2 max-h-[94dvh] w-[min(96vw,64rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#05060d]/95 data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out",
  sheet:
    "inset-0 overflow-y-auto bg-[#05060d]/97 data-[state=open]:animate-sheet-in data-[state=closed]:animate-overlay-out",
}

interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  variant?: Variant
  hideClose?: boolean
  closeLabel?: string
}

const DialogContent = React.forwardRef<React.ComponentRef<typeof DialogPrimitive.Content>, DialogContentProps>(
  ({ className, children, variant = "modal", hideClose = false, closeLabel = "Close", onCloseAutoFocus, ...props }, ref) => {
    const opener = React.useContext(OpenerContext)
    return (
      <DialogPortal>
        {variant !== "sheet" && <DialogOverlay />}
        <DialogPrimitive.Content
          ref={ref}
          className={cn("fixed z-[90] focus:outline-none", variantClass[variant], className)}
          onCloseAutoFocus={(event) => {
            onCloseAutoFocus?.(event)
            const el = opener?.current
            if (event.defaultPrevented || !el || !el.isConnected) return
            event.preventDefault()
            // preventScroll: the command menu scrolls the page right after it closes, so focus must not tug it back.
            el.focus({ preventScroll: true })
          }}
          {...props}
        >
          {children}
          {!hideClose && (
            <DialogPrimitive.Close
              aria-label={closeLabel}
              className="absolute right-3.5 top-3.5 z-20 inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-muted-foreground backdrop-blur transition hover:border-white/25 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" aria-hidden="true" />
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    )
  },
)
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("font-display text-2xl font-semibold tracking-tight", className)} {...props} />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
}

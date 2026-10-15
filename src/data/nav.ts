export const navItems = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "journey", label: "Journey" },
  { id: "career", label: "Career" },
  { id: "github", label: "GitHub" },
  { id: "beyond", label: "Beyond" },
] as const

/** Every section the page spy watches, in document order. */
export const sectionIds = ["top", ...navItems.map((n) => n.id), "contact"] as const

export type NavId = (typeof navItems)[number]["id"]

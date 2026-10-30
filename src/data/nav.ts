export const navItems = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "playground", label: "Playground" },
  { id: "contact", label: "Contact" },
] as const

export type NavId = (typeof navItems)[number]["id"]

import { projectBySlug } from "./projects"

export interface VaultItem {
  id: string
  name: string
  detail: string
  live: { label: string; to: string }
  credit: { author: string; license: string; href: string }
}

const vault = projectBySlug("ui-vault")
export const vaultHref =
  vault?.links.find((link) => link.kind === "live")?.href ?? "https://konethegreat.github.io/ui-vault/"

export const vaultShelf: VaultItem[] = [
  {
    id: "glass-folder",
    name: "Glass folder cards",
    detail:
      "Folder covers that open into the studio archive. On the home page, three folders hold the eight case studies.",
    live: { label: "See it on the home page", to: "/" },
    credit: {
      author: "Kedhareswer Naidu",
      license: "MIT",
      href: "https://21st.dev/@kedhareswer/components/glass-folder-cards",
    },
  },
  {
    id: "mascot",
    name: "Mascot hero",
    detail:
      "The illustrated character in the home hero, adapted to a dark-skinned character and the site palette.",
    live: { label: "See it on the home page", to: "/" },
    credit: {
      author: "Kedhareswer Naidu",
      license: "MIT",
      href: "https://21st.dev/@kedhareswer/components/mascot-portfolio-hero",
    },
  },
  {
    id: "backgrounds",
    name: "Particle and cursor backgrounds",
    detail:
      "Ambient particle and cursor effects from the vault. They are optional everywhere and pause when the visitor turns effects off.",
    live: { label: "Open the vault", to: vaultHref },
    credit: { author: "Kone Tshivhinda", license: "Original", href: vaultHref },
  },
]

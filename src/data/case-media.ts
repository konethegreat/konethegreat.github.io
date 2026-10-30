import { caseStudies } from "./case-studies"
import { projectBySlug } from "./projects"
import { siteShots } from "./shots.generated"

export interface CaseImage {
  src: string
  alt: string
  width: number
  height: number
  caption: string
}

export interface CaseMedia {
  cover?: CaseImage
  gallery: CaseImage[]
  technicalBrief: string
  briefSource: string
}

const coverSlugs = ["sa-jas", "clearcut", "munisolve", "reservoir", "ui-vault", "k-one"]
const captured = "30 October 2026"

function coverFor(slug: string): CaseImage | undefined {
  if (!coverSlugs.includes(slug)) return undefined
  const shot = siteShots[slug]?.desktop
  const project = projectBySlug(slug)
  if (!shot || !project) return undefined
  return {
    src: shot.src,
    alt: `${project.title} home page at desktop width.`,
    width: shot.width,
    height: shot.height,
    caption: `Screenshot of the live site, captured ${captured}.`,
  }
}

function galleryFor(slug: string): CaseImage[] {
  const project = projectBySlug(slug)
  const shots = siteShots[slug]
  if (!project || !shots) return []
  if (slug === "timelex") {
    return [
      {
        src: shots.desktop.src,
        alt: "TimeLex v1 prototype dashboard at desktop width.",
        width: shots.desktop.width,
        height: shots.desktop.height,
        caption: `TimeLex v1 prototype, captured ${captured}.`,
      },
      {
        src: shots.phone.src,
        alt: "TimeLex v1 prototype at phone width.",
        width: shots.phone.width,
        height: shots.phone.height,
        caption: `TimeLex v1 prototype on a phone, captured ${captured}.`,
      },
    ]
  }
  if (!coverSlugs.includes(slug)) return []
  return [
    {
      src: shots.phone.src,
      alt: `${project.title} at phone width.`,
      width: shots.phone.width,
      height: shots.phone.height,
      caption: `Phone layout, captured ${captured}.`,
    },
  ]
}

function briefSourceFor(slug: string): string {
  const project = projectBySlug(slug)
  return project?.home === "konethegreat"
    ? "Generated from the public repository, October 2026."
    : "Generated from the project record and published notes, October 2026."
}

export const caseMedia = Object.fromEntries(
  caseStudies.map((study) => [
    study.slug,
    {
      cover: coverFor(study.slug),
      gallery: galleryFor(study.slug),
      technicalBrief: `/docs/${study.slug}-brief.pdf`,
      briefSource: briefSourceFor(study.slug),
    } satisfies CaseMedia,
  ]),
) as Record<string, CaseMedia>

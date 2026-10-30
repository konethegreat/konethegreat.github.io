import { CaseBody } from "@/components/case-study/CaseBody"
import { CaseHero } from "@/components/case-study/CaseHero"
import { CaseNext } from "@/components/case-study/CaseNext"
import { caseStudyBySlug } from "@/data/case-studies"
import { projectBySlug } from "@/data/projects"
import { useRouteMatch } from "@/lib/router"
import { NotFoundPage } from "./NotFoundPage"

export function ProjectPage() {
  const match = useRouteMatch()
  const slug = match?.params.slug ?? ""
  const project = projectBySlug(slug)
  const study = caseStudyBySlug(slug)
  if (!project || !study) return <NotFoundPage />

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <CaseHero project={project} study={study} />
      <CaseBody project={project} study={study} />
      <CaseNext study={study} />
    </article>
  )
}

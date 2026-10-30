import { Lab } from "@/components/sections/Lab"
import { FxProvider } from "@/lib/fx"
import { ProjectDialogProvider } from "@/lib/project-dialog"

export function PlaygroundPage() {
  return (
    <FxProvider>
      <ProjectDialogProvider>
        <div className="theme-dark bg-background text-foreground">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="font-display text-5xl uppercase sm:text-7xl">Playground</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Working models of agents, retrieval and autonomy. Real parts are labelled real. Scripted parts are labelled scripted.
            </p>
          </div>
          <Lab />
        </div>
      </ProjectDialogProvider>
    </FxProvider>
  )
}

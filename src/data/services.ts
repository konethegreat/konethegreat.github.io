import type { Service } from "./types"

export const services: Service[] = [
  {
    id: "product-design",
    title: "Product and interface design",
    promise:
      "A product that feels considered before a line of production code exists: the flow, the screens and the words in one coherent direction.",
    deliverables: [
      "Discovery notes and a one-page product brief",
      "User flows and a clickable prototype",
      "A visual direction with type, colour and layout rules",
      "A build-ready handoff, or the build itself",
    ],
    bestFor: "New products, founder ideas and interfaces that feel heavier than they should.",
    timeline: "Typically 2 to 4 weeks",
    from: "Quoted in rand after scoping",
    icon: "compass",
  },
  {
    id: "web-engineering",
    title: "Web engineering",
    promise:
      "A fast, accessible site or web app that works on a phone, survives a real content edit and can be deployed without a ceremony.",
    deliverables: [
      "A responsive React or static build",
      "Accessibility and performance checks",
      "Content structure you can edit",
      "Deployment and a short handover",
    ],
    bestFor: "Portfolios, studio sites, product frontends and internal tools.",
    timeline: "Typically 3 to 8 weeks",
    from: "Quoted in rand after scoping",
    icon: "code",
  },
  {
    id: "design-systems",
    title: "Design systems and UI vaults",
    promise:
      "One set of tokens and components, documented well enough that the next screen does not start from a blank file.",
    deliverables: [
      "Design tokens for colour, type, spacing and motion",
      "A component inventory with real states",
      "Usage rules and a contribution guide",
      "A live catalogue, optionally with an API or MCP surface",
    ],
    bestFor: "Teams with several screens, several hands or a growing AI-assisted codebase.",
    timeline: "Typically 3 to 6 weeks",
    from: "Quoted in rand after scoping",
    icon: "layers",
  },
  {
    id: "applied-ai",
    title: "Applied AI tools",
    promise:
      "An agent or retrieval system that does a bounded job, shows its evidence and stops where a person should decide.",
    deliverables: [
      "A scoped use case and an evaluation plan",
      "Retrieval, tools or an agent loop where they earn their place",
      "Human review, audit and cost controls",
      "A working demo, not a slide",
    ],
    bestFor: "Teams with a real workflow, clean enough data and a low tolerance for invented answers.",
    timeline: "Typically 4 to 10 weeks",
    from: "Quoted in rand after scoping",
    icon: "spark",
  },
  {
    id: "documentation",
    title: "Technical documentation and handover",
    promise:
      "The decisions, interfaces and failure modes written down, so the system can be maintained by someone who was not in the room.",
    deliverables: [
      "Architecture decision records",
      "API, event and data contracts",
      "A threat model and operational notes",
      "A handover session and a reading path",
    ],
    bestFor: "Codebases with one author, inherited systems and teams preparing for an audit.",
    timeline: "Typically 1 to 4 weeks",
    from: "Quoted in rand after scoping",
    icon: "book",
  },
  {
    id: "rescue",
    title: "Rescue and refactor",
    promise:
      "A careful pass over a codebase that has become hard to change, with the risky parts named before anything is rewritten.",
    deliverables: [
      "A read-only audit with evidence",
      "A prioritised risk and debt map",
      "A staged refactor plan",
      "The first slice, implemented and tested",
    ],
    bestFor: "Projects that shipped fast and now need a steadier base.",
    timeline: "Audit in 1 to 2 weeks, then staged",
    from: "Quoted in rand after scoping",
    icon: "wrench",
  },
]

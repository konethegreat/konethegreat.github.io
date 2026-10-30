import type {
  EngagementModel,
  ProcessStep,
  Service,
  ServiceFaq,
  ServiceHonesty,
} from "./types"

export const services: Service[] = [
  {
    id: "agent-systems",
    title: "Agent systems",
    outcome:
      "An agent that handles one bounded job, shows its evidence and stops where a person should decide.",
    included: [
      "Tool use and MCP servers where they earn their place",
      "A human sign-off gate before anything consequential",
      "Evaluation cases, prompt-injection fencing and hard cost caps",
      "A run record an operator can follow",
    ],
    fits: "A real workflow, data clean enough to ground answers and a low tolerance for invented ones.",
    proof: [
      { label: "Vigil", slug: "vigil" },
      { label: "SA-JAS", slug: "sa-jas" },
      { label: "ClearCut", slug: "clearcut" },
    ],
    shape: "Fixed-scope build: one workflow, one evaluation plan, a working demo and a written handover.",
    icon: "agents",
  },
  {
    id: "knowledge-retrieval",
    title: "Knowledge and retrieval",
    outcome:
      "Answers that cite the document they came from, or say plainly that the evidence is not there.",
    included: [
      "Hybrid keyword and vector retrieval fused by rank",
      "Grounded answers with visible sources",
      "Document and email pipelines with permissions",
      "An abstain rule and an evaluation set",
    ],
    fits: "Teams sitting on documents, policies or case files that people cannot search well.",
    proof: [
      { label: "Vigil", slug: "vigil" },
      { label: "Reservoir", slug: "reservoir" },
    ],
    shape: "Fixed scope: one corpus, one question set, a measured demo and the retrieval design written down.",
    icon: "retrieval",
  },
  {
    id: "product-engineering",
    title: "Product engineering",
    outcome:
      "A web product that works on a phone, survives a real content edit and can be deployed without ceremony.",
    included: [
      "Product flow and interface direction",
      "A responsive React or full-stack build",
      "APIs, data models and access rules",
      "Accessibility and performance checks",
    ],
    fits: "Founders, studios and teams that need a working product, not a deck.",
    proof: [
      { label: "MuniSolve ZA", slug: "munisolve" },
      { label: "SA-JAS", slug: "sa-jas" },
      { label: "UI Vault", slug: "ui-vault" },
      { label: "K-ONE", slug: "k-one" },
    ],
    shape: "Fixed-scope build: a usable first release, a deployment target and a handover session.",
    icon: "product",
  },
  {
    id: "sovereign-ai",
    title: "Sovereign and local-first AI",
    outcome:
      "AI that runs on your machine or inside your country, with data handling you can explain to a regulator.",
    included: [
      "Local models with Ollama and LM Studio",
      "Bring-your-own-key provider seams",
      "POPIA-aware data handling and residency notes",
      "Fallbacks for quality and cost",
    ],
    fits: "Legal, health, public-sector and any team whose data cannot leave a boundary.",
    proof: [
      { label: "Vigil", slug: "vigil" },
      { label: "TimeLex", slug: "timelex" },
      { label: "Reservoir", slug: "reservoir" },
    ],
    shape: "A proof of concept first, then a fixed-scope build if the quality holds.",
    icon: "local",
  },
  {
    id: "cloud-delivery",
    title: "Cloud delivery and operations",
    outcome:
      "A deployed system you can watch, with a repeatable release path and a rollback that has been tried.",
    included: [
      "Docker images and a CI pipeline",
      "A chosen deploy target",
      "Monitoring, logs and alerting",
      "A runbook and a rollback path",
    ],
    fits: "Projects that work locally and need to survive real traffic, or systems that have outgrown a manual deploy.",
    proof: [
      { label: "ClearCut", slug: "clearcut" },
      { label: "MuniSolve ZA", slug: "munisolve" },
      { label: "K-ONE", slug: "k-one" },
    ],
    shape: "Fixed-scope delivery: one environment, one pipeline, one runbook, then support if you want it.",
    icon: "cloud",
  },
  {
    id: "audits-docs",
    title: "Technical audits and documentation",
    outcome:
      "The architecture, risks and decisions written down, so someone who was not in the room can maintain the system.",
    included: [
      "An architecture review with evidence",
      "ADRs and interface contracts",
      "A threat model and risk map",
      "A handover pack and a walkthrough",
    ],
    fits: "Inherited systems, codebases with one author and teams preparing for an audit or a handover.",
    proof: [
      { label: "TimeLex", slug: "timelex" },
      { label: "Vigil", slug: "vigil" },
      { label: "ClearCut", slug: "clearcut" },
    ],
    shape: "A read-only audit first, then a fixed-scope documentation or remediation slice.",
    icon: "quality",
  },
]

export const engagementModels: EngagementModel[] = [
  {
    id: "fixed",
    name: "Fixed-scope build",
    detail:
      "A defined outcome with a written scope, a demo and a handover. Best when the problem is clear enough to cost.",
    rhythm: "One scope, one delivery",
  },
  {
    id: "partner",
    name: "Monthly partner",
    detail:
      "A standing block of engineering time, a short written plan at the start of the cycle and a demo at the end.",
    rhythm: "Plan, build, show",
  },
  {
    id: "audit",
    name: "Two-week audit",
    detail:
      "A read-only review of architecture, security and delivery, ending in a prioritised report.",
    rhythm: "Read, test, report",
  },
  {
    id: "advisory",
    name: "Advisory",
    detail:
      "A scheduled conversation for a team that is already building and wants a second opinion before the next commitment.",
    rhythm: "Ask, decide, move",
  },
]

export const processSteps: ProcessStep[] = [
  {
    id: "discover",
    name: "Discover",
    detail: "One or two conversations about the problem, the people, the constraints and the real deadline.",
  },
  {
    id: "design",
    name: "Design",
    detail: "A written scope, the shape of the system, the risks and what is explicitly out of scope.",
  },
  {
    id: "build",
    name: "Build",
    detail: "Small commits, tests where they matter and a running increment every week.",
  },
  {
    id: "prove",
    name: "Prove",
    detail: "A working demo, the tests behind the claims and the evidence that the result holds.",
  },
  {
    id: "hand-over",
    name: "Hand over",
    detail: "A written handover pack, a walkthrough and a named owner for the system after launch.",
  },
]

export const serviceHonesty: ServiceHonesty[] = [
  {
    id: "does",
    title: "What K-ONE does",
    items: [
      "Build agent systems with a human gate before anything irreversible.",
      "Ground retrieval in real documents and show the source.",
      "Ship full-stack products with the tests and handover to match.",
      "Run local models when data cannot leave the machine or the country.",
    ],
  },
  {
    id: "does-not",
    title: "What K-ONE does not do",
    items: [
      "Call a system production-ready before it has been verified.",
      "Copy unlicensed work or hide an attribution.",
      "Claim client work that is not public.",
      "Take a project where a specialist is clearly the better choice.",
    ],
  },
  {
    id: "specialist",
    title: "When a specialist is the better choice",
    items: [
      "Independent penetration testing and formal security certification.",
      "Large-scale model training and GPU operations.",
      "Round-the-clock site reliability for a large estate.",
      "Legal, tax or accounting advice. I build the tools; the professionals sign the opinion.",
    ],
  },
]

export const serviceFaq: ServiceFaq[] = [
  {
    q: "Can you work with an existing codebase?",
    a: "Yes. I start read-only: architecture, risks and the parts that are hard to change. Nothing is rewritten before that picture is agreed.",
  },
  {
    q: "How is the price set?",
    a: "After a short scoping conversation, in rand. The quote follows the scope. If the scope changes, the quote changes in writing.",
  },
  {
    q: "Who owns the code?",
    a: "You do, once the work is paid for. Third-party dependencies keep their own licenses.",
  },
  {
    q: "Do you work remotely?",
    a: "Yes. I am in Johannesburg on SAST and work with teams in other time zones.",
  },
  {
    q: "What happens if it is not a fit?",
    a: "I say so early and point you to the kind of specialist who fits. A bad fit costs us both more than a no.",
  },
]

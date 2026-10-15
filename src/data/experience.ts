import type { Role } from "./types"

export const roles: Role[] = [
  {
    id: "kone",
    title: "Founder",
    org: "K-ONE IT SOLUTIONS",
    place: "Johannesburg, South Africa",
    period: "2025 – Present",
    current: true,
    summary: "Independent IT and software studio.",
    bullets: [
      {
        lead: "Studio",
        text: "Founded an independent IT and software studio; delivered the company website (HTML, CSS, PHP), a React social-media platform and a Dockerised server-health monitoring tool (Python) with Slack and email alerting.",
      },
    ],
  },
  {
    id: "gao-platoon",
    title: "Intern Assistant Platoon Leader",
    org: "GAO Tek Inc.",
    place: "Canada (remote)",
    period: "July 2024 – August 2024",
    bullets: [
      { lead: "Operations", text: "Directed operations for multiple technical squads, ensuring seamless coordination and high productivity." },
      { lead: "Mentoring", text: "Mentored and provided technical support to interns so project benchmarks were met." },
      { lead: "Reporting", text: "Collaborated with senior management to deliver data-driven reports on squad performance and project milestones." },
    ],
  },
  {
    id: "gao-squad",
    title: "Intern Assistant Squad Leader & Tech Support",
    org: "GAO Tek Inc.",
    place: "Canada (remote)",
    period: "April 2024 – July 2024",
    bullets: [
      { lead: "Quality control", text: "Managed quality control by reviewing technical descriptions and code and giving constructive feedback." },
      { lead: "Alignment", text: "Facilitated team meetings to align technical execution with management's strategic goals." },
      { lead: "Onboarding", text: "Onboarded new interns on tools and workflow; managed WordPress product descriptions with 100% accuracy." },
    ],
  },
]

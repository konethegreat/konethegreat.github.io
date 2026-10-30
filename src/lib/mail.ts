import { buildEmail } from "@/data/profile"

export const projectPrompt = [
  "What I am trying to build:",
  "The deadline:",
  "Constraints (stack, compliance, team):",
  "Existing codebase (yes or no):",
].join("\n\n")

export function mailtoHref(subject: string, body: string): string {
  return `mailto:${buildEmail()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

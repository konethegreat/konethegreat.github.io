import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/** shadcn-style class merger (same helper as the UI Vault `utils/cn.ts`). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

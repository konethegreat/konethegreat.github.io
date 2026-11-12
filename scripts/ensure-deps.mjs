// Runs before `npm run build` and `npm test` (the prebuild and pretest scripts).
// A fresh checkout has no node_modules, so `vitest`, `tsc` and `vite` are not on
// the PATH and the checks fail with "not recognized". When any of the tools the
// checks need is missing, this installs the exact versions in package-lock.json
// with `npm ci`. When they are all present it does nothing, so CI (which already
// ran `npm ci`) and normal local runs are unchanged.
import { spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

// The packages whose binaries `npm run build` and `npm test` call.
export const requiredPackages = ["typescript", "vite", "vitest"]

export function missingPackages(root) {
  return requiredPackages.filter((name) => !existsSync(join(root, "node_modules", name, "package.json")))
}

export function ensureDeps(root) {
  const missing = missingPackages(root)
  if (missing.length === 0) return { installed: false, missing }

  if (!existsSync(join(root, "package-lock.json"))) {
    throw new Error(`Missing ${missing.join(", ")} and no package-lock.json in ${root}, so npm ci cannot run.`)
  }

  console.log(`Missing ${missing.join(", ")} in node_modules. Running npm ci to install from package-lock.json.`)
  const result = spawnSync("npm", ["ci"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`npm ci exited with code ${result.status}`)

  const stillMissing = missingPackages(root)
  if (stillMissing.length > 0) {
    throw new Error(`npm ci finished but ${stillMissing.join(", ")} is still missing from node_modules.`)
  }
  return { installed: true, missing }
}

const invokedDirectly = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invokedDirectly) {
  try {
    ensureDeps(resolve(fileURLToPath(new URL("..", import.meta.url))))
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

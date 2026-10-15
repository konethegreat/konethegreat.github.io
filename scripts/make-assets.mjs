// Regenerates the icon set and the social-share image in public/.
//
//   npm i --no-save sharp playwright && npx playwright install chromium
//   node scripts/make-assets.mjs
//
// sharp and playwright are not project dependencies: they are only needed when these images change.
// The "K" is the bold glyph of Space Grotesk (the site's display font), exported as a path so the
// favicon does not depend on a webfont.
import { createRequire } from "node:module"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const require = createRequire(import.meta.url)
const sharp = require("sharp")
const { chromium } = require("playwright")

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const pub = path.join(root, "public")
const fonts = path.join(root, "node_modules", "@fontsource-variable")

/* ----------------------------------------------------------------------------------------------
   The mark: gradient tile with a dark K
---------------------------------------------------------------------------------------------- */
const K_PATH = "M66 0V700H198V422H216L443 700H612L320 355L622 0H448L216 284H198V0Z" // Space Grotesk 700, 1000 upm
const K_BOX = { x0: 66, x1: 622, height: 700 }

function mark({ radius = 15, kHeight = 40 } = {}) {
  const s = kHeight / K_BOX.height
  const tx = 32 - ((K_BOX.x0 + K_BOX.x1) / 2) * s
  const ty = 32 + kHeight / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0.15" x2="1" y2="0.85">
      <stop offset="0" stop-color="#22d3ee"/>
      <stop offset="0.52" stop-color="#8b5cf6"/>
      <stop offset="1" stop-color="#f472b6"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="${radius}" fill="url(#g)"/>
  <path fill="#05060d" transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${s.toFixed(5)} ${(-s).toFixed(5)})" d="${K_PATH}"/>
</svg>
`
}

async function png(svg, size, file) {
  await sharp(Buffer.from(svg), { density: (72 * size) / 64 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(path.join(pub, file))
  console.log("wrote", file)
}

fs.writeFileSync(path.join(pub, "favicon.svg"), mark())
console.log("wrote favicon.svg")
await png(mark(), 32, "favicon-32.png")
await png(mark({ radius: 0, kHeight: 38 }), 180, "apple-touch-icon.png") // iOS applies its own corner mask
await png(mark(), 192, "icon-192.png")
await png(mark(), 512, "icon-512.png")
await png(mark({ radius: 0, kHeight: 26 }), 512, "icon-maskable-512.png") // K sits inside the 80% safe zone

/* ----------------------------------------------------------------------------------------------
   Social-share image, 1200 x 630
---------------------------------------------------------------------------------------------- */
const file = (...p) => pathToFileURL(path.join(...p)).href
const og = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<style>
  @font-face { font-family: "Space Grotesk"; font-weight: 300 700; src: url("${file(fonts, "space-grotesk", "files", "space-grotesk-latin-wght-normal.woff2")}") format("woff2"); }
  @font-face { font-family: "Inter"; font-weight: 100 900; src: url("${file(fonts, "inter", "files", "inter-latin-wght-normal.woff2")}") format("woff2"); }
  @font-face { font-family: "JetBrains Mono"; font-weight: 100 800; src: url("${file(fonts, "jetbrains-mono", "files", "jetbrains-mono-latin-wght-normal.woff2")}") format("woff2"); }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; background: #05060d; }
  body { position: relative; font-family: "Inter", sans-serif; color: #e9edf8; }
  .grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px); background-size: 48px 48px; -webkit-mask-image: radial-gradient(ellipse 80% 90% at 40% 45%, #000 20%, transparent 78%); mask-image: radial-gradient(ellipse 80% 90% at 40% 45%, #000 20%, transparent 78%); }
  .glow { position: absolute; border-radius: 50%; filter: blur(90px); }
  .g1 { width: 520px; height: 520px; left: -140px; top: -170px; background: rgba(34,211,238,.30); }
  .g2 { width: 560px; height: 560px; left: 330px; bottom: -330px; background: rgba(139,92,246,.30); }
  .g3 { width: 520px; height: 520px; right: -120px; top: -40px; background: rgba(244,114,182,.26); }
  .left { position: absolute; left: 76px; top: 66px; width: 700px; }
  .eyebrow { display: flex; align-items: center; gap: 14px; font: 500 19px "JetBrains Mono", monospace; letter-spacing: .22em; text-transform: uppercase; color: #67e8f9; }
  .dot { width: 11px; height: 11px; border-radius: 50%; background: #34d399; box-shadow: 0 0 14px #34d399; }
  h1 { margin-top: 28px; font: 700 120px/0.94 "Space Grotesk", sans-serif; letter-spacing: -0.035em; }
  h1 span { display: block; background: linear-gradient(100deg, #22d3ee 0%, #8b5cf6 52%, #f472b6 100%); -webkit-background-clip: text; background-clip: text; color: transparent; padding-bottom: 6px; }
  .tag { margin-top: 24px; font: 500 30px/1.3 "Inter", sans-serif; color: #cbd5e1; max-width: 620px; }
  .tag b { font-weight: 600; color: #fff; }
  .chips { margin-top: 26px; display: flex; gap: 12px; }
  .chip { font: 500 18px "JetBrains Mono", monospace; color: #a5f3fc; padding: 9px 16px; border-radius: 999px; border: 1px solid rgba(255,255,255,.16); background: rgba(12,16,36,.75); }
  .url { position: absolute; left: 76px; bottom: 50px; font: 500 24px "JetBrains Mono", monospace; color: #67e8f9; letter-spacing: .02em; }
  .url i { font-style: normal; color: #64748b; }
  .frame { position: absolute; right: 78px; top: 58px; width: 352px; height: 514px; padding: 4px; border-radius: 176px 176px 26px 26px; background: linear-gradient(160deg, #22d3ee, #8b5cf6 55%, #f472b6); box-shadow: 0 0 80px -10px rgba(139,92,246,.65), 0 30px 70px -20px rgba(0,0,0,.8); }
  .frame div { width: 100%; height: 100%; border-radius: 172px 172px 22px 22px; overflow: hidden; background: #0c1024; }
  .frame img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 22%; display: block; }
  .badge { position: absolute; left: 744px; top: 478px; font: 500 17px "JetBrains Mono", monospace; color: #bbf7d0; padding: 10px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,.18); background: rgba(5,6,13,.88); box-shadow: 0 10px 30px -8px rgba(0,0,0,.7); }
  .badge2 { position: absolute; right: 40px; top: 322px; font: 500 17px "JetBrains Mono", monospace; color: #a5f3fc; padding: 10px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,.18); background: rgba(5,6,13,.88); box-shadow: 0 10px 30px -8px rgba(0,0,0,.7); }
</style></head>
<body>
  <div class="grid"></div>
  <div class="glow g1"></div><div class="glow g2"></div><div class="glow g3"></div>
  <div class="left">
    <div class="eyebrow"><span class="dot"></span>AI systems engineer / Johannesburg</div>
    <h1>Kone<span>Tshivhinda</span></h1>
    <p class="tag">AI systems that are <b>agentic</b>, <b>auditable</b> and <b>sovereign</b>.</p>
    <div class="chips"><span class="chip">Claude</span><span class="chip">RAG</span><span class="chip">MCP</span><span class="chip">AWS</span><span class="chip">POPIA</span></div>
  </div>
  <div class="url">konethegreat<i>.</i>github<i>.</i>io</div>
  <div class="frame"><div><img src="${file(pub, "images", "portrait-1000.webp")}" alt="" /></div></div>
  <div class="badge2">claude · mcp · rag</div>
  <div class="badge">human sign-off ✓</div>
</body></html>`

const ogHtml = path.join(root, "scripts", ".og-render.html")
fs.writeFileSync(ogHtml, og)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.goto(pathToFileURL(ogHtml).href)
await page.evaluate(() => document.fonts.ready)
await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0))
await page.waitForTimeout(300)
const shot = await page.screenshot({ type: "png" })
await browser.close()
fs.rmSync(ogHtml)

// A palette PNG keeps the file small enough for chat apps that skip large previews.
await sharp(shot).png({ palette: true, quality: 92, effort: 10, dither: 1 }).toFile(path.join(pub, "og-image.png"))
console.log("wrote og-image.png", fs.statSync(path.join(pub, "og-image.png")).size, "bytes")

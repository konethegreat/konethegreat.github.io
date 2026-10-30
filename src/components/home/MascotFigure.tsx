import { useId, useState } from "react"

/**
 * Adapted from Mascot Portfolio Hero by Kedhareswer Naidu
 * (https://21st.dev/@kedhareswer/components/mascot-portfolio-hero), MIT.
 * The drawing is kept; the layout, palette and interaction are rebuilt for this site.
 */

const CW = 600
const CH = 720

const greetings = ["Hi, I'm Kone.", "Welcome to the workshop.", "Look around. Everything opens.", "Try the circle menu."]

interface MascotFigureProps {
  skin?: string
  beanie?: string
  shirt?: string
  tag?: string
  className?: string
}

export function MascotFigure({
  skin = "#6B4229",
  beanie = "#20302E",
  shirt = "#2A2320",
  tag = "#D8A24A",
  className,
}: MascotFigureProps) {
  const uid = useId().replace(/:/g, "")
  const id = (name: string) => name + uid
  const u = (name: string) => `url(#${id(name)})`
  const [greetingIndex, setGreetingIndex] = useState(0)
  const [happy, setHappy] = useState(false)

  const poke = () => {
    setGreetingIndex((index) => (index + 1) % greetings.length)
    setHappy(true)
    window.setTimeout(() => setHappy(false), 1100)
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={poke}
        className="mascot-figure group relative mx-auto block w-full max-w-[26rem] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <span className="sr-only">Say hello to the character</span>
        <span
          className="mascot-bubble absolute left-0 top-2 z-10 max-w-[13rem] rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3 text-left text-sm leading-snug shadow-lg transition-opacity"
          aria-live="polite"
        >
          {greetings[greetingIndex]}
        </span>
        <svg viewBox={`0 0 ${CW} ${CH}`} className="block w-full overflow-visible" aria-hidden="true">
          <defs>
            <radialGradient id={id("shade")} cx="46%" cy="40%" r="62%">
              <stop offset="0.55" stopColor="#7a2e14" stopOpacity="0" />
              <stop offset="1" stopColor="#7a2e14" stopOpacity="0.34" />
            </radialGradient>
            <radialGradient id={id("hi")} cx="36%" cy="30%" r="42%">
              <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={id("blush")}>
              <stop offset="0" stopColor="#ff6f6f" stopOpacity="0.55" />
              <stop offset="1" stopColor="#ff6f6f" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={id("knit")} cx="38%" cy="22%" r="80%">
              <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
              <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.35" />
            </radialGradient>
            <radialGradient id={id("eye")} cx="40%" cy="35%" r="70%">
              <stop offset="0" stopColor="#3a3a3c" />
              <stop offset="1" stopColor="#050505" />
            </radialGradient>
            <radialGradient id={id("nose")} cx="42%" cy="36%" r="66%">
              <stop offset="0" stopColor="#ff9c82" stopOpacity="0.18" />
              <stop offset="1" stopColor="#b8583a" stopOpacity="0.42" />
            </radialGradient>
            <linearGradient id={id("neck")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6b2a14" stopOpacity="0.45" />
              <stop offset="0.5" stopColor="#6b2a14" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id={id("cloth")} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
              <stop offset="1" stopColor="#000" stopOpacity="0.3" />
            </linearGradient>
            <filter id={id("fuzz")} x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <clipPath id={id("mouth")}>
              <path d="M218 440 Q300 458 382 440 Q376 524 300 530 Q224 524 218 440 Z" />
            </clipPath>
            <clipPath id={id("cuff")}>
              <path d="M114 262 Q300 222 486 262 L490 322 Q300 286 110 322 Z" />
            </clipPath>
          </defs>

          <ellipse cx="300" cy="712" rx="250" ry="16" fill="#000" opacity="0.08" />

          <g className="mascot-breathe">
            <g>
              <path d="M28 730 C40 646 104 604 206 588 L394 588 C496 604 560 646 572 730 Z" fill={shirt} />
              <path d="M28 730 C40 646 104 604 206 588 L394 588 C496 604 560 646 572 730 Z" fill={u("cloth")} />
              <path d="M246 500 L354 500 L360 600 Q300 624 240 600 Z" fill={skin} />
              <path d="M246 500 L354 500 L360 600 Q300 624 240 600 Z" fill={u("neck")} />
              <path d="M236 566 Q262 604 300 628 L250 668 Q214 628 194 594 Z" fill={shirt} />
              <path d="M364 566 Q338 604 300 628 L350 668 Q386 628 406 594 Z" fill={shirt} />
              <path
                d="M236 566 Q262 604 300 628 L250 668 Q214 628 194 594 Z M364 566 Q338 604 300 628 L350 668 Q386 628 406 594 Z"
                fill="#fff"
                opacity="0.07"
                stroke="#000"
                strokeOpacity="0.4"
                strokeWidth="2"
              />
              <rect x="288" y="628" width="24" height="102" fill="#fff" opacity="0.05" stroke="#000" strokeOpacity="0.35" strokeWidth="2" />
              <circle cx="300" cy="656" r="6" fill="#2a2a2c" stroke="#000" strokeOpacity="0.5" />
              <circle cx="300" cy="698" r="6" fill="#2a2a2c" stroke="#000" strokeOpacity="0.5" />
            </g>

            <g>
              <ellipse cx="138" cy="380" rx="46" ry="60" fill={skin} />
              <ellipse cx="138" cy="380" rx="46" ry="60" fill={u("shade")} />
              <path d="M150 348 Q118 360 124 392 Q130 416 150 414" fill="none" stroke="#a24c2e" strokeOpacity="0.35" strokeWidth="7" strokeLinecap="round" />
              <ellipse cx="136" cy="392" rx="24" ry="22" fill={u("blush")} />
              <ellipse cx="462" cy="380" rx="46" ry="60" fill={skin} />
              <ellipse cx="462" cy="380" rx="46" ry="60" fill={u("shade")} />
              <path d="M450 348 Q482 360 476 392 Q470 416 450 414" fill="none" stroke="#a24c2e" strokeOpacity="0.35" strokeWidth="7" strokeLinecap="round" />
              <ellipse cx="464" cy="392" rx="24" ry="22" fill={u("blush")} />

              <path d="M300 150 C402 150 470 226 470 348 C470 472 396 562 300 562 C204 562 130 472 130 348 C130 226 198 150 300 150 Z" fill={skin} />
              <path d="M300 150 C402 150 470 226 470 348 C470 472 396 562 300 562 C204 562 130 472 130 348 C130 226 198 150 300 150 Z" fill={u("shade")} />
              <path d="M300 150 C402 150 470 226 470 348 C470 472 396 562 300 562 C204 562 130 472 130 348 C130 226 198 150 300 150 Z" fill={u("hi")} />

              <ellipse cx="190" cy="430" rx={happy ? 50 : 44} ry={happy ? 34 : 30} fill={u("blush")} />
              <ellipse cx="410" cy="430" rx={happy ? 50 : 44} ry={happy ? 34 : 30} fill={u("blush")} />

              <g>
                <path d={happy ? "M198 292 Q230 270 264 286" : "M198 300 Q230 282 264 294"} fill="none" stroke="#3b2518" strokeWidth="22" strokeLinecap="round" />
                <path d={happy ? "M336 286 Q370 270 402 292" : "M336 294 Q370 282 402 300"} fill="none" stroke="#3b2518" strokeWidth="22" strokeLinecap="round" />
              </g>

              <g>
                {happy ? (
                  <>
                    <path d="M214 356 Q240 324 266 356" fill="none" stroke="#111" strokeWidth="13" strokeLinecap="round" />
                    <path d="M334 356 Q360 324 386 356" fill="none" stroke="#111" strokeWidth="13" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <ellipse cx="240" cy="350" rx="25" ry="31" fill={u("eye")} />
                    <circle cx="231" cy="336" r="8.5" fill="#fff" />
                    <circle cx="250" cy="361" r="3.5" fill="#fff" opacity="0.8" />
                    <ellipse cx="360" cy="350" rx="25" ry="31" fill={u("eye")} />
                    <circle cx="351" cy="336" r="8.5" fill="#fff" />
                    <circle cx="370" cy="361" r="3.5" fill="#fff" opacity="0.8" />
                  </>
                )}
              </g>

              <path d="M420 382 L423.5 391 L433 391.5 L425.6 397.5 L428.2 406.8 L420 401.5 L411.8 406.8 L414.4 397.5 L407 391.5 L416.5 391 Z" fill="#2a1a14" />

              <g transform={happy ? "translate(300 440) scale(1.06 1.12) translate(-300 -440)" : undefined}>
                <path d="M218 440 Q300 458 382 440 Q376 524 300 530 Q224 524 218 440 Z" fill="#3d0f0f" />
                <g clipPath={u("mouth")}>
                  <ellipse cx="300" cy="530" rx="46" ry="22" fill="#d9575a" />
                  <path d="M210 436 Q300 456 390 436 L390 474 Q300 490 210 474 Z" fill="#fff" />
                  <path d="M236 516 Q300 500 364 516 L364 540 L236 540 Z" fill="#f3efe9" />
                  <path d="M262 452 V484 M300 456 V488 M338 452 V484" stroke="#000" strokeOpacity="0.08" strokeWidth="2" />
                </g>
                <path d="M218 440 Q300 458 382 440 Q376 524 300 530 Q224 524 218 440 Z" fill="none" stroke="#8a3524" strokeOpacity="0.45" strokeWidth="3" />
                <path d="M208 432 Q212 442 220 446 M392 432 Q388 442 380 446" fill="none" stroke="#a24c2e" strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" />
              </g>

              <g>
                <ellipse cx="300" cy="414" rx="28" ry="12" fill="#6b2a14" opacity="0.14" />
                <ellipse cx="300" cy="398" rx="29" ry="26" fill={skin} />
                <ellipse cx="300" cy="398" rx="29" ry="26" fill={u("nose")} />
                <ellipse cx="291" cy="387" rx="10" ry="8" fill="#fff" opacity="0.45" />
              </g>

              <g transform="translate(0 -22)">
                <g filter={u("fuzz")}>
                  <path d="M126 300 C112 168 196 88 300 88 C404 88 488 168 474 300 Z" fill={beanie} />
                  <path d="M126 300 C112 168 196 88 300 88 C404 88 488 168 474 300 Z" fill={u("knit")} />
                  <path d="M114 262 Q300 222 486 262 L490 322 Q300 286 110 322 Z" fill={beanie} />
                  <g clipPath={u("cuff")} stroke="#fff" strokeOpacity="0.08" strokeWidth="5">
                    {Array.from({ length: 34 }, (_, i) => (
                      <line key={i} x1={112 + i * 11.4} y1="220" x2={112 + i * 11.4} y2="330" />
                    ))}
                  </g>
                  <path d="M114 262 Q300 222 486 262 L490 322 Q300 286 110 322 Z" fill="#000" opacity="0.18" />
                  <path d="M112 292 Q300 254 488 292" fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="3" />
                </g>
                <g transform="rotate(-7 190 272)">
                  <rect x="172" y="238" width="36" height="64" rx="5" fill={tag} />
                  <rect x="172" y="238" width="36" height="64" rx="5" fill={u("cloth")} />
                  <rect x="177" y="243" width="26" height="54" rx="3" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.6" strokeDasharray="3 3" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </button>
    </div>
  )
}

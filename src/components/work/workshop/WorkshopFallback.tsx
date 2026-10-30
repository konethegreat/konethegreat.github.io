import { stations, type StationId } from "@/data/work"

const ACCENT: Record<StationId, string> = {
  agents: "var(--brass)",
  retrieval: "var(--copper)",
  product: "var(--teal)",
  "local-first": "var(--brass)",
  cloud: "var(--copper)",
  quality: "var(--teal)",
}

type Spot = { x: number; y: number }
type Layout = { viewBox: string; spots: Record<StationId, Spot>; className: string }

const WIDE: Layout = {
  viewBox: "0 0 900 420",
  className: "hidden h-full w-full sm:block",
  spots: {
    quality: { x: 450, y: 152 },
    agents: { x: 168, y: 188 },
    cloud: { x: 732, y: 188 },
    retrieval: { x: 288, y: 252 },
    "local-first": { x: 612, y: 252 },
    product: { x: 450, y: 296 },
  },
}

const TALL: Layout = {
  viewBox: "0 0 420 530",
  className: "block h-full w-full sm:hidden",
  spots: {
    quality: { x: 210, y: 118 },
    agents: { x: 92, y: 196 },
    cloud: { x: 328, y: 196 },
    retrieval: { x: 124, y: 336 },
    "local-first": { x: 296, y: 336 },
    product: { x: 210, y: 438 },
  },
}

const ORDER: StationId[] = ["quality", "agents", "cloud", "retrieval", "local-first", "product"]

function Sculpture({ id, accent }: { id: StationId; accent: string }) {
  switch (id) {
    case "agents":
      return (
        <g fill={accent}>
          <circle cx="-12" cy="-16" r="7" />
          <circle cx="11" cy="-30" r="9" />
          <circle cx="0" cy="-6" r="5" opacity="0.75" />
        </g>
      )
    case "retrieval":
      return (
        <g fill={accent}>
          <rect x="-22" y="-10" width="44" height="6" rx="3" />
          <rect x="-22" y="-22" width="44" height="6" rx="3" opacity="0.72" />
          <rect x="-22" y="-34" width="44" height="6" rx="3" opacity="0.5" />
        </g>
      )
    case "product":
      return (
        <g transform="rotate(-8)">
          <rect x="-24" y="-36" width="48" height="30" rx="4" fill={accent} opacity="0.9" />
          <rect x="-16" y="-30" width="32" height="17" rx="2" fill="var(--background)" stroke={accent} />
        </g>
      )
    case "local-first":
      return (
        <g fill="none" stroke={accent} strokeWidth="2">
          <rect x="-14" y="-24" width="24" height="24" rx="1" />
          <rect x="-6" y="-34" width="24" height="24" rx="1" opacity="0.6" />
          <path d="M-14 -24 L-6 -34 M10 -24 L18 -34 M10 0 L18 -10 M-14 0 L-6 -10" opacity="0.6" />
        </g>
      )
    case "cloud":
      return (
        <g fill="none" stroke={accent} strokeWidth="2">
          <path d="M0 -38 L15 -29 L15 -12 L0 -3 L-15 -12 L-15 -29 Z" />
          <path d="M0 -38 L0 -20 M-15 -12 L0 -20 L15 -12" opacity="0.55" />
        </g>
      )
    case "quality":
      return <ellipse cx="0" cy="-20" rx="18" ry="10" fill="none" stroke={accent} strokeWidth="7" />
  }
}

function Scene({ layout, active }: { layout: Layout; active: StationId | null }) {
  const tall = layout === TALL
  const floor = tall
    ? { cx: 210, cy: 300, rx: 196, ry: 188 }
    : { cx: 450, cy: 262, rx: 340, ry: 118 }

  return (
    <svg viewBox={layout.viewBox} className={layout.className}>
      <ellipse cx={floor.cx} cy={floor.cy} rx={floor.rx} ry={floor.ry} fill="var(--muted)" opacity="0.5" />
      <ellipse
        cx={floor.cx}
        cy={floor.cy}
        rx={floor.rx - 12}
        ry={floor.ry - 6}
        fill="none"
        stroke="var(--border)"
        strokeDasharray="4 7"
      />
      <ellipse
        cx={floor.cx}
        cy={floor.cy}
        rx={tall ? 110 : 176}
        ry={tall ? 54 : 60}
        fill="none"
        stroke="var(--border)"
        strokeDasharray="2 6"
        opacity="0.7"
      />

      {ORDER.map((id, index) => {
        const station = stations.find((entry) => entry.id === id)
        if (!station) return null
        const spot = layout.spots[id]
        const accent = ACCENT[id]
        const lit = active === id
        return (
          <g key={id} transform={`translate(${spot.x} ${spot.y})`}>
            <ellipse cx="0" cy="18" rx="46" ry="13" fill="rgb(0 0 0 / 0.18)" />
            <rect
              x="-36"
              y="-20"
              width="72"
              height="34"
              rx="8"
              fill="var(--card)"
              stroke={lit ? accent : "var(--border)"}
              strokeWidth={lit ? 2 : 1}
            />
            <ellipse
              cx="0"
              cy="-20"
              rx="36"
              ry="10"
              fill="var(--muted)"
              stroke={lit ? accent : "var(--border)"}
            />
            <ellipse
              className="workshop-pulse fx-anim"
              style={{ animationDelay: `${index * 0.4}s` }}
              cx="0"
              cy="-20"
              rx="24"
              ry="6.5"
              fill="none"
              stroke={accent}
              strokeWidth="2"
              opacity={lit ? 1 : 0.45}
            />
            <g transform="translate(0 -30)">
              <g className="workshop-float fx-anim" style={{ animationDelay: `${index * 0.45}s` }}>
                <Sculpture id={id} accent={accent} />
              </g>
            </g>
            <text
              y="48"
              textAnchor="middle"
              fill="var(--muted-foreground)"
              fontFamily="'JetBrains Mono Variable', monospace"
              fontSize="10"
              letterSpacing="1.6"
            >
              {station.label.toUpperCase()}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function WorkshopFallback({ active }: { active: StationId | null }) {
  return (
    <div aria-hidden="true" className="h-[26rem] w-full">
      <Scene layout={WIDE} active={active} />
      <Scene layout={TALL} active={active} />
    </div>
  )
}

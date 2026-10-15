import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowDown, Command, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Photo } from "@/components/ui/photo"
import { Counter } from "@/components/fx/Counter"
import { ShutterText } from "@/components/fx/ShutterText"
import { RotatingWords } from "@/components/fx/RotatingWords"
import { Marquee } from "@/components/fx/Marquee"
import { GithubIcon, LinkedinIcon } from "@/lib/icons"
import { heroIntro, links, nowItems, rotatingWords, stats } from "@/data/profile"
import { marqueeTools } from "@/data/skills"
import { scrollToId } from "@/lib/hooks"

interface HeroProps {
  onOpenPalette: () => void
}

/** The rotating words as one sentence fragment for screen readers: "a, b and c". */
const spokenWords = `${rotatingWords.slice(0, -1).join(", ")} and ${rotatingWords[rotatingWords.length - 1]}`

export function Hero({ onOpenPalette }: HeroProps) {
  const [replay, setReplay] = useState(0)

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      <div aria-hidden="true" className="bg-grid mask-radial pointer-events-none absolute inset-0 -z-10 opacity-70" />

      <div className="mx-auto grid grid-cols-1 max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-10 lg:px-8">
        <div className="min-w-0">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.22em] text-cyan-300"
          >
            <span className="relative flex size-2">
              <span className="fx-anim absolute inline-flex size-full animate-ping-soft rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            AI systems engineer
            <span aria-hidden="true" className="text-slate-400">
              /
            </span>
            Johannesburg, ZA
          </motion.p>

          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-16 -inset-y-10 -z-10 bg-[radial-gradient(closest-side,rgba(139,92,246,0.26),rgba(34,211,238,0.06)_65%,transparent)]"
            />
            <h1
              id="hero-title"
              className="font-display font-bold uppercase leading-[0.86] tracking-[-0.045em] [--f1:clamp(5rem,28vw,8.5rem)] md:[--f1:clamp(5rem,16.5vw,14.25rem)]"
            >
              <span className="sr-only">Kone Tshivhinda</span>
              <span aria-hidden="true" className="block" style={{ fontSize: "var(--f1)" }}>
                <ShutterText text="KONE" replayKey={replay} />
              </span>
              <span aria-hidden="true" className="mt-[0.06em] block" style={{ fontSize: "calc(var(--f1) * 0.392)" }}>
                <ShutterText text="TSHIVHINDA" baseDelay={0.35} replayKey={replay} />
              </span>
            </h1>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setReplay((n) => n + 1)}
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400 transition hover:border-white/25 hover:text-white"
              aria-label="Re-shutter: replay the name animation"
            >
              <RefreshCw className="size-3.5 transition-transform duration-500 group-hover:rotate-180" aria-hidden="true" />
              Re-shutter
            </button>
          </div>

          <p className="mt-8 text-2xl font-medium leading-snug tracking-tight sm:text-4xl">
            <span className="sr-only">I build AI systems that are {spokenWords}.</span>
            <span aria-hidden="true">
              I build AI&nbsp;systems that&nbsp;are <RotatingWords words={rotatingWords} />
            </span>
          </p>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{heroIntro}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button asChild variant="glow" size="lg">
              <a
                href="#work"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToId("work")
                }}
              >
                See the work <ArrowDown aria-hidden="true" />
              </a>
            </Button>
            <Button variant="outline" size="lg" onClick={onOpenPalette} className="hidden sm:inline-flex">
              <Command aria-hidden="true" /> Quick menu
              <kbd className="ml-1 rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                Ctrl K
              </kbd>
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-4 text-slate-400">
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm transition hover:text-white"
            >
              <GithubIcon className="size-4" /> konethegreat
            </a>
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm transition hover:text-white"
            >
              <LinkedinIcon className="size-4" /> LinkedIn
            </a>
          </div>
        </div>

        <Portrait />
      </div>

      <div className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:mt-20 lg:px-8">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Right now">
          {nowItems.map((item, i) => (
            <li
              key={item.label}
              className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
            >
              <span
                aria-hidden="true"
                className={`size-2 shrink-0 rounded-full ${i === 0 ? "bg-emerald-400" : i === 1 ? "bg-cyan-400" : "bg-violet-400"}`}
              />
              <span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-slate-400">{item.label}</span>
                <span className="block text-foreground">{item.detail}</span>
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass flex flex-col-reverse justify-end rounded-2xl px-5 py-5">
              <dt className="mt-1 text-sm font-medium text-foreground">
                {stat.label}
                <span className="mt-1 block text-xs font-normal leading-snug text-muted-foreground">{stat.hint}</span>
              </dt>
              <dd className="font-display text-4xl font-semibold text-gradient sm:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-14 pb-12 lg:mt-20">
        <Marquee items={marqueeTools} label="Tools and technologies I use" />
      </div>
    </section>
  )
}

function Portrait() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[23rem] sm:max-w-[26rem] lg:max-w-[28rem]"
    >
      <div
        aria-hidden="true"
        className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.35),rgba(34,211,238,0.1)_60%,transparent)]"
      />
      <div className="ring-conic fx-anim rounded-t-[999px] rounded-b-[2rem] p-[2px] shadow-[0_30px_100px_-30px_rgb(139_92_246/0.7)]">
        <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[calc(2rem-2px)] bg-[#0a0d1b]">
          <Photo
            name="portrait"
            priority
            alt="Kone Tshivhinda in a navy blazer and white open-collar shirt, photographed outdoors in the sun"
            sizes="(min-width: 1024px) 28rem, (min-width: 640px) 26rem, 92vw"
            className="aspect-[3/4] w-full object-cover object-[50%_18%]"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05060d]/90 via-transparent to-transparent" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="fx-anim animate-scan absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-transparent via-cyan-300/[0.12] to-transparent" />
          </div>
          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
            <div className="glass-strong rounded-xl px-3.5 py-2.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">Founder</p>
              <p className="text-sm font-medium text-foreground">K-ONE IT SOLUTIONS</p>
            </div>
            <span className="glass-strong hidden rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald-300 sm:inline-flex">
              Johannesburg
            </span>
          </div>
        </div>
      </div>

      <div className="fx-anim animate-float glass-strong absolute -left-6 top-[26%] hidden rounded-xl px-3 py-2 font-mono text-xs text-cyan-200 lg:block">
        claude · ollama · rag
      </div>
      <div
        className="fx-anim animate-float glass-strong absolute -right-5 top-[56%] hidden rounded-xl px-3 py-2 font-mono text-xs text-emerald-200 lg:block"
        style={{ animationDelay: "-3s" }}
      >
        human sign-off ✓
      </div>
    </motion.div>
  )
}

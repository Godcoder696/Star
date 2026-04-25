"use client"

import { useState, useEffect, useRef } from "react"
import { playSound } from "@/hooks/use-cat-sound"

function runConfetti() {
  if (typeof window === "undefined") return
  import("canvas-confetti").then((confettiModule) => {
    const confetti = confettiModule.default
    const colors = ["#f9a8d4", "#c084fc", "#fbbf24", "#fb923c", "#34d399"]
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 }, colors })
    setTimeout(() => confetti({ particleCount: 60, spread: 60, origin: { y: 0.5, x: 0.2 }, colors }), 300)
    setTimeout(() => confetti({ particleCount: 60, spread: 60, origin: { y: 0.5, x: 0.8 }, colors }), 500)
  })
}

function Flame({ blown }: { blown: boolean }) {
  if (blown) {
    return (
      <div className="relative" style={{ width: 14, height: 22 }}>
        {/* Smoke puffs */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-bday-muted opacity-40"
          style={{ width: 8, height: 8, bottom: 4, animation: blown ? "rise 1.5s ease-out forwards" : "none" }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-bday-muted opacity-20"
          style={{ width: 12, height: 12, bottom: 0, animation: blown ? "rise 1.8s ease-out 0.3s forwards" : "none" }}
        />
      </div>
    )
  }
  return (
    <div className="flicker-anim" style={{ width: 14, height: 28 }}>
      <svg viewBox="0 0 14 28" fill="none" width="14" height="28">
        <ellipse cx="7" cy="20" rx="6" ry="8" fill="#fbbf24" />
        <ellipse cx="7" cy="14" rx="4" ry="7" fill="#fb923c" />
        <ellipse cx="7" cy="10" rx="2.5" ry="5" fill="#f87171" />
        <ellipse cx="7" cy="8" rx="1.5" ry="3" fill="#fef3c7" />
      </svg>
    </div>
  )
}

const CANDLES = [
  { x: 58, color: "#f472b6" },
  { x: 74, color: "#a78bfa" },
  { x: 90, color: "#fb923c" },
  { x: 106, color: "#34d399" },
  { x: 122, color: "#f472b6" },
]

export default function CakeSection() {
  const [blown, setBlown] = useState(false)
  const [message, setMessage] = useState("")
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.3 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  function handleBlow() {
    if (blown) return
    setBlown(true)
    runConfetti()
    // Excited cat sounds: trill then meow
    playSound("trill", 0.7)
    setTimeout(() => playSound("meow", 0.6), 350)
    setMessage("Yaaaay!! Your wish is sent to the universe! 🌙")
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fce7f3 0%, #f5d0fe 100%)" }}
    >
      {/* Section label */}
      <div
        className="mb-6 text-center"
        style={{
          transition: "opacity 0.8s, transform 0.8s",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(24px)",
        }}
      >
        <p className="font-sans text-bday-deep-pink font-bold tracking-widest uppercase text-xs mb-2 opacity-70">
          Make a wish!
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-bday-deep-pink text-balance">
          Blow out the candles!
        </h2>
        <p className="font-sans text-bday-muted mt-2">
          Click the cake to blow — Billa is watching!
        </p>
      </div>

      {/* Cake SVG */}
      <button
        onClick={handleBlow}
        disabled={blown}
        aria-label="Blow out birthday candles"
        className="group focus:outline-none"
        style={{
          transition: "opacity 0.8s 0.3s, transform 0.8s 0.3s",
          opacity: inView ? 1 : 0,
          transform: inView ? "scale(1)" : "scale(0.8)",
          cursor: blown ? "default" : "pointer",
        }}
      >
        <div className={`${!blown ? "group-hover:scale-105 group-active:scale-95" : ""} transition-transform`}>
          <svg width="180" height="200" viewBox="0 0 180 200" fill="none">
            {/* Candles + flames, all in one coordinate space */}
            {CANDLES.map((c, i) => (
              <g key={i}>
                {/* Flame / smoke via foreignObject so React components work */}
                <foreignObject x={c.x - 7} y={8} width={14} height={34}>
                  <Flame blown={blown} />
                </foreignObject>
                {/* Candle body */}
                <rect x={c.x - 4} y={42} width={8} height={28} rx={3} fill={c.color} />
                <rect x={c.x - 4} y={42} width={8} height={10} rx={3} fill="white" opacity="0.3" />
              </g>
            ))}
            {/* Top tier */}
            <rect x={46} y={70} width={88} height={36} rx={10} fill="#fce7f3" stroke="#f9a8d4" strokeWidth={2} />
            <rect x={46} y={70} width={88} height={12} rx={10} fill="#fbcfe8" />
            {/* Frosting drips top */}
            <path d="M56 82 Q62 90 68 82 Q74 90 80 82 Q86 90 92 82 Q98 90 104 82 Q110 90 116 82 Q122 90 124 82" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Middle tier */}
            <rect x={28} y={104} width={124} height={44} rx={10} fill="#f5d0fe" stroke="#d8b4fe" strokeWidth={2} />
            <rect x={28} y={104} width={124} height={14} rx={10} fill="#ede9fe" />
            {/* Frosting drips middle */}
            <path d="M38 118 Q46 128 54 118 Q62 128 70 118 Q78 128 86 118 Q94 128 102 118 Q110 128 118 118 Q126 128 134 118 Q140 128 142 118" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Bottom tier / plate */}
            <ellipse cx={90} cy={170} rx={72} ry={10} fill="#fda4af" opacity="0.4" />
            {/* Decorations - hearts */}
            <text x="60" y="100" fontSize="14" fill="#f472b6">♥</text>
            <text x="100" y="100" fontSize="10" fill="#a78bfa">♥</text>
            {/* Stars on middle tier */}
            <text x="46" y="134" fontSize="12" fill="#fbbf24">✦</text>
            <text x="118" y="134" fontSize="12" fill="#fbbf24">✦</text>
            {/* "22" on cake */}
            <text x="76" y="140" fontSize="18" fill="#be185d" fontWeight="bold" fontFamily="serif">22</text>
          </svg>
        </div>
      </button>

      {/* Blow instruction indicator */}
      {!blown && (
        <p className="font-sans text-sm text-bday-muted mt-2 animate-bounce">
          tap the cake!
        </p>
      )}

      {/* Post-blow message */}
      {blown && message && (
        <div
          className="mt-6 bg-white/80 rounded-2xl px-8 py-4 shadow-md text-center"
          style={{ animation: "rise 0.6s ease-out forwards" }}
        >
          <p className="font-serif text-2xl text-bday-deep-pink">{message}</p>
          <p className="font-sans text-bday-muted mt-1 text-sm">
            May every single one of your wishes come true, Billi.
          </p>
        </div>
      )}
    </section>
  )
}

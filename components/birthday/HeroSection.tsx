"use client"

import { useEffect, useRef, useState } from "react"
import { playSound, startPurr } from "@/hooks/use-cat-sound"

const pawPositions = [
  { top: "8%", left: "5%", size: 36, delay: 0, rotation: -20 },
  { top: "15%", left: "88%", size: 28, delay: 0.4, rotation: 30 },
  { top: "72%", left: "3%", size: 32, delay: 0.8, rotation: 15 },
  { top: "80%", left: "90%", size: 40, delay: 0.2, rotation: -35 },
  { top: "45%", left: "92%", size: 24, delay: 1.0, rotation: 20 },
  { top: "60%", left: "6%", size: 22, delay: 0.6, rotation: -10 },
]

function PawPrint({ size = 32, color = "#f9a8d4", style = {} }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill={color} style={style}>
      <ellipse cx="32" cy="44" rx="16" ry="13" />
      <ellipse cx="14" cy="26" rx="8" ry="10" />
      <ellipse cx="50" cy="26" rx="8" ry="10" />
      <ellipse cx="22" cy="16" rx="7" ry="8" />
      <ellipse cx="42" cy="16" rx="7" ry="8" />
    </svg>
  )
}

function StarSparkle({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <span className="star-twinkle-anim absolute text-bday-pink select-none pointer-events-none" style={style}>
      ✦
    </span>
  )
}

export default function HeroSection() {
  const [visible, setVisible] = useState(false)
  const [catBlink, setCatBlink] = useState(false)
  const [catMood, setCatMood] = useState<"idle" | "happy" | "purring">("idle")
  const stopPurrRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    const blinkInterval = setInterval(() => {
      setCatBlink(true)
      setTimeout(() => setCatBlink(false), 200)
    }, 3000)
    // Occasional random meow
    const randomMeow = setInterval(() => {
      if (Math.random() < 0.3) playSound("brrp", 0.35)
    }, 12000)
    return () => {
      clearTimeout(t)
      clearInterval(blinkInterval)
      clearInterval(randomMeow)
    }
  }, [])

  function handleCatClick() {
    setCatMood("happy")
    playSound("meow", 0.65)
    setTimeout(() => setCatMood("idle"), 1200)
  }

  function handleCatHoverStart() {
    if (catMood === "purring") return
    setCatMood("purring")
    stopPurrRef.current = startPurr(0.3)
  }

  function handleCatHoverEnd() {
    if (stopPurrRef.current) {
      stopPurrRef.current()
      stopPurrRef.current = null
    }
    setCatMood("idle")
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* Background paw prints */}
      {pawPositions.map((p, i) => (
        <div
          key={i}
          className="absolute opacity-20 paw-bounce-anim"
          style={{
            top: p.top,
            left: p.left,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        >
          <PawPrint size={p.size} color="#f472b6" />
        </div>
      ))}

      {/* Stars */}
      <StarSparkle style={{ top: "20%", left: "12%", fontSize: "22px", animationDelay: "0s" }} />
      <StarSparkle style={{ top: "30%", left: "80%", fontSize: "16px", animationDelay: "0.7s" }} />
      <StarSparkle style={{ top: "65%", left: "15%", fontSize: "18px", animationDelay: "1.2s" }} />
      <StarSparkle style={{ top: "75%", left: "78%", fontSize: "24px", animationDelay: "0.3s" }} />

      {/* Cat illustration */}
      <button
        className="relative float-anim mb-6 select-none focus:outline-none cursor-pointer"
        style={{ transition: "opacity 0.8s", opacity: visible ? 1 : 0, background: "none", border: "none", padding: 0 }}
        onClick={handleCatClick}
        onMouseEnter={handleCatHoverStart}
        onMouseLeave={handleCatHoverEnd}
        aria-label={catMood === "purring" ? "Cat is purring" : "Click to hear the cat meow"}
        title="Click me!"
      >
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
          {/* Body */}
          <ellipse cx="80" cy="110" rx="44" ry="38" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2" />
          {/* Head */}
          <circle cx="80" cy="68" r="36" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2" />
          {/* Ears */}
          <polygon points="50,42 40,14 68,38" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2" />
          <polygon points="110,42 120,14 92,38" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2" />
          {/* Ear inner */}
          <polygon points="52,40 45,20 64,38" fill="#fbcfe8" />
          <polygon points="108,40 115,20 96,38" fill="#fbcfe8" />
          {/* Eyes */}
          <ellipse cx="67" cy="66" rx="7" ry={catBlink ? 1.5 : 8} fill="#1e1b4b" />
          <ellipse cx="93" cy="66" rx="7" ry={catBlink ? 1.5 : 8} fill="#1e1b4b" />
          {/* Eye shine */}
          {!catBlink && <circle cx="70" cy="63" r="2.5" fill="white" />}
          {!catBlink && <circle cx="96" cy="63" r="2.5" fill="white" />}
          {/* Cheek blush */}
          <ellipse cx="57" cy="76" rx="9" ry="5" fill="#fda4af" opacity="0.5" />
          <ellipse cx="103" cy="76" rx="9" ry="5" fill="#fda4af" opacity="0.5" />
          {/* Nose */}
          <ellipse cx="80" cy="78" rx="4" ry="3" fill="#f9a8d4" />
          {/* Mouth */}
          <path d="M74 82 Q80 88 86 82" stroke="#d946ef" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Whiskers left */}
          <line x1="46" y1="76" x2="68" y2="78" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="44" y1="80" x2="67" y2="80" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          {/* Whiskers right */}
          <line x1="114" y1="76" x2="92" y2="78" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="116" y1="80" x2="93" y2="80" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          {/* Party hat */}
          <polygon points="80,10 58,48 102,48" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" />
          <circle cx="80" cy="10" r="4" fill="#fbbf24" />
          <line x1="63" y1="38" x2="58" y2="48" stroke="white" strokeWidth="1" opacity="0.5" />
          <line x1="75" y1="26" x2="63" y2="48" stroke="white" strokeWidth="1" opacity="0.5" />
          {/* Tail */}
          <path d="M124 130 Q150 110 140 90 Q132 78 122 95" stroke="#f9a8d4" strokeWidth="8" fill="none" strokeLinecap="round" />
          {/* Party stars on body */}
          <text x="66" y="118" fontSize="14" fill="#f472b6">✦</text>
          <text x="82" y="125" fontSize="10" fill="#a78bfa">✦</text>
        </svg>
        {catMood !== "idle" && (
          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 font-serif text-bday-deep-pink text-sm whitespace-nowrap pointer-events-none"
            style={{ animation: "rise 0.4s ease-out forwards" }}
          >
            {catMood === "happy" ? "Meow! ♥" : "Purrrr..."}
          </div>
        )}
      </button>

      {/* Main heading */}
      <div
        style={{
          transition: "opacity 0.9s ease 0.3s, transform 0.9s ease 0.3s",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
        }}
        className="text-center mb-4"
      >
        <p className="font-sans text-bday-deep-pink font-bold tracking-widest uppercase text-sm mb-2 opacity-70">
          From Billa, with all the love
        </p>
        <h1 className="font-serif text-5xl md:text-7xl text-bday-deep-pink leading-tight text-balance">
          Happy Birthday
        </h1>
        <h2 className="font-serif text-6xl md:text-8xl text-bday-pink leading-tight text-balance mt-1">
          Billi!
        </h2>
      </div>

      {/* Age badge */}
      <div
        style={{
          transition: "opacity 0.9s ease 0.6s, transform 0.9s ease 0.6s",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
        }}
        className="pulse-soft-anim bg-bday-deep-pink text-white font-serif text-3xl md:text-4xl px-8 py-3 rounded-full shadow-lg mb-8 mt-2"
      >
        You&apos;re 22!
      </div>

      {/* Tagline */}
      <p
        style={{
          transition: "opacity 0.9s ease 0.9s",
          opacity: visible ? 1 : 0,
        }}
        className="font-sans text-bday-muted text-lg md:text-xl text-center max-w-sm leading-relaxed"
      >
        The world&apos;s most purrfect human gets a whole website today. Scroll down, bestie.
      </p>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 float-anim"
        style={{ animationDuration: "2s" }}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-1 text-bday-pink opacity-60">
          <span className="font-sans text-xs tracking-widest uppercase">scroll</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 14l-6-6h12l-6 6z" />
          </svg>
        </div>
      </div>
    </section>
  )
}

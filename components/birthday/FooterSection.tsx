"use client"

import { useState } from "react"
import { playSound } from "@/hooks/use-cat-sound"

function runConfetti() {
  if (typeof window === "undefined") return
  import("canvas-confetti").then((mod) => {
    const confetti = mod.default
    const end = Date.now() + 3000
    const colors = ["#f9a8d4", "#c084fc", "#fbbf24", "#fb923c", "#34d399"]
    ;(function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors })
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors })
      if (Date.now() < end) requestAnimationFrame(frame)
    })()
  })
}

export default function FooterSection() {
  const [celebrated, setCelebrated] = useState(false)

  function handleCelebrate() {
    setCelebrated(true)
    runConfetti()
    playSound("trill", 0.7)
    setTimeout(() => playSound("meow", 0.5), 280)
    setTimeout(() => playSound("brrp", 0.45), 600)
  }

  return (
    <footer
      className="relative py-24 px-4 flex flex-col items-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fce7f3 0%, #f5d0fe 100%)" }}
    >
      {/* Big cat paw background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <svg width="400" height="400" viewBox="0 0 64 64" fill="#f472b6">
          <ellipse cx="32" cy="44" rx="16" ry="13" />
          <ellipse cx="14" cy="26" rx="8" ry="10" />
          <ellipse cx="50" cy="26" rx="8" ry="10" />
          <ellipse cx="22" cy="16" rx="7" ry="8" />
          <ellipse cx="42" cy="16" rx="7" ry="8" />
        </svg>
      </div>

      {/* Cat waving goodbye */}
      <div className="float-anim mb-8" aria-hidden="true">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="55" r="30" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2" />
          <polygon points="38,30 30,10 52,28" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2" />
          <polygon points="82,30 90,10 68,28" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2" />
          <polygon points="39,28 34,14 48,27" fill="#fbcfe8" />
          <polygon points="81,28 86,14 72,27" fill="#fbcfe8" />
          <ellipse cx="50" cy="53" rx="5" ry="6" fill="#1e1b4b" />
          <ellipse cx="70" cy="53" rx="5" ry="6" fill="#1e1b4b" />
          <circle cx="52" cy="51" r="2" fill="white" />
          <circle cx="72" cy="51" r="2" fill="white" />
          <ellipse cx="60" cy="61" rx="3" ry="2.5" fill="#f9a8d4" />
          <path d="M55 65 Q60 70 65 65" stroke="#d946ef" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <line x1="32" y1="57" x2="46" y2="59" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="31" y1="62" x2="45" y2="62" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="88" y1="57" x2="74" y2="59" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="89" y1="62" x2="75" y2="62" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          {/* Waving paw */}
          <ellipse cx="95" cy="90" rx="14" ry="12" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2" />
          <ellipse cx="83" cy="76" rx="7" ry="8" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="1.5" />
          <ellipse cx="96" cy="73" rx="7" ry="8" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="1.5" />
          <ellipse cx="88" cy="69" rx="5.5" ry="6" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="1.5" />
          <ellipse cx="100" cy="70" rx="5.5" ry="6" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="text-center mb-8 relative z-10">
        <h2 className="font-serif text-4xl md:text-5xl text-bday-deep-pink mb-4 text-balance">
          Happy 22nd, Billi!
        </h2>
        <p className="font-sans text-bday-text max-w-md mx-auto leading-relaxed">
          This website is silly and over the top and made with the most genuine love from your Billa.
          You deserve all of this and infinitely more.
        </p>
        <p className="font-sans text-bday-muted mt-3 text-sm">
          May this year bring you everything you&apos;ve been quietly hoping for.
        </p>
      </div>

      {/* Celebrate button */}
      <button
        onClick={handleCelebrate}
        className="pulse-soft-anim font-sans font-bold text-lg bg-bday-deep-pink text-white px-10 py-4 rounded-full shadow-xl hover:bg-bday-pink transition-colors mb-8 relative z-10"
      >
        {celebrated ? "You are so celebrated! ♥" : "Celebrate one more time!"}
      </button>

      {/* Paw print trail */}
      <div className="flex gap-3 mb-8" aria-hidden="true">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{ opacity: 0.3 + i * 0.14, animationDelay: `${i * 0.2}s` }} className="paw-bounce-anim">
            <svg width="22" height="22" viewBox="0 0 64 64" fill="#f472b6">
              <ellipse cx="32" cy="44" rx="16" ry="13" />
              <ellipse cx="14" cy="26" rx="8" ry="10" />
              <ellipse cx="50" cy="26" rx="8" ry="10" />
              <ellipse cx="22" cy="16" rx="7" ry="8" />
              <ellipse cx="42" cy="16" rx="7" ry="8" />
            </svg>
          </div>
        ))}
      </div>

      <p className="font-sans text-xs text-bday-muted text-center opacity-50 relative z-10">
        Made with love, cat puns, and an unreasonable amount of pink. Billa, {new Date().getFullYear()}.
      </p>
    </footer>
  )
}

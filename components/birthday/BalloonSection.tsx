"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { playSound } from "@/hooks/use-cat-sound"

const wishes = [
  "May you always have a warm blanket, a hot drink, and a cat nearby.",
  "May your heart heal everything it needs to heal this year.",
  "May you laugh so hard you snort at least once a week.",
  "May every one of your plans work out, and the ones that don't make better stories.",
  "May you get everything you want, and buri nazar walo se bachaye Krishna ji.",
  "May people always feel lucky to be in your life — because they are.",
  "May 22 be the year you finally stop being so hard on yourself.",
  "May you always remember a unique billi is impossible to find.",
  "May you always find your way back home, no matter how far you wander.",
  "May every door that closes lead you to a better window. (Very cat of you to find it.)",
]

const balloonColors = [
  "#f472b6", "#a78bfa", "#fb923c", "#34d399", "#60a5fa", "#fbbf24",
  "#f472b6", "#c084fc", "#fb923c", "#34d399",
]

function Balloon({ color, popped, onClick, delay }: { color: string; popped: boolean; onClick: () => void; delay: number }) {
  if (popped) {
    return (
      <div className="flex flex-col items-center w-20 h-32 justify-end pb-2">
        <div className="flex gap-0.5">
          {["◞", "◟", "◜", "◝"].map((c, i) => (
            <span key={i} style={{ color, fontSize: 14, opacity: 0.5 }}>{c}</span>
          ))}
        </div>
      </div>
    )
  }
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center w-20 h-32 focus:outline-none balloon-float-anim"
      aria-label="Pop the balloon to reveal a wish"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="group-hover:scale-110 group-active:scale-90 transition-transform">
        <svg width="52" height="70" viewBox="0 0 52 70" fill="none">
          <ellipse cx="26" cy="30" rx="22" ry="28" fill={color} />
          <ellipse cx="18" cy="18" rx="7" ry="5" fill="white" opacity="0.3" />
          {/* Knot */}
          <ellipse cx="26" cy="57" rx="3" ry="4" fill={color} />
          {/* String */}
          <path d="M26 61 Q22 68 26 72" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          {/* Shine */}
          <ellipse cx="33" cy="22" rx="4" ry="6" fill="white" opacity="0.15" />
        </svg>
      </div>
      <div className="font-sans text-xs text-bday-muted mt-1 text-center opacity-70">tap!</div>
    </button>
  )
}

// Fixed delays so SSR and client render the same values (no Math.random in render)
const BALLOON_DELAYS = [0.24, 1.89, 1.02, 0.06, 1.61, 1.47, 0.99, 1.37, 0.63, 0.84]

export default function BalloonSection() {
  const [popped, setPopped] = useState<boolean[]>(Array(wishes.length).fill(false))
  const [shownWish, setShownWish] = useState<string | null>(null)
  const [wishIndex, setWishIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  function pop(i: number) {
    if (popped[i]) return
    const next = [...popped]
    next[i] = true
    setPopped(next)
    setShownWish(wishes[i])
    setWishIndex(i)
    // Hiss pop + surprised meow
    playSound("hiss", 0.55)
  }

  const allPopped = popped.every(Boolean)

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 flex flex-col items-center bg-bday-lavender/30"
    >
      <div
        className="text-center mb-10"
        style={{
          transition: "opacity 0.8s, transform 0.8s",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(24px)",
        }}
      >
        <p className="font-sans text-bday-deep-pink font-bold tracking-widest uppercase text-xs mb-2 opacity-70">
          wishes for you
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-bday-deep-pink text-balance">
          Pop a balloon!
        </h2>
        <p className="font-sans text-bday-muted mt-2 max-w-sm mx-auto">
          Each one has a special wish from Billa inside. Pop them all!
        </p>
      </div>

      {/* Balloon grid */}
      <div
        className="flex flex-wrap justify-center gap-4 max-w-2xl"
        style={{
          transition: "opacity 0.8s 0.3s",
          opacity: inView ? 1 : 0,
        }}
      >
        {wishes.map((_, i) => (
          <Balloon
            key={i}
            color={balloonColors[i % balloonColors.length]}
            popped={popped[i]}
            onClick={() => pop(i)}
            delay={BALLOON_DELAYS[i % BALLOON_DELAYS.length]}
          />
        ))}
      </div>

      {/* Wish reveal */}
      {shownWish && (
        <div
          className="mt-8 max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center"
          style={{ animation: "rise 0.5s ease-out forwards" }}
          key={wishIndex}
        >
          <div className="text-3xl mb-3" aria-hidden="true">🌟</div>
          <p className="font-serif text-xl text-bday-deep-pink leading-relaxed">
            &ldquo;{shownWish}&rdquo;
          </p>
        </div>
      )}

      {/* All popped celebration */}
      {allPopped && (
        <div className="mt-6 text-center" style={{ animation: "rise 0.5s ease-out 0.2s forwards", opacity: 0 }}>
          <p className="font-serif text-2xl text-bday-deep-pink">
            You got all {wishes.length} wishes, Billi!
          </p>
          <p className="font-sans text-bday-muted mt-1">All of them are coming true. I decided.</p>
        </div>
      )}
    </section>
  )
}

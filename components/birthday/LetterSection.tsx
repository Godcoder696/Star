"use client"

import { useRef, useEffect, useState } from "react"

export default function LetterSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 flex flex-col items-center"
      style={{ background: "linear-gradient(180deg, #fce7f3 0%, #ede9fe 100%)" }}
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
          a proper letter
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-bday-deep-pink text-balance">
          Dear Billi,
        </h2>
      </div>

      {/* Envelope trigger */}
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="group mb-10 focus:outline-none"
          aria-label="Open the letter"
          style={{
            transition: "opacity 0.8s 0.3s",
            opacity: inView ? 1 : 0,
          }}
        >
          <div className="relative group-hover:scale-105 group-active:scale-95 transition-transform">
            <svg width="120" height="90" viewBox="0 0 120 90" fill="none">
              {/* Envelope body */}
              <rect x="4" y="20" width="112" height="66" rx="8" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2" />
              {/* Flap closed */}
              <path d="M4 20 L60 60 L116 20" fill="#fbcfe8" stroke="#f9a8d4" strokeWidth="2" strokeLinejoin="round" />
              {/* Bottom fold lines */}
              <path d="M4 86 L42 52" stroke="#f9a8d4" strokeWidth="1.5" />
              <path d="M116 86 L78 52" stroke="#f9a8d4" strokeWidth="1.5" />
              {/* Heart seal */}
              <text x="50" y="50" fontSize="18" fill="#f472b6">♥</text>
            </svg>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="font-sans text-sm text-bday-deep-pink font-bold animate-bounce block">
                Tap to open!
              </span>
            </div>
          </div>
        </button>
      )}

      {/* Letter content */}
      {revealed && (
        <div
          className="w-full max-w-2xl"
          style={{ animation: "rise 0.7s ease-out forwards" }}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative">
            {/* Paper texture lines */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-b border-bday-lavender opacity-30"
                style={{ top: `${80 + i * 36}px` }}
              />
            ))}

            {/* Letter header */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-sans text-xs text-bday-muted tracking-widest uppercase">
                On your 22nd birthday
              </span>
              <span className="text-bday-pink">♥</span>
            </div>

            <div className="font-sans text-bday-text leading-relaxed space-y-5 relative z-10">
              <p>
                <span className="font-serif text-xl text-bday-deep-pink">Hey Billi,</span>
              </p>

              <p>
                I genuinely didn&apos;t know how to start this, so I&apos;m just going to say it: you are one of the best
                things in my life. Not in a greeting card way. In the real, specific, I&apos;ve-thought-about-this way.
              </p>

              <p>
                I&apos;ve seen you be so many things — silly and serious, soft and stubborn, lost and then impossibly
                found again. And every version of you has been worth knowing. That&apos;s rare. Most people only show
                you the good parts. You showed me all of them.
              </p>

              <p>
                22 is such a weird year. Old enough to feel things deeply, young enough to still get everything
                wrong in the best possible ways. I think this year is going to change something for you — I can&apos;t
                explain it, I just feel it. Like that thing cats do where they just <em>know</em>.
              </p>

              <p>
                I want you to know: I see you. Not just the funny, chaotic, meme-sending version (though I love
                her dearly). I mean the quiet version who worries at 3am. The one who tries so hard for the
                people she loves. The one who sometimes forgets to be kind to herself. I see her too.
              </p>

              <p>
                Be kind to her this year, okay? She deserves it. You deserve it.
              </p>

              <p>
                On behalf of all the people lucky enough to know you — happy birthday, Billi. You are
                loved in ways you don&apos;t fully understand yet.
              </p>

              <p>
                And I&apos;m really, really glad you exist.
              </p>

              <div className="pt-4 border-t border-bday-pink/20">
                <p className="font-serif text-xl text-bday-deep-pink">With all my love (and several cat noises),</p>
                <p className="font-serif text-2xl text-bday-deep-pink mt-1">Billa</p>
                <p className="font-sans text-bday-muted text-sm mt-1">Your fellow cat in crime ♥</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

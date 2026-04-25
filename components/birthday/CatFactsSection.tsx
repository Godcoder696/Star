"use client"

import { useState, useRef, useEffect } from "react"

const catFacts = [
  { fact: "Cats sleep 12–16 hours a day.", billi: "Billi: an aspiration, not a limitation." },
  { fact: "Cats purr at a frequency that promotes healing.", billi: "Billi has this effect on everyone around her." },
  { fact: "A group of cats is called a clowder.", billi: "Billa and Billi are a clowder of two. Very exclusive." },
  { fact: "Cats have 32 muscles in each ear.", billi: "Billi listens with her whole soul. Same energy." },
  { fact: "Cats can make 100+ distinct vocalizations.", billi: "Billi's laugh alone has at least 7 variations." },
  { fact: "Cats always land on their feet.", billi: "So does Billi. Every. Single. Time." },
  { fact: "Cats show love by slow blinking.", billi: "Billi does this with kind words instead. Both work." },
  { fact: "Cats rub on you to mark you as family.", billi: "Billi marks people by just caring about them." },
]

export default function CatFactsSection() {
  const [current, setCurrent] = useState(0)
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

  // Auto rotate
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % catFacts.length), 4000)
    return () => clearInterval(t)
  }, [])

  const item = catFacts[current]

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 flex flex-col items-center"
      style={{ background: "linear-gradient(180deg, #ede9fe 0%, #fce7f3 100%)" }}
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
          educational content
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-bday-deep-pink text-balance">
          Cat Facts About Billi
        </h2>
        <p className="font-sans text-bday-muted mt-2">
          Science agrees. Billa has receipts.
        </p>
      </div>

      <div
        className="w-full max-w-lg"
        style={{
          transition: "opacity 0.8s 0.3s",
          opacity: inView ? 1 : 0,
        }}
      >
        {/* Cat face decoration */}
        <div className="flex justify-center mb-6" aria-hidden="true">
          <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
            <circle cx="35" cy="35" r="32" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2" />
            <polygon points="18,18 10,2 28,14" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2" />
            <polygon points="52,18 60,2 42,14" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2" />
            <polygon points="19,16 13,5 25,14" fill="#fbcfe8" />
            <polygon points="51,16 57,5 45,14" fill="#fbcfe8" />
            <ellipse cx="26" cy="32" rx="5" ry="6" fill="#1e1b4b" />
            <ellipse cx="44" cy="32" rx="5" ry="6" fill="#1e1b4b" />
            <circle cx="28" cy="30" r="2" fill="white" />
            <circle cx="46" cy="30" r="2" fill="white" />
            <ellipse cx="35" cy="40" rx="3" ry="2.5" fill="#f9a8d4" />
            <path d="M30 43 Q35 47 40 43" stroke="#d946ef" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <line x1="14" y1="38" x2="26" y2="40" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="14" y1="42" x2="26" y2="42" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="56" y1="38" x2="44" y2="40" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="56" y1="42" x2="44" y2="42" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 text-center min-h-48 flex flex-col items-center justify-center">
          <div
            className="transition-all duration-500"
            key={current}
            style={{ animation: "rise 0.4s ease-out forwards" }}
          >
            <div className="mb-2">
              <span className="font-sans text-xs uppercase tracking-widest text-bday-muted font-bold">Cat Fact</span>
            </div>
            <p className="font-sans text-bday-text text-lg font-semibold leading-relaxed mb-4">
              &ldquo;{item.fact}&rdquo;
            </p>
            <div className="border-t border-bday-pink/20 pt-4">
              <p className="font-serif text-bday-deep-pink text-base italic">
                {item.billi}
              </p>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {catFacts.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Cat fact ${i + 1}`}
              className="rounded-full transition-all"
              style={{
                width: i === current ? 20 : 8,
                height: 8,
                background: i === current ? "#db2777" : "#fbcfe8",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

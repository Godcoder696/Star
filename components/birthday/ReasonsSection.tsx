"use client"

import { useState, useRef, useEffect } from "react"

const reasons = [
  { emoji: "🐾", title: "You're my person", text: "Like a cat finds their one safe human — you're mine. I could be in any room in the world and feel calmer knowing you exist." },
  { emoji: "🌙", title: "You stay up for me", text: "Billi, I don't think you realize how rare it is for someone to actually be there. But you always, always are." },
  { emoji: "😂", title: "You make everything funnier", text: "I could be having the worst day ever and you'd somehow turn it into a bit. The world is genuinely more fun with you in it." },
  { emoji: "🍵", title: "You get the small things", text: "You remember what I said three weeks ago. You check in. You notice. That's not small — that's everything." },
  { emoji: "🐱", title: "You're soft but fierce", text: "Like a cat who's sweet until they're not — you protect the people you love with everything you have. I've seen it." },
  { emoji: "💌", title: "You're genuinely kind", text: "Not performatively kind. Actually, quietly, beautifully kind. I want to be more like you when I grow up." },
  { emoji: "✨", title: "You're effortlessly cool", text: "You don't try to be — that's the thing. You just ARE. It's low-key unfair." },
  { emoji: "🎵", title: "Your taste is impeccable", text: "Every song you've recommended has lived in my head rent-free. You've basically curated my whole personality at this point." },
  { emoji: "🌸", title: "You grow constantly", text: "Watching you become more yourself every year is one of my favourite things. 22 looks so good on you already." },
  { emoji: "💪", title: "You're stronger than you know", text: "You've been through things that would break most people. You bent, but you never broke. That's quietly heroic, Billi." },
  { emoji: "🌟", title: "You light up rooms", text: "Not in a loud way. In that warm, soft way where people just feel better when you're around. That's a superpower." },
  { emoji: "🐟", title: "You're weirdly wise", text: "For someone who sends cat memes at 2am, you give the most grounding advice. Both things are true and I need them both." },
  { emoji: "🫂", title: "You hug like you mean it", text: "Your hugs actually feel like something. Most people just touch your back awkwardly. You actually hold on. It matters." },
  { emoji: "🎨", title: "You see beauty everywhere", text: "In little things. In weird places. You made me see things I'd walked past a hundred times. Thank you for that gift." },
  { emoji: "🌻", title: "You pick me", text: "Every time. Even when I'm difficult. Even when I'm too much. You just keep showing up. I hope you know how sacred that is." },
  { emoji: "🐾", title: "You're my favourite chaos", text: "Life with you in it is messy and hilarious and warm and I would choose it every single time." },
  { emoji: "💛", title: "You make me braver", text: "I've done things I wouldn't have done if you hadn't quietly believed I could. That's not nothing. That's everything." },
  { emoji: "🎀", title: "You deserve the world", text: "I mean this in the literal sense. You deserve the big love, the big life, the big joy. All of it. Starting now." },
  { emoji: "🌈", title: "You colour my world", text: "Like — I could write a whole novel on what having you around has done for me. Consider this the condensed version." },
  { emoji: "🐈", title: "You're one of a kind", text: "There's no one like Billi. Literally. I've searched. The world made one of you and that was the right call." },
  { emoji: "🌙", title: "You believe in magic", text: "In people, in moments, in the possibility that things can be good. That's rare. Please never stop." },
  { emoji: "🎂", title: "22 suits you", text: "Honestly — this year has your name all over it. Something big is coming for you, I can feel it in my cat bones." },
]

export default function ReasonsSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<"left" | "right">("right")
  const [animating, setAnimating] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  function go(dir: "left" | "right") {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setCurrent(c => dir === "right" ? (c + 1) % reasons.length : (c - 1 + reasons.length) % reasons.length)
      setAnimating(false)
    }, 220)
  }

  const card = reasons[current]

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 flex flex-col items-center bg-bday-cream"
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
          22 reasons
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-bday-deep-pink text-balance">
          Why you&apos;re incredible
        </h2>
        <p className="font-sans text-bday-muted mt-2 max-w-sm mx-auto leading-relaxed">
          Billa made a list. Billa could not stop at 22. Billa accepts this about herself.
        </p>
      </div>

      {/* Card */}
      <div
        className="relative w-full max-w-md"
        style={{
          transition: "opacity 0.8s 0.2s",
          opacity: inView ? 1 : 0,
        }}
      >
        {/* Decorative cards behind */}
        <div className="absolute inset-0 bg-bday-lavender rounded-3xl rotate-3 scale-95 opacity-60" />
        <div className="absolute inset-0 bg-bday-peach rounded-3xl -rotate-2 scale-97 opacity-60" />

        <div
          className="relative bg-white rounded-3xl shadow-xl p-10 text-center"
          style={{
            transition: "opacity 0.22s, transform 0.22s",
            opacity: animating ? 0 : 1,
            transform: animating
              ? direction === "right" ? "translateX(-30px)" : "translateX(30px)"
              : "translateX(0)",
          }}
        >
          {/* Counter */}
          <div className="absolute top-4 right-6 font-sans text-xs text-bday-muted font-bold tracking-widest">
            {current + 1} / {reasons.length}
          </div>

          <div className="text-5xl mb-4" role="img" aria-label={card.title}>{card.emoji}</div>
          <h3 className="font-serif text-2xl text-bday-deep-pink mb-3">{card.title}</h3>
          <p className="font-sans text-bday-text leading-relaxed">{card.text}</p>
        </div>
      </div>

      {/* Nav buttons */}
      <div className="flex items-center gap-6 mt-8">
        <button
          onClick={() => go("left")}
          aria-label="Previous reason"
          className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-bday-deep-pink hover:bg-bday-pink hover:text-white transition-colors font-bold text-lg"
        >
          ‹
        </button>

        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {reasons.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? "right" : "left")
                setAnimating(true)
                setTimeout(() => { setCurrent(i); setAnimating(false) }, 220)
              }}
              aria-label={`Go to reason ${i + 1}`}
              className="rounded-full transition-all"
              style={{
                width: i === current ? 20 : 8,
                height: 8,
                background: i === current ? "#db2777" : "#fbcfe8",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go("right")}
          aria-label="Next reason"
          className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-bday-deep-pink hover:bg-bday-pink hover:text-white transition-colors font-bold text-lg"
        >
          ›
        </button>
      </div>

      <p className="font-sans text-xs text-bday-muted mt-4 opacity-60">swipe or tap the arrows</p>
    </section>
  )
}

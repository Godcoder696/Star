"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import Image from "next/image"

type Slide = {
  src: string
  caption: string
  tilt: number
}

// -------------------------------------------------------------------
// Drop your photos into /public/photos/ and update this list.
// Use placeholder tiles until real photos are added.
// -------------------------------------------------------------------
const slides: Slide[] = [
  { src: "/photos/photo1.jpg", caption: "That time you laughed so hard you cried", tilt: -3 },
  { src: "/photos/photo2.jpeg", caption: "Absolute menace. Absolute queen.", tilt: 2 },
  { src: "/photos/photo3.jpeg", caption: "Proof that you have always been this cute", tilt: 4 },
  { src: "/photos/photo5.jpg", caption: "I keep this one just to smile", tilt: -4 },
  { src: "/photos/photo5.jpeg", caption: "Thanks Billi for your existence!", tilt: 1 },
]

function PawPrint({ size = 28, color = "#f9a8d4" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill={color} aria-hidden="true">
      <ellipse cx="32" cy="44" rx="16" ry="13" />
      <ellipse cx="14" cy="26" rx="8" ry="10" />
      <ellipse cx="50" cy="26" rx="8" ry="10" />
      <ellipse cx="22" cy="16" rx="7" ry="8" />
      <ellipse cx="42" cy="16" rx="7" ry="8" />
    </svg>
  )
}

function FilmStrip() {
  return (
    <div className="flex gap-1 mb-3" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="w-5 h-3 rounded-sm bg-bday-deep-pink opacity-30" />
      ))}
    </div>
  )
}

export default function SlideshowSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<"next" | "prev">("next")
  const [animating, setAnimating] = useState(false)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.15 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const goTo = useCallback(
    (index: number, dir: "next" | "prev") => {
      if (animating) return
      setDirection(dir)
      setAnimating(true)
      setTimeout(() => {
        setCurrent(index)
        setAnimating(false)
      }, 320)
    },
    [animating]
  )

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length, "next")
  }, [current, goTo])

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, "prev")
  }, [current, goTo])

  // Auto-advance
  useEffect(() => {
    intervalRef.current = setInterval(goNext, 4500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [goNext])

  const resetAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(goNext, 4500)
  }, [goNext])

  const handleNext = () => { goNext(); resetAutoPlay() }
  const handlePrev = () => { goPrev(); resetAutoPlay() }
  const handleDot = (i: number) => {
    goTo(i, i > current ? "next" : "prev")
    resetAutoPlay()
  }

  const slide = slides[current]

  const slideStyle: React.CSSProperties = {
    transform: animating
      ? `translateX(${direction === "next" ? "-60px" : "60px"}) scale(0.96)`
      : "translateX(0) scale(1)",
    opacity: animating ? 0 : 1,
    transition: "opacity 0.32s ease, transform 0.32s ease",
  }

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 flex flex-col items-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 100%)" }}
    >
      {/* Heading */}
      <div
        className="text-center mb-12"
        style={{
          transition: "opacity 0.8s, transform 0.8s",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(24px)",
        }}
      >
        <p className="font-sans text-bday-deep-pink font-bold tracking-widest uppercase text-xs mb-2 opacity-70">
          our memories
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-bday-deep-pink text-balance">
          A few of my favourite Billis
        </h2>
        <p className="font-sans text-bday-muted text-base mt-3 max-w-sm mx-auto leading-relaxed">
          Every picture is a purrfect reason to smile.
        </p>
      </div>

      {/* Slideshow card */}
      <div
        className="w-full max-w-lg"
        style={{
          transition: "opacity 0.9s 0.2s, transform 0.9s 0.2s",
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(32px)",
        }}
      >
        {/* Polaroid-style frame */}
        <div className="relative flex flex-col items-center">
          {/* Stack shadow cards */}
          <div
            className="absolute w-[calc(100%-16px)] rounded-2xl bg-white shadow-md"
            style={{ height: "calc(100% - 8px)", top: "8px", transform: "rotate(3deg)", zIndex: 0 }}
            aria-hidden="true"
          />
          <div
            className="absolute w-[calc(100%-24px)] rounded-2xl bg-bday-lavender/40 shadow"
            style={{ height: "calc(100% - 16px)", top: "16px", transform: "rotate(-2deg)", zIndex: 0 }}
            aria-hidden="true"
          />

          {/* Main card */}
          <div
            className="relative z-10 w-full bg-white rounded-2xl shadow-xl overflow-hidden"
            style={{ transform: `rotate(${slide.tilt}deg)`, transition: "transform 0.5s ease" }}
          >
            {/* Film strip top */}
            <div className="bg-bday-text/90 px-4 pt-3 pb-1 flex flex-col items-center">
              <FilmStrip />
            </div>

            {/* Photo area */}
            <div className="relative w-full bg-bday-lavender/20" style={{ aspectRatio: "4 / 3" }}>
              {imgErrors[current] ? (
                /* Placeholder tile when image is not yet added */
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-bday-pink/30 to-bday-lavender/40 gap-3">
                  <PawPrint size={56} color="#f472b6" />
                  <p className="font-sans text-bday-deep-pink font-bold text-sm opacity-70">
                    Add photo {current + 1} here
                  </p>
                  <p className="font-sans text-bday-muted text-xs opacity-60">
                    /public/photos/photo{current + 1}.jpg
                  </p>
                </div>
              ) : (
                <Image
                  src={slide.src}
                  alt={`Memory ${current + 1} — ${slide.caption}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 512px"
                  onError={() => setImgErrors((prev) => ({ ...prev, [current]: true }))}
                  style={slideStyle}
                />
              )}

              {/* Overlay gradient */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 50%)" }}
                aria-hidden="true"
              />

              {/* Prev / Next arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white active:scale-95 rounded-full w-9 h-9 flex items-center justify-center shadow-md transition-all"
                aria-label="Previous photo"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#be185d" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M13 4l-6 6 6 6" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white active:scale-95 rounded-full w-9 h-9 flex items-center justify-center shadow-md transition-all"
                aria-label="Next photo"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#be185d" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M7 4l6 6-6 6" />
                </svg>
              </button>
            </div>

            {/* Film strip bottom */}
            <div className="bg-bday-text/90 px-4 pb-3 pt-1 flex flex-col items-center">
              <FilmStrip />
            </div>

            {/* Caption */}
            <div className="px-6 py-5 text-center">
              <p
                className="font-serif text-xl text-bday-deep-pink leading-snug"
                style={slideStyle}
              >
                &ldquo;{slide.caption}&rdquo;
              </p>
              <p className="font-sans text-xs text-bday-muted mt-2 tracking-widest uppercase">
                {current + 1} / {slides.length}
              </p>
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2.5 mt-8" role="tablist" aria-label="Slideshow navigation">
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => handleDot(i)}
              className="rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-bday-deep-pink"
              style={{
                width: i === current ? "28px" : "10px",
                height: "10px",
                background: i === current ? "var(--bday-deep-pink)" : "var(--bday-pink)",
                opacity: i === current ? 1 : 0.5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Hint text */}
      {/* <p className="font-sans text-bday-muted text-sm mt-8 opacity-70 text-center">
        Auto-playing &mdash; or tap the arrows to go at your own pace
      </p> */}
    </section>
  )
}

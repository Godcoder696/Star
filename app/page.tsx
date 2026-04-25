"use client"

import { useEffect, useRef, useState } from "react"
// Keep these if you still want the intro sounds, otherwise you can remove them
import { playSound, preloadMeowSample } from "@/hooks/use-cat-sound" 
import HeroSection from "@/components/birthday/HeroSection"
import CakeSection from "@/components/birthday/CakeSection"
import ReasonsSection from "@/components/birthday/ReasonsSection"
import LetterSection from "@/components/birthday/LetterSection"
import SlideshowSection from "@/components/birthday/SlideshowSection"
import BalloonSection from "@/components/birthday/BalloonSection"
import CatFactsSection from "@/components/birthday/CatFactsSection"
import FooterSection from "@/components/birthday/FooterSection"

function runInitialConfetti() {
  if (typeof window === "undefined") return
  import("canvas-confetti").then((mod) => {
    const confetti = mod.default
    const colors = ["#f9a8d4", "#c084fc", "#fbbf24", "#fb923c", "#34d399"]
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 100, origin: { y: 0.4 }, colors })
    }, 800)
  })
}

export default function BirthdayPage() {
  const [playing, setPlaying] = useState(false)
  // 1. Create a ref to hold the Audio object
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    runInitialConfetti()
    preloadMeowSample()
    
    // 2. Initialize the Audio object (ensure path matches your file in /public)
    audioRef.current = new Audio("/meow_birthday.opus")
    
    // 3. Reset the button state automatically when the song finishes
    const handleEnded = () => setPlaying(false)
    audioRef.current.addEventListener("ended", handleEnded)

    // Intro sounds
    const t1 = setTimeout(() => playSound("brrp", 0.5), 1000)
    const t2 = setTimeout(() => playSound("meow", 0.55), 1600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      // Cleanup: Stop audio and remove listener if component unmounts
      audioRef.current?.pause()
      audioRef.current?.removeEventListener("ended", handleEnded)
    }
  }, [])

  function handleSongToggle() {
    if (!audioRef.current) return

    if (playing) {
      // 4. Stop Logic
      audioRef.current.pause()
      audioRef.current.currentTime = 0 // Reset to beginning
      setPlaying(false)
    } else {
      // 5. Play Logic
      audioRef.current.play().catch(err => console.error("Playback failed:", err))
      setPlaying(true)
    }
  }

  return (
    <main className="min-h-screen bg-bday-bg overflow-x-hidden">
      <HeroSection />
      <CakeSection />
      <ReasonsSection />
      <LetterSection />
      <SlideshowSection />
      <BalloonSection />
      <CatFactsSection />
      <FooterSection />

      {/* Floating birthday song player */}
      <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
        <div
          className="bg-bday-cream border-2 border-bday-pink rounded-2xl px-4 py-2 shadow-lg text-center"
          style={{
            transition: "opacity 0.3s, transform 0.3s",
            opacity: playing ? 1 : 0,
            transform: playing ? "translateY(0)" : "translateY(6px)",
            pointerEvents: "none",
          }}
        >
          <p className="font-serif text-bday-deep-pink text-sm leading-snug whitespace-nowrap">
            Meow meow meow...
          </p>
          <p className="font-sans text-bday-muted text-xs mt-0.5">
            singing in cat language
          </p>
        </div>

        <button
          onClick={handleSongToggle}
          aria-label={playing ? "Stop birthday song" : "Play Happy Birthday in cat meow language"}
          className={`
            relative w-20 h-20 rounded-full shadow-2xl border-4
            flex flex-col items-center justify-center gap-0.5
            transition-all duration-200 active:scale-90 select-none
            ${playing
              ? "bg-bday-deep-pink border-bday-pink text-white pulse-soft-anim"
              : "bg-bday-pink border-bday-cream text-white hover:scale-110"
            }
          `}
        >
          <svg width="34" height="34" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle cx="32" cy="36" r="22" fill="white" opacity="0.25" />
            <circle cx="32" cy="34" r="20" fill="white" opacity="0.15" />
            <polygon points="18,18 10,2 28,16" fill="white" opacity="0.9" />
            <polygon points="46,18 54,2 36,16" fill="white" opacity="0.9" />
            <circle cx="32" cy="34" r="18" fill="white" opacity="0.90" />
            {playing ? (
              <>
                <path d="M22 30 Q25 26 28 30" stroke="#be185d" strokeWidth="2.2" fill="none" strokeLinecap="round" />
                <path d="M36 30 Q39 26 42 30" stroke="#be185d" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                <ellipse cx="25" cy="30" rx="4" ry="4.5" fill="#1e1b4b" />
                <ellipse cx="39" cy="30" rx="4" ry="4.5" fill="#1e1b4b" />
                <circle cx="26.5" cy="28.5" r="1.5" fill="white" />
                <circle cx="40.5" cy="28.5" r="1.5" fill="white" />
              </>
            )}
            <ellipse cx="32" cy="37" rx="2.5" ry="2" fill="#f9a8d4" />
            {playing ? (
              <ellipse cx="32" cy="43" rx="4" ry="5" fill="#be185d" opacity="0.8" />
            ) : (
              <path d="M27 41 Q32 46 37 41" stroke="#db2777" strokeWidth="2" fill="none" strokeLinecap="round" />
            )}
            <line x1="8" y1="36" x2="22" y2="37" stroke="#be185d" strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
            <line x1="8" y1="40" x2="22" y2="39" stroke="#be185d" strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
            <line x1="56" y1="36" x2="42" y2="37" stroke="#be185d" strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
            <line x1="56" y1="40" x2="42" y2="39" stroke="#be185d" strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
          </svg>
          <span className="font-sans font-bold text-white text-xs leading-none">
            {playing ? "Stop" : "Sing!"}
          </span>
        </button>
      </div>
    </main>
  )
}
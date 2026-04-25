"use client"

/**
 * useCatSound — synthesises cat noises via the Web Audio API.
 * No audio files needed. Works in any modern browser.
 */

type SoundType = "meow" | "purr" | "chirp" | "trill" | "hiss" | "brrp"

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  return new Ctx()
}

/** Short meow — classic, warm */
function playMeow(volume = 0.7) {
  const ctx = getCtx()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  filter.type = "bandpass"
  filter.frequency.value = 900
  filter.Q.value = 3

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc.type = "sawtooth"
  const now = ctx.currentTime
  // Pitch envelope: rises then falls — that's the "meow" shape
  osc.frequency.setValueAtTime(400, now)
  osc.frequency.linearRampToValueAtTime(900, now + 0.12)
  osc.frequency.exponentialRampToValueAtTime(350, now + 0.45)

  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(volume, now + 0.05)
  gain.gain.setValueAtTime(volume, now + 0.3)
  gain.gain.linearRampToValueAtTime(0, now + 0.5)

  osc.start(now)
  osc.stop(now + 0.55)
}

/** High-pitched excited meow */
function playChirp(volume = 0.6) {
  const ctx = getCtx()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = "bandpass"
  filter.frequency.value = 1400
  filter.Q.value = 5

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc.type = "sawtooth"
  const now = ctx.currentTime
  osc.frequency.setValueAtTime(1200, now)
  osc.frequency.linearRampToValueAtTime(1800, now + 0.06)
  osc.frequency.exponentialRampToValueAtTime(900, now + 0.18)

  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(volume, now + 0.02)
  gain.gain.linearRampToValueAtTime(0, now + 0.2)

  osc.start(now)
  osc.stop(now + 0.22)
}

/** Happy trill — two quick chirps */
function playTrill(volume = 0.55) {
  playChirp(volume)
  setTimeout(() => playChirp(volume * 0.85), 140)
}

/** Low rumbling purr (loopable) — returns a stop function */
function playPurr(volume = 0.25): () => void {
  const ctx = getCtx()
  if (!ctx) return () => {}

  const osc = ctx.createOscillator()
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  filter.type = "lowpass"
  filter.frequency.value = 300

  lfo.frequency.value = 25        // 25 Hz = purr rate
  lfoGain.gain.value = 80

  lfo.connect(lfoGain)
  lfoGain.connect(osc.frequency)
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc.type = "sawtooth"
  osc.frequency.value = 120

  const now = ctx.currentTime
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(volume, now + 0.4)

  lfo.start(now)
  osc.start(now)

  return () => {
    const t = ctx.currentTime
    gain.gain.setValueAtTime(gain.gain.value, t)
    gain.gain.linearRampToValueAtTime(0, t + 0.4)
    osc.stop(t + 0.45)
    lfo.stop(t + 0.45)
  }
}

/** Sharp hiss pop — for balloon popping */
function playHiss(volume = 0.5) {
  const ctx = getCtx()
  if (!ctx) return

  // White noise burst
  const bufferSize = ctx.sampleRate * 0.12
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = "bandpass"
  filter.frequency.value = 3000
  filter.Q.value = 0.8

  const gain = ctx.createGain()
  noise.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  const now = ctx.currentTime
  gain.gain.setValueAtTime(volume, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

  noise.start(now)
  noise.stop(now + 0.14)

  // Follow with a surprised meow
  setTimeout(() => playMeow(volume * 0.7), 80)
}

/** Brrrp / chirrup — happy cat greeting */
function playBrrp(volume = 0.5) {
  const ctx = getCtx()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = "bandpass"
  filter.frequency.value = 700
  filter.Q.value = 4

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  osc.type = "sawtooth"
  const now = ctx.currentTime
  // Quick rising trill
  osc.frequency.setValueAtTime(300, now)
  osc.frequency.linearRampToValueAtTime(750, now + 0.08)
  osc.frequency.setValueAtTime(500, now + 0.09)
  osc.frequency.linearRampToValueAtTime(900, now + 0.17)
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.28)

  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(volume, now + 0.02)
  gain.gain.setValueAtTime(volume, now + 0.22)
  gain.gain.linearRampToValueAtTime(0, now + 0.3)

  osc.start(now)
  osc.stop(now + 0.32)
}

export function playSound(type: SoundType, volume?: number) {
  switch (type) {
    case "meow":   return playMeow(volume)
    case "chirp":  return playChirp(volume)
    case "trill":  return playTrill(volume)
    case "purr":   return playPurr(volume)
    case "hiss":   return playHiss(volume)
    case "brrp":   return playBrrp(volume)
  }
}

export function startPurr(volume?: number): () => void {
  return playPurr(volume) as () => void
}

// ---------------------------------------------------------------------------
// Birthday song — sample-based approach
// ---------------------------------------------------------------------------
// We fetch a real CC0 cat meow WAV (BigSoundBank, public domain).
// The sample is decoded once into an AudioBuffer and cached.
// Each melody note replays that buffer at the correct playbackRate so
// the real cat vowel timbre is preserved at every pitch.
// The base note of the sample is ~A3 (220 Hz); we compute rate = freq / 220.
// ---------------------------------------------------------------------------

const MEOW_SAMPLE_URL = "https://bigsoundbank.com/UPLOAD/mp3/1890.mp3"

let _sampleBuffer: AudioBuffer | null = null
let _sampleLoading = false
let _sampleCallbacks: Array<(buf: AudioBuffer | null) => void> = []

function loadMeowSample(callback: (buf: AudioBuffer | null) => void) {
  if (_sampleBuffer) { callback(_sampleBuffer); return }
  _sampleCallbacks.push(callback)
  if (_sampleLoading) return
  _sampleLoading = true

  fetch(MEOW_SAMPLE_URL)
    .then(r => r.arrayBuffer())
    .then(arrayBuf => {
      const ctx = getCtx()
      if (!ctx) { _sampleCallbacks.forEach(cb => cb(null)); _sampleCallbacks = []; return }
      return ctx.decodeAudioData(arrayBuf)
    })
    .then(decoded => {
      if (!decoded) return
      _sampleBuffer = decoded
      _sampleCallbacks.forEach(cb => cb(decoded))
      _sampleCallbacks = []
    })
    .catch(() => {
      _sampleCallbacks.forEach(cb => cb(null))
      _sampleCallbacks = []
    })
}

/** Pre-fetch the sample so playback is instant when the song button is pressed */
export function preloadMeowSample() {
  loadMeowSample(() => {})
}

/**
 * Plays "Happy Birthday To You" using a real recorded cat meow sample.
 * Each note pitch-shifts the sample via AudioBufferSourceNode.playbackRate
 * so you hear a genuine cat meow sound at every musical note.
 * Base pitch of the sample is estimated at A3 (220 Hz).
 * Returns a cancel/stop function.
 */
export function playBirthdaySong(volume = 0.9): () => void {
  const BASE_FREQ = 220 // estimated fundamental of the meow sample (A3)

  // [freq Hz, startSec offset into sample, playDuration sec, gap sec]
  // startSec lets us re-enter the sample mid-way for shorter notes so each
  // note still has the full "meow" vowel character rather than just a tail.
  const notes: [number, number, number, number][] = [
    // "Hap-py birth-day to you"
    [392, 0.05, 0.42, 0.09],
    [392, 0.05, 0.25, 0.07],
    [440, 0.05, 0.58, 0.09],
    [392, 0.05, 0.58, 0.09],
    [523, 0.05, 0.58, 0.09],
    [494, 0.05, 0.90, 0.20],
    // "Hap-py birth-day to you"
    [392, 0.05, 0.42, 0.09],
    [392, 0.05, 0.25, 0.07],
    [440, 0.05, 0.58, 0.09],
    [392, 0.05, 0.58, 0.09],
    [587, 0.05, 0.58, 0.09],
    [523, 0.05, 0.90, 0.20],
    // "Hap-py birth-day dear Bil-li"
    [392, 0.05, 0.42, 0.09],
    [392, 0.05, 0.25, 0.07],
    [784, 0.05, 0.58, 0.09],
    [659, 0.05, 0.58, 0.09],
    [523, 0.05, 0.58, 0.09],
    [494, 0.05, 0.40, 0.07],
    [440, 0.05, 0.80, 0.16],
    // "Hap-py birth-day to you"
    [698, 0.05, 0.42, 0.09],
    [698, 0.05, 0.25, 0.07],
    [659, 0.05, 0.58, 0.09],
    [523, 0.05, 0.58, 0.09],
    [587, 0.05, 0.58, 0.09],
    [523, 0.05, 1.20, 0.00],
  ]

  const timeouts: ReturnType<typeof setTimeout>[] = []
  let cancelled = false
  const activeSources: AudioBufferSourceNode[] = []

  function scheduleAll(buffer: AudioBuffer) {
    if (cancelled) return
    const ctx = getCtx()
    if (!ctx) return

    let cursor = 0

    notes.forEach(([freq, sampleOffset, dur, gap]) => {
      const t = setTimeout(() => {
        if (cancelled) return
        const audioCtx = getCtx()
        if (!audioCtx) return

        const rate = freq / BASE_FREQ
        const now = audioCtx.currentTime

        // Gain node for amplitude envelope (fade in + fade out tail)
        const gainNode = audioCtx.createGain()
        gainNode.gain.setValueAtTime(0, now)
        gainNode.gain.linearRampToValueAtTime(volume, now + 0.03)
        gainNode.gain.setValueAtTime(volume, now + dur * 0.75)
        gainNode.gain.linearRampToValueAtTime(0, now + dur)
        gainNode.connect(audioCtx.destination)

        const src = audioCtx.createBufferSource()
        src.buffer = buffer
        src.playbackRate.value = rate
        src.connect(gainNode)
        src.start(now, sampleOffset, dur / rate + 0.08)
        activeSources.push(src)
      }, Math.round(cursor * 1000))

      timeouts.push(t)
      cursor += dur + gap
    })
  }

  // Load sample then schedule — if already cached this is synchronous
  loadMeowSample((buffer) => {
    if (cancelled || !buffer) return
    scheduleAll(buffer)
  })

  return () => {
    cancelled = true
    timeouts.forEach(clearTimeout)
    activeSources.forEach(src => { try { src.stop() } catch { /* already stopped */ } })
  }
}

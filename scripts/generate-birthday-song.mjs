/**
 * Generates a WAV file of "Happy Birthday" sung in cat meow language.
 *
 * Each syllable is a synthesised cat meow using:
 *  - A sawtooth oscillator at the musical pitch
 *  - Two resonant formant filters (F1 + F2) that sweep to create "mee-oww"
 *  - A vibrato LFO
 *  - An "m" consonant noise burst at the start of each meow
 *
 * Output: public/birthday-song.wav
 */

import { writeFileSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const SAMPLE_RATE = 44100
const NUM_CHANNELS = 1

// ---------------------------------------------------------------------------
// Happy Birthday melody: [noteFreqHz, durationSec, gapSec]
// ---------------------------------------------------------------------------
const NOTES = [
  // "Happy birthday to you"
  [392, 0.42, 0.09],
  [392, 0.22, 0.07],
  [440, 0.58, 0.09],
  [392, 0.58, 0.09],
  [523, 0.58, 0.09],
  [494, 0.92, 0.20],
  // "Happy birthday to you"
  [392, 0.42, 0.09],
  [392, 0.22, 0.07],
  [440, 0.58, 0.09],
  [392, 0.58, 0.09],
  [587, 0.58, 0.09],
  [523, 0.92, 0.20],
  // "Happy birthday dear Billi"
  [392, 0.42, 0.09],
  [392, 0.22, 0.07],
  [784, 0.58, 0.09],
  [659, 0.58, 0.09],
  [523, 0.58, 0.09],
  [494, 0.40, 0.07],
  [440, 0.80, 0.16],
  // "Happy birthday to you"
  [698, 0.42, 0.09],
  [698, 0.22, 0.07],
  [659, 0.58, 0.09],
  [523, 0.58, 0.09],
  [587, 0.58, 0.09],
  [523, 1.20, 0.00],
]

// ---------------------------------------------------------------------------
// Core synthesis helpers (all operate on Float32 sample buffers)
// ---------------------------------------------------------------------------

/** Generate a single "meow" syllable at a given fundamental frequency */
function generateMeow(freq, durationSec, volume = 0.72) {
  const N = Math.ceil(durationSec * SAMPLE_RATE)
  const buf = new Float32Array(N)

  const vibratoRate = 5.8      // Hz
  const vibratoDepth = freq * 0.03 // 3% pitch depth

  // Formant sweep points (in seconds within the note)
  // "m" closure: F1=280, F2=900
  // "ee" vowel:  F1=280, F2=2300
  // "ow" vowel:  F1=730, F2=1090
  // tail-off:    F1=400, F2=800

  for (let i = 0; i < N; i++) {
    const t = i / SAMPLE_RATE
    const tNorm = t / durationSec // 0..1

    // ---- Pitch with vibrato ----
    const vibrato = Math.sin(2 * Math.PI * vibratoRate * t) * vibratoDepth
    const instFreq = freq + vibrato

    // ---- Sawtooth oscillator (harmonics = 1/n) ----
    let saw = 0
    const harmonics = Math.min(20, Math.floor(SAMPLE_RATE / (2 * instFreq)))
    for (let h = 1; h <= harmonics; h++) {
      saw += (1 / h) * Math.sin(2 * Math.PI * instFreq * h * t)
    }
    saw = saw * (2 / Math.PI) // approximate band-limited sawtooth normalisation

    // ---- Formant filter — simulate as additive resonances ----
    // F1 sweep: closed(280) → ee(280) → ow(730) → tail(400)
    let f1, f2
    if (tNorm < 0.12) {
      // "m" consonant
      const p = tNorm / 0.12
      f1 = 280
      f2 = lerp(700, 1200, p)
    } else if (tNorm < 0.32) {
      // "ee"
      const p = (tNorm - 0.12) / 0.20
      f1 = lerp(280, 320, p)
      f2 = lerp(1200, 2100, p)
    } else if (tNorm < 0.62) {
      // ee→ow transition — the audible vowel shift
      const p = (tNorm - 0.32) / 0.30
      f1 = lerp(320, 730, p)
      f2 = lerp(2100, 1090, p)
    } else {
      // tail-off "w"
      const p = (tNorm - 0.62) / 0.38
      f1 = lerp(730, 380, p)
      f2 = lerp(1090, 800, p)
    }

    // Resonant boost: add peaks at F1 and F2 frequencies
    const bw1 = f1 * 0.18
    const bw2 = f2 * 0.14
    const resonance1 = resonantBoost(saw, t, f1, bw1)
    const resonance2 = resonantBoost(saw, t, f2, bw2)
    let sample = saw * 0.4 + resonance1 * 0.38 + resonance2 * 0.22

    // ---- "m" consonant burst (low-amplitude buzz at start) ----
    if (tNorm < 0.08) {
      const mRamp = tNorm / 0.08
      const mNoise = (Math.random() - 0.5) * 0.08
      sample = sample * mRamp + mNoise * (1 - mRamp)
    }

    // ---- Amplitude envelope ----
    let env
    if (tNorm < 0.05) {
      env = tNorm / 0.05         // attack
    } else if (tNorm < 0.75) {
      env = 1.0                  // sustain
    } else {
      env = 1 - (tNorm - 0.75) / 0.25  // release
    }
    env = Math.max(0, env)

    buf[i] = sample * env * volume
  }

  return buf
}

/** Simple resonant bandpass approximation via additive sine at resonant freq */
function resonantBoost(source, t, freq, bw) {
  // Compute approximate bandpass output by multiplying source with resonant sine
  return source * Math.sin(2 * Math.PI * freq * t) * (1 / (1 + bw / freq))
}

function lerp(a, b, t) {
  return a + (b - a) * Math.clamp(t, 0, 1)
}

// Polyfill Math.clamp
Math.clamp = (v, min, max) => Math.min(Math.max(v, min), max)

/** Generate silence of given duration */
function generateSilence(durationSec) {
  return new Float32Array(Math.ceil(durationSec * SAMPLE_RATE))
}

// ---------------------------------------------------------------------------
// Build the full song
// ---------------------------------------------------------------------------
const parts = []
for (const [freq, dur, gap] of NOTES) {
  parts.push(generateMeow(freq, dur, 0.72))
  if (gap > 0) parts.push(generateSilence(gap))
}

// Concatenate
const totalSamples = parts.reduce((s, b) => s + b.length, 0)
const songBuf = new Float32Array(totalSamples)
let offset = 0
for (const part of parts) {
  songBuf.set(part, offset)
  offset += part.length
}

// Normalize to prevent clipping
let peak = 0
for (let i = 0; i < songBuf.length; i++) {
  if (Math.abs(songBuf[i]) > peak) peak = Math.abs(songBuf[i])
}
if (peak > 0.9) {
  const scale = 0.9 / peak
  for (let i = 0; i < songBuf.length; i++) songBuf[i] *= scale
}

// ---------------------------------------------------------------------------
// Write WAV file
// ---------------------------------------------------------------------------
function writeWav(samples, sampleRate, filePath) {
  const numSamples = samples.length
  const bitsPerSample = 16
  const byteRate = sampleRate * NUM_CHANNELS * (bitsPerSample / 8)
  const blockAlign = NUM_CHANNELS * (bitsPerSample / 8)
  const dataSize = numSamples * blockAlign
  const headerSize = 44
  const buf = Buffer.alloc(headerSize + dataSize)

  // RIFF header
  buf.write("RIFF", 0)
  buf.writeUInt32LE(36 + dataSize, 4)
  buf.write("WAVE", 8)
  buf.write("fmt ", 12)
  buf.writeUInt32LE(16, 16)          // PCM
  buf.writeUInt16LE(1, 20)           // AudioFormat = PCM
  buf.writeUInt16LE(NUM_CHANNELS, 22)
  buf.writeUInt32LE(sampleRate, 24)
  buf.writeUInt32LE(byteRate, 28)
  buf.writeUInt16LE(blockAlign, 32)
  buf.writeUInt16LE(bitsPerSample, 34)
  buf.write("data", 36)
  buf.writeUInt32LE(dataSize, 40)

  // PCM samples (16-bit signed little-endian)
  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]))
    const int16 = Math.round(clamped * 32767)
    buf.writeInt16LE(int16, headerSize + i * blockAlign)
  }

  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, buf)
  console.log(`[v0] Written ${filePath} — ${(buf.length / 1024).toFixed(1)} KB, ${(numSamples / sampleRate).toFixed(1)}s`)
}

const outPath = join(__dirname, "..", "public", "birthday-song.wav")
writeWav(songBuf, SAMPLE_RATE, outPath)

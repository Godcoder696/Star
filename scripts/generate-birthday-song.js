/**
 * Generates a WAV file of "Happy Birthday" sung in cat meow language.
 * Run with: node scripts/generate-birthday-song.js
 */

const { writeFileSync, mkdirSync } = require("fs")
const { join } = require("path")

const SAMPLE_RATE = 44100
const NUM_CHANNELS = 1

// Happy Birthday melody: [noteFreqHz, durationSec, gapSec]
const NOTES = [
  [392, 0.42, 0.09], [392, 0.22, 0.07], [440, 0.58, 0.09],
  [392, 0.58, 0.09], [523, 0.58, 0.09], [494, 0.92, 0.20],
  [392, 0.42, 0.09], [392, 0.22, 0.07], [440, 0.58, 0.09],
  [392, 0.58, 0.09], [587, 0.58, 0.09], [523, 0.92, 0.20],
  [392, 0.42, 0.09], [392, 0.22, 0.07], [784, 0.58, 0.09],
  [659, 0.58, 0.09], [523, 0.58, 0.09], [494, 0.40, 0.07],
  [440, 0.80, 0.16],
  [698, 0.42, 0.09], [698, 0.22, 0.07], [659, 0.58, 0.09],
  [523, 0.58, 0.09], [587, 0.58, 0.09], [523, 1.20, 0.00],
]

function clamp(v, min, max) { return Math.min(Math.max(v, min), max) }
function lerp(a, b, t) { return a + (b - a) * clamp(t, 0, 1) }

function generateMeow(freq, durationSec, volume) {
  volume = volume || 0.72
  const N = Math.ceil(durationSec * SAMPLE_RATE)
  const buf = new Float32Array(N)
  const vibratoRate = 5.8
  const vibratoDepth = freq * 0.03

  // Phase accumulators for additive sawtooth
  const maxHarmonics = Math.min(18, Math.floor(SAMPLE_RATE / (2 * freq)))
  const phases = new Float32Array(maxHarmonics)

  for (let i = 0; i < N; i++) {
    const t = i / SAMPLE_RATE
    const tNorm = t / durationSec

    // Vibrato
    const vibrato = Math.sin(2 * Math.PI * vibratoRate * t) * vibratoDepth
    const instFreq = freq + vibrato

    // Band-limited sawtooth via additive synthesis
    let saw = 0
    for (let h = 1; h <= maxHarmonics; h++) {
      phases[h - 1] = (phases[h - 1] || 0) + (2 * Math.PI * instFreq * h) / SAMPLE_RATE
      saw += (1.0 / h) * Math.sin(phases[h - 1])
    }
    saw *= (2 / Math.PI)

    // Formant sweep: m(closed) → ee → ow → tail
    let f1, f2
    if (tNorm < 0.10) {
      const p = tNorm / 0.10
      f1 = 270; f2 = lerp(600, 1100, p)
    } else if (tNorm < 0.32) {
      const p = (tNorm - 0.10) / 0.22
      f1 = lerp(270, 310, p); f2 = lerp(1100, 2200, p)
    } else if (tNorm < 0.64) {
      // The "ow" sweep — the most audible meow part
      const p = (tNorm - 0.32) / 0.32
      f1 = lerp(310, 750, p); f2 = lerp(2200, 1050, p)
    } else {
      const p = (tNorm - 0.64) / 0.36
      f1 = lerp(750, 370, p); f2 = lerp(1050, 780, p)
    }

    // Resonant peaks at F1 and F2 (approximate bandpass as sine modulation)
    const res1 = saw * Math.sin(2 * Math.PI * f1 * t) * 0.55
    const res2 = saw * Math.sin(2 * Math.PI * f2 * t) * 0.35
    let sample = saw * 0.35 + res1 + res2

    // "m" consonant noise burst at onset
    if (tNorm < 0.07) {
      const mEnv = tNorm / 0.07
      sample = sample * mEnv + (Math.random() - 0.5) * 0.06 * (1 - mEnv)
    }

    // Amplitude envelope
    let env
    if (tNorm < 0.04) env = tNorm / 0.04
    else if (tNorm < 0.78) env = 1.0
    else env = 1 - (tNorm - 0.78) / 0.22
    env = clamp(env, 0, 1)

    buf[i] = sample * env * volume
  }
  return buf
}

function generateSilence(durationSec) {
  return new Float32Array(Math.ceil(durationSec * SAMPLE_RATE))
}

// Build song
const parts = []
for (const [freq, dur, gap] of NOTES) {
  parts.push(generateMeow(freq, dur, 0.72))
  if (gap > 0) parts.push(generateSilence(gap))
}

const totalSamples = parts.reduce((s, b) => s + b.length, 0)
const songBuf = new Float32Array(totalSamples)
let offset = 0
for (const part of parts) { songBuf.set(part, offset); offset += part.length }

// Normalize
let peak = 0
for (let i = 0; i < songBuf.length; i++) if (Math.abs(songBuf[i]) > peak) peak = Math.abs(songBuf[i])
if (peak > 0.88) { const s = 0.88 / peak; for (let i = 0; i < songBuf.length; i++) songBuf[i] *= s }

// Write WAV
function writeWav(samples, sampleRate, filePath) {
  const bitsPerSample = 16
  const dataSize = samples.length * NUM_CHANNELS * (bitsPerSample / 8)
  const buf = Buffer.alloc(44 + dataSize)
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + dataSize, 4); buf.write("WAVE", 8)
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20)
  buf.writeUInt16LE(NUM_CHANNELS, 22); buf.writeUInt32LE(sampleRate, 24)
  buf.writeUInt32LE(sampleRate * NUM_CHANNELS * bitsPerSample / 8, 28)
  buf.writeUInt16LE(NUM_CHANNELS * bitsPerSample / 8, 32); buf.writeUInt16LE(bitsPerSample, 34)
  buf.write("data", 36); buf.writeUInt32LE(dataSize, 40)
  for (let i = 0; i < samples.length; i++) {
    buf.writeInt16LE(Math.round(clamp(samples[i], -1, 1) * 32767), 44 + i * 2)
  }
  mkdirSync(require("path").dirname(filePath), { recursive: true })
  writeFileSync(filePath, buf)
  console.log("[v0] Written: " + filePath + " — " + (buf.length / 1024).toFixed(1) + " KB, " + (samples.length / sampleRate).toFixed(1) + "s")
}

writeWav(songBuf, SAMPLE_RATE, join(__dirname, "..", "public", "birthday-song.wav"))

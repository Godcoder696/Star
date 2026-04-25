"""
Generates public/birthday-song.wav — "Happy Birthday" sung in cat meow language.

Each note = a synthesised meow at the correct musical pitch.
Technique:
  - Band-limited sawtooth oscillator (fundamental + harmonics) at note frequency
  - Vibrato LFO (5.8 Hz, 3% depth) for that cat-voice warble
  - Two sweeping formant resonances (F1 + F2) that travel the vowel path:
      "mm" (nasal, mouth closed) → "ee" (high F2) → "oww" (rising F1, falling F2) → tail
    This formant sweep is what makes speech sound like speech — without it,
    you just hear pitched buzzing.
  - "m" onset: short noise burst fading into the tone to give the consonant
  - Amplitude envelope: fast attack, long sustain, soft release
"""

import struct, math, os, wave, array

SAMPLE_RATE = 44100

# Happy Birthday: (freq_hz, duration_sec, gap_sec)
NOTES = [
    # "Happy birthday to you"
    (392, 0.44, 0.09), (392, 0.23, 0.07), (440, 0.60, 0.09),
    (392, 0.60, 0.09), (523, 0.60, 0.09), (494, 0.95, 0.20),
    # "Happy birthday to you"
    (392, 0.44, 0.09), (392, 0.23, 0.07), (440, 0.60, 0.09),
    (392, 0.60, 0.09), (587, 0.60, 0.09), (523, 0.95, 0.20),
    # "Happy birthday dear Billi"
    (392, 0.44, 0.09), (392, 0.23, 0.07), (784, 0.60, 0.09),
    (659, 0.60, 0.09), (523, 0.60, 0.09), (494, 0.42, 0.07),
    (440, 0.82, 0.16),
    # "Happy birthday to you"
    (698, 0.44, 0.09), (698, 0.23, 0.07), (659, 0.60, 0.09),
    (523, 0.60, 0.09), (587, 0.60, 0.09), (523, 1.25, 0.00),
]


def clamp(v, lo, hi):
    return max(lo, min(hi, v))

def lerp(a, b, t):
    return a + (b - a) * clamp(t, 0.0, 1.0)


def generate_meow(freq: float, duration: float, volume: float = 0.72) -> list[float]:
    N = int(duration * SAMPLE_RATE)
    buf = [0.0] * N

    vibrato_rate = 5.8
    vibrato_depth = freq * 0.030  # 3% pitch deviation

    max_harmonics = min(20, int(SAMPLE_RATE / (2.0 * freq)))

    import random
    rng = random.Random(int(freq * 1000))  # deterministic per pitch

    for i in range(N):
        t = i / SAMPLE_RATE
        t_norm = t / duration  # 0..1

        # --- Vibrato ---
        vibrato = math.sin(2 * math.pi * vibrato_rate * t) * vibrato_depth
        inst_freq = freq + vibrato

        # --- Band-limited sawtooth (additive harmonics) ---
        saw = 0.0
        for h in range(1, max_harmonics + 1):
            saw += (1.0 / h) * math.sin(2 * math.pi * inst_freq * h * t)
        saw *= (2.0 / math.pi)  # normalise amplitude

        # --- Formant sweep ---
        # Phonetic path: "m" (nasal) → "ee" (high F2, low F1) → "ow" (F1 rises, F2 falls) → tail
        if t_norm < 0.10:
            p = t_norm / 0.10
            f1 = 270.0
            f2 = lerp(550.0, 1050.0, p)
        elif t_norm < 0.32:
            p = (t_norm - 0.10) / 0.22
            f1 = lerp(270.0, 305.0, p)
            f2 = lerp(1050.0, 2250.0, p)      # ee vowel: high F2
        elif t_norm < 0.65:
            p = (t_norm - 0.32) / 0.33
            f1 = lerp(305.0, 760.0, p)        # ow: F1 rises (mouth opens)
            f2 = lerp(2250.0, 1020.0, p)      # ow: F2 falls
        else:
            p = (t_norm - 0.65) / 0.35
            f1 = lerp(760.0, 360.0, p)
            f2 = lerp(1020.0, 770.0, p)

        # Resonant bandpass approximation via sinusoidal amplitude modulation
        # (equivalent to multiplying by a carrier at the formant frequency —
        # this creates sidebands around f_formant that boost harmonics near it)
        q1 = 0.18  # bandwidth/freq ratio for F1
        q2 = 0.13  # narrower for F2 (higher formants are sharper in real voices)

        res1 = saw * math.sin(2 * math.pi * f1 * t) * (1.0 / (1.0 + q1))
        res2 = saw * math.sin(2 * math.pi * f2 * t) * (1.0 / (1.0 + q2))

        sample = saw * 0.28 + res1 * 0.44 + res2 * 0.28

        # --- "m" consonant onset noise burst ---
        if t_norm < 0.08:
            m_env = t_norm / 0.08
            noise = (rng.random() - 0.5) * 0.07
            sample = sample * m_env + noise * (1.0 - m_env)

        # --- Amplitude envelope ---
        if t_norm < 0.04:
            env = t_norm / 0.04
        elif t_norm < 0.76:
            env = 1.0
        else:
            env = 1.0 - (t_norm - 0.76) / 0.24
        env = clamp(env, 0.0, 1.0)

        buf[i] = sample * env * volume

    return buf


def generate_silence(duration: float) -> list[float]:
    return [0.0] * int(duration * SAMPLE_RATE)


# Build full song
parts: list[list[float]] = []
for freq, dur, gap in NOTES:
    parts.append(generate_meow(freq, dur, 0.72))
    if gap > 0:
        parts.append(generate_silence(gap))

song = []
for p in parts:
    song.extend(p)

# Normalize to prevent clipping
peak = max(abs(s) for s in song)
if peak > 0.88:
    scale = 0.88 / peak
    song = [s * scale for s in song]

# Write WAV
out_path = os.path.join(os.path.dirname(__file__), "..", "public", "birthday-song.wav")
os.makedirs(os.path.dirname(out_path), exist_ok=True)

with wave.open(out_path, "w") as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)   # 16-bit
    wf.setframerate(SAMPLE_RATE)
    samples_int = array.array("h", (int(clamp(s, -1.0, 1.0) * 32767) for s in song))
    wf.writeframes(samples_int.tobytes())

duration_s = len(song) / SAMPLE_RATE
size_kb = os.path.getsize(out_path) / 1024
print(f"[v0] Written {out_path}")
print(f"[v0] Duration: {duration_s:.1f}s  |  Size: {size_kb:.0f} KB")

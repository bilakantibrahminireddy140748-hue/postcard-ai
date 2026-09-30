// Audio Synth Utility for PostCraft AI (Web Audio API)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioCtxClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play sticker placement drop pop sound
export function playStickerPopSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Audio Context blocked or unavailable
  }
}

// Synthesize background beat/melody stream for Canvas Video Recording
export function createSynthAudioTrack(
  durationSeconds: number,
  bpm: number = 100,
  mood: string = 'chill'
): { destination: MediaStreamAudioDestinationNode; stop: () => void } {
  const ctx = getAudioContext();
  const dest = ctx.createMediaStreamDestination();

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.25, ctx.currentTime);
  masterGain.connect(dest);

  const beatInterval = 60 / Math.max(60, Math.min(180, bpm));
  let step = 0;

  const notes =
    mood.toLowerCase().includes('corporate') || mood.toLowerCase().includes('pro')
      ? [261.63, 329.63, 392.0, 523.25] // C E G C
      : mood.toLowerCase().includes('dreamy') || mood.toLowerCase().includes('travel')
      ? [220.0, 261.63, 329.63, 440.0] // A C E A
      : mood.toLowerCase().includes('upbeat') || mood.toLowerCase().includes('food')
      ? [293.66, 369.99, 440.0, 587.33] // D F# A D
      : [261.63, 293.66, 329.63, 392.0]; // C D E G

  const intervalId = setInterval(() => {
    if (ctx.state === 'suspended') ctx.resume();

    // Synth Melody Note
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = step % 4 === 0 ? 'triangle' : 'sine';
    const freq = notes[step % notes.length];
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    noteGain.gain.setValueAtTime(0.15, ctx.currentTime);
    noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + beatInterval * 0.8);

    osc.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start();
    osc.stop(ctx.currentTime + beatInterval);

    // Kick/Bass hit every 2 steps
    if (step % 2 === 0) {
      const kickOsc = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kickOsc.frequency.setValueAtTime(120, ctx.currentTime);
      kickOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.12);

      kickGain.gain.setValueAtTime(0.4, ctx.currentTime);
      kickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);

      kickOsc.connect(kickGain);
      kickGain.connect(masterGain);

      kickOsc.start();
      kickOsc.stop(ctx.currentTime + 0.14);
    }

    step++;
  }, beatInterval * 1000);

  const timeoutId = setTimeout(() => {
    clearInterval(intervalId);
  }, durationSeconds * 1000);

  return {
    destination: dest,
    stop: () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    },
  };
}

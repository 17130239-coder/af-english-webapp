/**
 * Web Audio API Mechanical Click Synthesis Utility
 * Simulates precision tactile hardware keypress actuation sound
 */

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!sharedAudioCtx) {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      sharedAudioCtx = new AudioCtxClass();
    }
  }

  if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }

  return sharedAudioCtx;
}

export function playMechanicalClick(freq: number = 880, duration: number = 0.012): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Fail silently if browser audio policy blocks autoplay
  }
}

/**
 * Global listener to attach tactile mechanical audio to buttons and keys
 */
export function attachTactileSoundListener(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handlePointerDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && target.closest('.tactile-key, .tactile-key-orange, .tactile-key-lime, button')) {
      playMechanicalClick(920, 0.014);
    }
  };

  window.addEventListener('mousedown', handlePointerDown);
  return () => window.removeEventListener('mousedown', handlePointerDown);
}

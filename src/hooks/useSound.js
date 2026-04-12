import { useRef, useCallback } from 'react';

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!window._fwAudioCtx) {
    window._fwAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return window._fwAudioCtx;
}

function resumeCtx(ctx) {
  if (ctx.state === 'suspended') ctx.resume();
}

export function useSound() {
  const spinOscRef = useRef(null);
  const spinGainRef = useRef(null);

  const playPop = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    resumeCtx(ctx);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }, []);

  const playWhoosh = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    resumeCtx(ctx);

    // Noise burst for whoosh
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
  }, []);

  const startSpinSound = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    resumeCtx(ctx);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 1.5);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.3);

    osc.start(ctx.currentTime);
    spinOscRef.current = osc;
    spinGainRef.current = gain;
  }, []);

  const stopSpinSound = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx || !spinOscRef.current) return;
    const osc = spinOscRef.current;
    const gain = spinGainRef.current;
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    osc.stop(t + 0.8);
    spinOscRef.current = null;
    spinGainRef.current = null;
  }, []);

  const playTickSound = useCallback((speed) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    resumeCtx(ctx);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    const freq = 400 + Math.min(speed * 200, 800);
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  }, []);

  const playWinner = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    resumeCtx(ctx);

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.18);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + i * 0.18 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.4);
      osc.start(ctx.currentTime + i * 0.18);
      osc.stop(ctx.currentTime + i * 0.18 + 0.4);
    });
  }, []);

  return {
    playPop,
    playWhoosh,
    startSpinSound,
    stopSpinSound,
    playTickSound,
    playWinner,
  };
}

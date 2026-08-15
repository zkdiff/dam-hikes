/**
 * DAM HIKES - Web Audio Engine for Voice Dispatches & Kirtan Soundscapes
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.currentSource = null;
    this.isPlaying = false;
    this.playingId = null;
    this.progress = 0;
    this.timer = null;
    this.listeners = new Set();
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle(type, id, totalSeconds = 30) {
    if (this.isPlaying && this.playingId === id) {
      this.stop();
      this.notify();
      return false;
    }
    this.play(type, id, totalSeconds);
    return true;
  }

  play(type = 'voice', id = '', totalSeconds = 30) {
    this.stop();
    this.ensureContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    this.playingId = id;
    this.progress = 0;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'kirtan') {
      // Tanpura / meditative drone (C# / G# root)
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(138.59, now); // C#3
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(207.65, now); // G#3
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.16, now + 1.2);
    } else {
      // Warm voice resonance tone
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(196.00, now); // G3
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(293.66, now); // D4
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.4);
    }

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);

    this.currentSource = { osc1, osc2, gain };

    let elapsed = 0;
    this.timer = setInterval(() => {
      elapsed += 0.25;
      this.progress = Math.min(1, elapsed / totalSeconds);
      this.notify();
      if (this.progress >= 1) {
        this.stop();
        this.notify();
      }
    }, 250);

    this.notify();
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.currentSource && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.currentSource.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        const { osc1, osc2 } = this.currentSource;
        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
            osc1.disconnect();
            osc2.disconnect();
          } catch (e) {}
        }, 300);
        this.currentSource = null;
      } catch (e) {}
    }
    this.isPlaying = false;
    this.playingId = null;
    this.progress = 0;
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }
}

export const audioEngine = new AudioEngine();

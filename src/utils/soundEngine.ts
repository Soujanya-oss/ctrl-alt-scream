/**
 * Pure Procedural Web Audio API Sound Engine
 * Zero external audio assets, zero CORS or 404 network issues.
 * Works offline with instant response.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private whisperThrottle: number = 0;
  private ambientNodes: { oscs: OscillatorNode[]; gain: GainNode } | null = null;
  private isAmbientPlaying: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  public initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.7;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
  }

  /**
   * Spooky Theremin / Ghost Moan
   */
  public playGhostMoan() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(587.33, t + 0.4);
    osc.frequency.exponentialRampToValueAtTime(329.63, t + 1.2);

    // Vibrato
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(5.5, t);
    lfoGain.gain.setValueAtTime(18, t);
    lfo.connect(osc.frequency);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);

    osc.connect(gain);
    gain.connect(this.masterGain);

    lfo.start(t);
    osc.start(t);
    lfo.stop(t + 1.5);
    osc.stop(t + 1.5);
  }

  /**
   * Whispering wind / ghostly breeze (throttled for mousemove)
   */
  public playWhisper() {
    if (this.isMuted) return;
    const now = Date.now();
    if (now - this.whisperThrottle < 350) return;
    this.whisperThrottle = now;

    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800 + Math.random() * 600, t);
    filter.frequency.exponentialRampToValueAtTime(300 + Math.random() * 200, t + 0.35);
    filter.Q.value = 4.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + 0.4);
  }

  /**
   * Cartoon Evil Laughter: "Muahahaha!"
   */
  public playEvilLaugh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const laughs = [
      { freq: 280, time: 0.0, dur: 0.16 },
      { freq: 260, time: 0.18, dur: 0.16 },
      { freq: 240, time: 0.36, dur: 0.18 },
      { freq: 210, time: 0.56, dur: 0.22 },
      { freq: 175, time: 0.8, dur: 0.35 },
    ];

    const t = this.ctx.currentTime;

    laughs.forEach(({ freq, time, dur }) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.75, t + time + dur);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1100;

      gain.gain.setValueAtTime(0, t + time);
      gain.gain.linearRampToValueAtTime(0.25, t + time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + time);
      osc.stop(t + time + dur);
    });
  }

  /**
   * Gothic Pipe Organ Chord (D Minor / Phantom of the Opera)
   */
  public playOrganChord() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // D Minor chord: D3 (146.83), F3 (174.61), A3 (220.00), D4 (293.66)
    const notes = [146.83, 174.61, 220.0, 293.66, 440.0];

    notes.forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.frequency.exponentialRampToValueAtTime(600, t + 1.8);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 2.0);
    });
  }

  /**
   * Panicked Heartbeat (Thump-Thump)
   */
  public playHeartbeat() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const thumps = [0, 0.22];

    thumps.forEach((offset) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(75, t + offset);
      osc.frequency.exponentialRampToValueAtTime(35, t + offset + 0.12);

      gain.gain.setValueAtTime(0.001, t + offset);
      gain.gain.linearRampToValueAtTime(0.45, t + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.14);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + offset);
      osc.stop(t + offset + 0.16);
    });
  }

  /**
   * Rattling Spectral Chains
   */
  public playChainsRattle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    for (let i = 0; i < 7; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const delay = i * 0.07 + Math.random() * 0.03;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 + Math.random() * 800, t + delay);
      osc.frequency.exponentialRampToValueAtTime(400 + Math.random() * 300, t + delay + 0.06);

      gain.gain.setValueAtTime(0.001, t + delay);
      gain.gain.linearRampToValueAtTime(0.18, t + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + delay);
      osc.stop(t + delay + 0.09);
    }
  }

  /**
   * Spooky Black Cat Hiss & Screech
   */
  public playCatHiss() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // Noise hiss
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3200, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.48);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + 0.5);

    // Screech tonal slide
    const screech = this.ctx.createOscillator();
    const screechGain = this.ctx.createGain();
    screech.type = 'sawtooth';
    screech.frequency.setValueAtTime(800, t + 0.1);
    screech.frequency.exponentialRampToValueAtTime(1900, t + 0.25);
    screech.frequency.exponentialRampToValueAtTime(600, t + 0.45);

    screechGain.gain.setValueAtTime(0.001, t + 0.1);
    screechGain.gain.linearRampToValueAtTime(0.18, t + 0.22);
    screechGain.gain.exponentialRampToValueAtTime(0.001, t + 0.46);

    screech.connect(screechGain);
    screechGain.connect(this.masterGain);

    screech.start(t + 0.1);
    screech.stop(t + 0.5);
  }

  /**
   * Grandfather Clock Bell Striking Midnight
   */
  public playClockChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, t); // A3

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(330, t); // E4 harmonic

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 2.6);
    osc2.stop(t + 2.6);
  }

  /**
   * Shrill Witch Cackle
   */
  public playWitchCackle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const cackles = [
      { freq: 880, time: 0.0, dur: 0.1 },
      { freq: 1100, time: 0.11, dur: 0.12 },
      { freq: 1320, time: 0.24, dur: 0.12 },
      { freq: 980, time: 0.38, dur: 0.14 },
      { freq: 1480, time: 0.53, dur: 0.2 },
    ];

    cackles.forEach(({ freq, time, dur }) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.85, t + time + dur);

      gain.gain.setValueAtTime(0.001, t + time);
      gain.gain.linearRampToValueAtTime(0.2, t + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + time + dur);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + time);
      osc.stop(t + time + dur);
    });
  }

  /**
   * Guttural Zombie Groan
   */
  public playZombieGroan() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(85, t);
    osc.frequency.linearRampToValueAtTime(65, t + 0.7);
    osc.frequency.linearRampToValueAtTime(50, t + 1.2);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, t);
    filter.frequency.linearRampToValueAtTime(220, t + 1.0);
    filter.Q.value = 5.0;

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 1.3);
  }

  /**
   * Toggleable Ambient Spooky Background Drone
   */
  public toggleAmbientDrone(): boolean {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return false;

    if (this.isAmbientPlaying && this.ambientNodes) {
      this.ambientNodes.gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      setTimeout(() => {
        this.ambientNodes?.oscs.forEach((o) => {
          try {
            o.stop();
          } catch {}
        });
        this.ambientNodes = null;
      }, 900);
      this.isAmbientPlaying = false;
      return false;
    }

    // Start ambient drone
    const t = this.ctx.currentTime;
    const freqs = [55, 110, 112, 164.81]; // Sub-A, A2, detuned beating A2, E3
    const oscs: OscillatorNode[] = [];
    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.001, t);
    droneGain.gain.linearRampToValueAtTime(0.08, t + 1.5);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 350;

    freqs.forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      osc.connect(filter);
      osc.start(t);
      oscs.push(osc);
    });

    filter.connect(droneGain);
    droneGain.connect(this.masterGain);

    this.ambientNodes = { oscs, gain: droneGain };
    this.isAmbientPlaying = true;
    return true;
  }

  public getIsAmbientPlaying(): boolean {
    return this.isAmbientPlaying;
  }

  /**
   * Screaming Pumpkin Reset / Panic Button Sound
   */
  public playPumpkinScream() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // 1. Screech/Scream tone
    const scream = this.ctx.createOscillator();
    const screamGain = this.ctx.createGain();
    scream.type = 'sawtooth';
    scream.frequency.setValueAtTime(800, t);
    scream.frequency.exponentialRampToValueAtTime(1400, t + 0.15);
    scream.frequency.exponentialRampToValueAtTime(400, t + 0.45);

    screamGain.gain.setValueAtTime(0.3, t);
    screamGain.gain.exponentialRampToValueAtTime(0.01, t + 0.45);

    scream.connect(screamGain);
    screamGain.connect(this.masterGain);
    scream.start(t);
    scream.stop(t + 0.45);

    // 2. Victorious Exorcism Chimes (Major 7th arpeggio)
    const chimes = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    chimes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = t + 0.35 + idx * 0.08;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.28, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.9);
    });
  }

  /**
   * Squelchy Slime Drop / Ectoplasm
   */
  public playSlimeSquish() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.18);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  /**
   * 8-Bit Arcade Zap (Exorcising a ghost)
   */
  public playArcadeZap() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(950, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.12);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  /**
   * Sweet Candy Pickup Chime
   */
  public playCandyChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const notes = [587.33, 880, 1174.66]; // D5, A5, D6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.value = freq;

      const startTime = t + idx * 0.06;
      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  /**
   * Retro Glitch click / tick
   */
  public playGlitch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400 + Math.random() * 800, t);
    osc.frequency.setValueAtTime(300, t + 0.03);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  /**
   * Creaking Crypt Door
   */
  public playCreak() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    for (let i = 0; i < 6; i++) {
      osc.frequency.setValueAtTime(180 + (i % 2 === 0 ? 40 : -30), t + i * 0.08);
    }

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.6);
  }

  /**
   * Midnight Thunderclap
   */
  public playThunder() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, t);
    filter.frequency.exponentialRampToValueAtTime(60, t + 0.7);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + 0.8);
  }
}

export const sound = new SoundEngine();

class AudioEngine {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.5;
        this.masterGain.connect(this.ctx.destination);
        this.samples = {
            kick: null,
            snare: null,
            hihat: null
        };
    }

    resume() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    async loadSample(instrument, file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
            this.samples[instrument] = audioBuffer;
            return true;
        } catch (error) {
            console.error(`Error loading sample for ${instrument}:`, error);
            return false;
        }
    }

    playSample(buffer, time) {
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.masterGain);
        source.start(time);
    }

    playKick(time = 0) {
        const t = time || this.ctx.currentTime;

        if (this.samples.kick) {
            this.playSample(this.samples.kick, t);
            return;
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.5);

        gain.gain.setValueAtTime(1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

        osc.start(t);
        osc.stop(t + 0.5);
    }

    playSnare(time = 0) {
        const t = time || this.ctx.currentTime;

        if (this.samples.snare) {
            this.playSample(this.samples.snare, t);
            return;
        }

        // Noise
        const bufferSize = this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;
        const noiseGain = this.ctx.createGain();

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        noiseGain.gain.setValueAtTime(1, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        noise.start(t);
        noise.stop(t + 0.2);

        // Tone
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        const oscGain = this.ctx.createGain();
        osc.connect(oscGain);
        oscGain.connect(this.masterGain);

        osc.frequency.value = 100; // Snare pop
        oscGain.gain.setValueAtTime(0.7, t);
        oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

        osc.start(t);
        osc.stop(t + 0.2);
    }

    playHiHat(time = 0) {
        const t = time || this.ctx.currentTime;

        if (this.samples.hihat) {
            this.playSample(this.samples.hihat, t);
            return;
        }

        // Noise
        const bufferSize = this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const bandpass = this.ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = 10000;

        const highpass = this.ctx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = 7000;

        const gain = this.ctx.createGain();

        noise.connect(bandpass);
        bandpass.connect(highpass);
        highpass.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        noise.start(t);
        noise.stop(t + 0.05);
    }

    playOpenHat(time = 0) {
        const t = time || this.ctx.currentTime;

        if (this.samples.openhat) {
            this.playSample(this.samples.openhat, t);
            return;
        }

        // Noise
        const bufferSize = this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const highpass = this.ctx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = 8000;

        const gain = this.ctx.createGain();

        noise.connect(highpass);
        highpass.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

        noise.start(t);
        noise.stop(t + 0.3);
    }

    playClap(time = 0) {
        const t = time || this.ctx.currentTime;

        if (this.samples.clap) {
            this.playSample(this.samples.clap, t);
            return;
        }

        // Noise for clap body
        const bufferSize = this.ctx.sampleRate;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const highpass = this.ctx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = 2000;

        const gain = this.ctx.createGain();

        noise.connect(highpass);
        highpass.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

        noise.start(t);
        noise.stop(t + 0.15);
    }
}

export const audioEngine = new AudioEngine();

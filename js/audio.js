// ==========================================
// SES SİSTEMİ (Web Audio API)
// ==========================================
let audioCtx;

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playSound(freq, type, duration, vol = 0.1) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

const sfx = {
    jump: () => { 
        playSound(300, 'square', 0.1, 0.05); 
        setTimeout(() => playSound(450, 'square', 0.1, 0.05), 50); 
    },
    coin: () => { 
        playSound(800, 'sine', 0.1, 0.05); 
        setTimeout(() => playSound(1200, 'sine', 0.1, 0.05), 50); 
    },
    death: () => { 
        playSound(200, 'sawtooth', 0.3, 0.1); 
        setTimeout(() => playSound(150, 'sawtooth', 0.3, 0.1), 100); 
    },
    portal: () => { 
        [523, 659, 783, 1046].forEach((f, i) => setTimeout(() => playSound(f, 'triangle', 0.2, 0.08), i * 100)); 
    },
    enemy: () => { 
        playSound(400, 'square', 0.1, 0.08); 
        setTimeout(() => playSound(800, 'square', 0.1, 0.08), 50); 
    },
    break: () => { 
        playSound(100, 'sawtooth', 0.2, 0.08); 
    },
    fake: () => { 
        playSound(150, 'sawtooth', 0.4, 0.15); 
    }
};

export { initAudio, sfx };

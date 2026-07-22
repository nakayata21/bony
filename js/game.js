// ==========================================
// OYUN DURUMU VE OYUNCU
// ==========================================
import { WORLDS } from './worlds.js';
import { LEVELS } from './levels.js';
import { sfx } from './audio.js';
import { markLevelComplete, getGameProgress } from './saveSystem.js';

export let gameState = 'menu'; // menu, playing, levelComplete, gameOver
export let currentLevelIndex = 0;
export let levelStartTime = 0;
export let levelCompletionTime = 0;
export let activeWorld = WORLDS.grass;

export const COYOTE_FRAMES = 8;
export const BUFFER_FRAMES = 8;

export let player = {
    x: 50, y: 300, w: 30, h: 30, vx: 0, vy: 0,
    isGrounded: false, isJumping: false, jumpHoldTimer: 0,
    coyoteTimer: 0, jumpBufferTimer: 0, color: '#e74c3c', windShake: false
};

// Aktif Bölüm Elemanları
export let activePlatforms = [];
export let activePortal = null;
export let movingPlatforms = [];
export let breakableBlocks = [];
export let coins = [];
export let windZones = [];
export let spikes = [];
export let enemies = [];
export let fakePortals = [];
export let coinsCollected = 0;
export let totalCoinsInLevel = 0;

// Efektler
export let particles = [];
export let screenShake = 0;
export let screenShakeIntensity = 0;
export let screenFlashColor = null;
export let screenFlashTimer = 0;
export let portalAnimation = { active: false, timer: 0, maxTime: 30, targetX: 0, targetY: 0, targetScale: 1 };
export let stars = [];

// Girdi (Input)
export let keys = {};
export let jumpKeyPressed = false;
export let jumpKeyReleased = true;

// ==========================================
// BÖLÜM YÖNETİMİ (LOAD & COMPLETE)
// ==========================================
export function loadLevel(index, canvas) {
    if (index >= LEVELS.length) { 
        alert('Tüm bölümleri tamamladın! 🎉'); 
        gameState = 'menu';
        return; 
    }
    
    const level = LEVELS[index];
    activeWorld = WORLDS[level.world] || WORLDS.grass;
    
    activePlatforms = level.platforms || [];
    activePortal = level.portal;
    
    movingPlatforms = (level.movingPlatforms || []).map(mp => ({...mp, direction: 1}));
    breakableBlocks = (level.breakableBlocks || []).map(b => ({...b, isBreaking: false, breakTimer: 0, shakeX: 0, shakeY: 0}));
    coins = (level.coins || []).map(c => ({...c, collected: false, angle: Math.random() * Math.PI * 2, drawY: c.y}));
    windZones = level.windZones || [];
    spikes = level.spikes || [];
    enemies = (level.enemies || []).map(e => ({...e, dead: false, deathTimer: 0, animTimer: Math.random()*Math.PI*2, bounceY: 0}));
    fakePortals = (level.fakePortals || []).map(fp => ({...fp, triggered: false}));
    
    coinsCollected = 0; 
    totalCoinsInLevel = coins.length;
    
    player.x = level.startPos.x; 
    player.y = level.startPos.y;
    player.vx = 0; 
    player.vy = 0; 
    player.isGrounded = false; 
    player.isJumping = false;
    
    particles = []; 
    screenShake = 0; 
    screenFlashTimer = 0; 
    portalAnimation.active = false;
    
    if (level.world === 'space') {
        stars = [];
        for (let i = 0; i < 80; i++) {
            stars.push({
                x: Math.random() * canvas.width, 
                y: Math.random() * canvas.height, 
                r: Math.random() * 1.5 + 0.5, 
                tw: Math.random() * Math.PI * 2
            });
        }
    }

    gameState = 'playing';
    levelStartTime = Date.now();
    
    const overlay = document.getElementById('levelCompleteOverlay');
    if (overlay) overlay.classList.add('hidden');
}

export function completeLevel() {
    gameState = 'levelComplete';
    levelCompletionTime = ((Date.now() - levelStartTime) / 1000).toFixed(2);
    
    let starsEarned = 1;
    if (coinsCollected === totalCoinsInLevel && totalCoinsInLevel > 0) starsEarned++;
    if (parseFloat(levelCompletionTime) < 15) starsEarned++; // 15 saniye hedefi
    
    markLevelComplete(currentLevelIndex + 1, starsEarned);
    
    const level = LEVELS[currentLevelIndex];
    document.getElementById('completionLevelName').textContent = level.name;
    document.getElementById('completionWorldName').textContent = activeWorld.name;
    document.getElementById('completionTime').textContent = levelCompletionTime + ' sn';
    document.getElementById('completionCoins').textContent = `${coinsCollected} / ${totalCoinsInLevel}`;
    
    let starsHTML = '';
    for (let i = 0; i < 3; i++) {
        starsHTML += i < starsEarned ? '⭐' : '☆';
    }
    document.getElementById('completionStars').innerHTML = starsHTML;
    
    document.getElementById('levelCompleteOverlay').classList.remove('hidden');
}

export function killPlayer() {
    if (gameState !== 'playing') return;
    gameState = 'gameOver';
    sfx.death(); 
    createParticles(player.x + player.w/2, player.y + player.h/2, '#e74c3c', 20, 8);
    triggerScreenShake(15, 20);
    setTimeout(() => {
        gameState = 'playing';
        loadLevel(currentLevelIndex, document.getElementById('gameCanvas'));
    }, 1000);
}

// ==========================================
// YARDIMCI FONKSİYONLAR
// ==========================================
export function isOnPlatform(entity, plat) {
    return entity.x + entity.w > plat.x && 
           entity.x < plat.x + plat.w && 
           Math.abs((entity.y + entity.h) - plat.y) < 5;
}

export function createParticles(x, y, color, count, speed) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x, y, 
            vx: (Math.random()-0.5)*speed*2, 
            vy: (Math.random()-0.5)*speed*2, 
            life: 1, 
            color, 
            size: Math.random()*4+2
        });
    }
}

export function triggerScreenShake(intensity, duration) { 
    screenShakeIntensity = intensity; 
    screenShake = duration; 
}

export function getCurrentLevelStory() {
    if (currentLevelIndex >= 0 && currentLevelIndex < LEVELS.length) {
        return LEVELS[currentLevelIndex].story;
    }
    return "";
}

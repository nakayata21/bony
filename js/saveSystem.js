// ==========================================
// İLERLEME KAYDETME (SAVE SYSTEM)
// ==========================================
import { LEVELS } from './levels.js';

const SAVE_KEY = 'zipla_plus_save_v2';
let gameProgress = { completedLevels: [], stars: {}, totalStars: 0 };

export function loadProgress() {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) gameProgress = JSON.parse(saved);
    updateTotalStarsDisplay();
}

export function saveProgress() { 
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameProgress)); 
}

export function markLevelComplete(levelId, starsEarned) {
    if (!gameProgress.completedLevels.includes(levelId)) gameProgress.completedLevels.push(levelId);
    if (!gameProgress.stars[levelId] || gameProgress.stars[levelId] < starsEarned) gameProgress.stars[levelId] = starsEarned;
    gameProgress.totalStars = Object.values(gameProgress.stars).reduce((a, b) => a + b, 0);
    saveProgress(); 
    updateTotalStarsDisplay();
}

export function resetProgress() {
    if (confirm('Tüm ilerlemen silinecek. Emin misin?')) {
        localStorage.removeItem(SAVE_KEY);
        gameProgress = { completedLevels: [], stars: {}, totalStars: 0 };
        updateTotalStarsDisplay();
        return true;
    }
    return false;
}

export function updateTotalStarsDisplay() {
    const tEl = document.getElementById('totalStarsDisplay');
    const mEl = document.getElementById('maxStarsDisplay');
    if(tEl) tEl.textContent = gameProgress.totalStars;
    if(mEl) mEl.textContent = LEVELS.length * 3;
}

export function isLevelUnlocked(index) { 
    return index === 0 || gameProgress.completedLevels.includes(index); 
}

export function getGameProgress() {
    return gameProgress;
}

export function setGameProgress(progress) {
    gameProgress = progress;
}

// ==========================================
// ANA OYUN DOSYASI (MAIN)
// ==========================================
import { loadProgress } from './saveSystem.js';
import { setupEventListeners, setupCanvasPolyfill, buildLevelSelect, showMainMenu } from './ui.js';
import { update } from './update.js';
import { draw } from './draw.js';

// Canvas ve Context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Polyfill kurulumu
setupCanvasPolyfill(ctx);

// Event Listener'ları kur
setupEventListeners(canvas);

// İlerlemeyi yükle
loadProgress();
buildLevelSelect();

// Oyun döngüsü
function gameLoop() {
    update();
    draw(ctx, canvas);
    requestAnimationFrame(gameLoop);
}

// Oyunu başlat
showMainMenu();
gameLoop();

console.log("ZIPLA+ oyunu başlatıldı!");

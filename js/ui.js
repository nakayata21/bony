// ==========================================
// UI VE EVENT LISTENERS
// ==========================================
import { LEVELS } from './levels.js';
import { loadProgress, resetProgress, isLevelUnlocked, getGameProgress, updateTotalStarsDisplay } from './saveSystem.js';
import { loadLevel, currentLevelIndex, gameState } from './game.js';
import { initAudio } from './audio.js';

export function buildLevelSelect() {
    const grid = document.getElementById('levelGrid'); 
    if (!grid) return;
    
    grid.innerHTML = '';
    const gameProgress = getGameProgress();
    
    LEVELS.forEach((level, index) => {
        const btn = document.createElement('button'); 
        btn.className = 'level-btn'; 
        btn.textContent = level.id;
        
        const unlocked = isLevelUnlocked(index); 
        const completed = gameProgress.completedLevels.includes(index + 1);
        const stars = gameProgress.stars[index + 1] || 0;
        
        if (unlocked) {
            btn.classList.add('unlocked');
            if (!completed) btn.classList.add('current');
            btn.addEventListener('click', () => { 
                loadLevel(index, document.getElementById('gameCanvas')); 
                document.getElementById('levelSelectMenu').classList.add('hidden'); 
                initAudio(); 
            });
        } else { 
            btn.classList.add('locked'); 
            btn.textContent = '🔒'; 
        }
        
        if (completed) {
            const starsDiv = document.createElement('div'); 
            starsDiv.className = 'level-stars';
            let sText = ''; 
            for (let i = 0; i < 3; i++) sText += i < stars ? '⭐' : '☆';
            starsDiv.textContent = sText; 
            btn.appendChild(starsDiv);
        }
        grid.appendChild(btn);
    });
}

export function showMainMenu() {
    gameState = 'menu';
    const mainMenu = document.getElementById('mainMenu');
    const levelSelectMenu = document.getElementById('levelSelectMenu');
    const levelCompleteOverlay = document.getElementById('levelCompleteOverlay');
    
    if (mainMenu) mainMenu.classList.remove('hidden');
    if (levelSelectMenu) levelSelectMenu.classList.add('hidden');
    if (levelCompleteOverlay) levelCompleteOverlay.classList.add('hidden');
}

export function setupEventListeners(canvas) {
    // Play Button
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            initAudio();
            let startIndex = 0;
            for (let i = 0; i < LEVELS.length; i++) { 
                if (!getGameProgress().completedLevels.includes(i + 1)) { 
                    startIndex = i; 
                    break; 
                } 
            }
            loadLevel(startIndex, canvas);
            document.getElementById('mainMenu').classList.add('hidden');
        });
    }
    
    // Level Select Button
    const levelSelectBtn = document.getElementById('levelSelectBtn');
    if (levelSelectBtn) {
        levelSelectBtn.addEventListener('click', () => { 
            buildLevelSelect(); 
            document.getElementById('mainMenu').classList.add('hidden'); 
            document.getElementById('levelSelectMenu').classList.remove('hidden'); 
        });
    }
    
    // Reset Progress Button
    const resetProgressBtn = document.getElementById('resetProgressBtn');
    if (resetProgressBtn) {
        resetProgressBtn.addEventListener('click', () => {
            if (resetProgress()) {
                buildLevelSelect();
            }
        });
    }
    
    // Back to Menu Button
    const backToMenuBtn = document.getElementById('backToMenuBtn');
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', showMainMenu);
    }
    
    // Next Level Button
    const nextLevelBtn = document.getElementById('nextLevelBtn');
    if (nextLevelBtn) {
        nextLevelBtn.addEventListener('click', () => { 
            loadLevel(currentLevelIndex + 1, canvas); 
        });
    }
    
    // Back to Map Button
    const backToMapBtn = document.getElementById('backToMapBtn');
    if (backToMapBtn) {
        backToMapBtn.addEventListener('click', () => { 
            document.getElementById('levelCompleteOverlay').classList.add('hidden'); 
            showMainMenu(); 
        });
    }
    
    // Keyboard Events
    document.addEventListener('keydown', (e) => {
        import('./game.js').then(m => {
            m.keys[e.code] = true;
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
                e.preventDefault(); 
                initAudio();
                if (m.jumpKeyReleased) { 
                    m.jumpKeyPressed = true; 
                    m.jumpKeyReleased = false; 
                }
            }
            if (e.code === 'KeyR' && m.gameState === 'playing') {
                loadLevel(currentLevelIndex, canvas);
            }
        });
    });
    
    document.addEventListener('keyup', (e) => {
        import('./game.js').then(m => {
            m.keys[e.code] = false;
            if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') { 
                m.jumpKeyReleased = true; 
                m.player.isJumping = false; 
            }
        });
    });
}

// Canvas roundRect polyfill
export function setupCanvasPolyfill(ctx) {
    if (!ctx.roundRect) {
        ctx.roundRect = function(x, y, w, h, r) {
            this.beginPath(); 
            this.moveTo(x+r, y); 
            this.arcTo(x+w, y, x+w, y+h, r); 
            this.arcTo(x+w, y+h, x, y+h, r); 
            this.arcTo(x, y+h, x, y, r); 
            this.arcTo(x, y, x+w, y, r); 
            this.closePath(); 
            return this;
        };
    }
}

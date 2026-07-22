// ==========================================
// FİZİK VE GÜNCELLEME (UPDATE)
// ==========================================
import { 
    gameState, player, activeWorld, activePlatforms, activePortal,
    movingPlatforms, breakableBlocks, coins, windZones, spikes, enemies, fakePortals,
    particles, screenShake, screenShakeIntensity, screenFlashColor, screenFlashTimer,
    portalAnimation, keys, jumpKeyPressed, jumpKeyReleased, coinsCollected,
    COYOTE_FRAMES, BUFFER_FRAMES, currentLevelIndex,
    isOnPlatform, createParticles, triggerScreenShake, killPlayer, completeLevel
} from './game.js';
import { sfx } from './audio.js';

export function update() {
    if (gameState !== 'playing') return;
    if (portalAnimation.active) { 
        updatePortalAnimation(); 
        return; 
    }

    // Input & Buffer
    if (jumpKeyPressed) { 
        player.jumpBufferTimer = BUFFER_FRAMES; 
        jumpKeyPressed = false; 
    }
    if (player.jumpBufferTimer > 0) player.jumpBufferTimer--;
    if (player.isGrounded) player.coyoteTimer = COYOTE_FRAMES; 
    else if (player.coyoteTimer > 0) player.coyoteTimer--;

    // Jump Application
    if (player.jumpBufferTimer > 0 && (player.isGrounded || player.coyoteTimer > 0)) {
        player.vy = activeWorld.jumpInitial;
        player.isJumping = true; 
        player.jumpHoldTimer = 0;
        player.jumpBufferTimer = 0; 
        player.coyoteTimer = 0;
        sfx.jump(); 
        createParticles(player.x + player.w/2, player.y + player.h, '#fff', 5, 3);
    }

    // Variable Jump
    if (player.isJumping && !jumpKeyReleased && player.jumpHoldTimer < activeWorld.maxJumpHold) {
        player.vy += activeWorld.jumpSustain; 
        player.jumpHoldTimer++;
    }

    // Movement & Air Control
    if (keys['ArrowLeft'] || keys['KeyA']) {
        player.vx = player.isGrounded ? -activeWorld.moveSpeed : Math.max(player.vx - activeWorld.airAccel, -activeWorld.moveSpeed);
    } else if (keys['ArrowRight'] || keys['KeyD']) {
        player.vx = player.isGrounded ? activeWorld.moveSpeed : Math.min(player.vx + activeWorld.airAccel, activeWorld.moveSpeed);
    } else {
        player.vx *= player.isGrounded ? activeWorld.groundFriction : activeWorld.airFriction;
    }
    if (Math.abs(player.vx) < 0.1) player.vx = 0;

    // Gravity & Position
    player.vy += activeWorld.gravity;
    if (player.vy > 15) player.vy = 15;
    player.x += player.vx; 
    player.y += player.vy;

    // Collisions
    player.isGrounded = false;
    let allPlats = [...activePlatforms, ...movingPlatforms, ...breakableBlocks];
    for (let p of allPlats) {
        if (player.x < p.x + p.w && player.x + player.w > p.x && 
            player.y < p.y + p.h && player.y + player.h > p.y) {
            
            if (player.vy > 0 && player.y + player.h - player.vy <= p.y + 5) {
                player.y = p.y - player.h; 
                player.vy = 0; 
                player.isGrounded = true; 
                player.isJumping = false;
            } else if (player.vy < 0 && player.y - player.vy >= p.y + p.h - 5) {
                player.y = p.y + p.h; 
                player.vy = 0; 
                player.isJumping = false;
            } else if (player.vx > 0 && player.x + player.w - player.vx <= p.x) {
                player.x = p.x - player.w; 
                player.vx = 0;
            } else if (player.vx < 0 && player.x - player.vx >= p.x + p.w) {
                player.x = p.x + p.w; 
                player.vx = 0;
            }
        }
    }

    // Entities Update
    updateMovingPlatforms();
    updateBreakableBlocks();
    updateCoins();
    updateWindZones();
    updateEnemies();
    checkSpikeCollision();
    checkFakePortalCollision();
    checkPortalCollision();
    checkLavaCollision();

    // Particles & Shake
    updateParticles();
    if (screenShake > 0) screenShake--;
    if (screenFlashTimer > 0) screenFlashTimer--;
}

// Entity Updates
function updateMovingPlatforms() {
    for (let mp of movingPlatforms) {
        if (mp.type === 'horizontal') { 
            mp.x += mp.speed * mp.direction; 
            if (mp.x <= mp.minX || mp.x + mp.w >= mp.maxX) mp.direction *= -1; 
        } else { 
            mp.y += mp.speed * mp.direction; 
            if (mp.y <= mp.minY || mp.y + mp.h >= mp.maxY) mp.direction *= -1; 
        }
        if (player.isGrounded && isOnPlatform(player, mp)) {
            if (mp.type === 'horizontal') player.x += mp.speed * mp.direction;
            else player.y += mp.speed * mp.direction;
        }
    }
}

function updateBreakableBlocks() {
    for (let i = breakableBlocks.length - 1; i >= 0; i--) {
        let b = breakableBlocks[i];
        if (isOnPlatform(player, b) && !b.isBreaking) { 
            b.isBreaking = true; 
            b.breakTimer = b.breakTime; 
        }
        if (b.isBreaking) {
            b.breakTimer--;
            if (b.breakTimer < 20) { 
                b.shakeX = (Math.random() - 0.5) * 4; 
                b.shakeY = (Math.random() - 0.5) * 4; 
            }
            if (b.breakTimer <= 0) { 
                sfx.break(); 
                createParticles(b.x+b.w/2, b.y+b.h/2, '#c0392b', 10, 4); 
                breakableBlocks.splice(i, 1); 
            }
        }
    }
}

function updateCoins() {
    for (let c of coins) {
        if (c.collected) continue;
        c.angle += 0.05; 
        c.drawY = c.y + Math.sin(c.angle) * 3;
        let dx = (player.x + player.w/2) - c.x; 
        let dy = (player.y + player.h/2) - c.drawY;
        if (Math.sqrt(dx*dx + dy*dy) < c.r + player.w/2) {
            c.collected = true; 
            coinsCollected++;
            sfx.coin(); 
            createParticles(c.x, c.drawY, '#f1c40f', 8, 4);
        }
    }
}

function updateWindZones() {
    player.windShake = false;
    for (let wz of windZones) {
        if (player.x + player.w > wz.x && player.x < wz.x + wz.w && 
            player.y + player.h > wz.y && player.y < wz.y + wz.h) {
            player.vx += wz.forceX; 
            player.vy += wz.forceY; 
            player.windShake = true;
        }
    }
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        if (e.dead) { 
            e.deathTimer--; 
            if (e.deathTimer <= 0) enemies.splice(i, 1); 
            continue; 
        }
        e.x += e.speed * e.dir;
        if (e.x <= e.minX || e.x + e.w >= e.maxX) e.dir *= -1;
        e.animTimer += 0.1; 
        e.bounceY = Math.abs(Math.sin(e.animTimer)) * 3;
        
        if (player.x < e.x + e.w && player.x + player.w > e.x && 
            player.y < e.y + e.h && player.y + player.h > e.y) {
            if (player.vy > 0 && player.y + player.h - player.vy <= e.y + 5) {
                e.dead = true; 
                e.deathTimer = 30; 
                player.vy = activeWorld.jumpInitial * 0.7; 
                player.isJumping = false;
                sfx.enemy(); 
                createParticles(e.x+e.w/2, e.y+e.h/2, e.col, 12, 5);
            } else { 
                killPlayer(); 
                return; 
            }
        }
    }
}

function checkSpikeCollision() {
    for (let s of spikes) {
        let hit = {
            x: s.x + s.w*0.2, 
            y: s.dir==='up' ? s.y+s.h*0.3 : s.y, 
            w: s.w*0.6, 
            h: s.h*0.7
        };
        if (player.x < hit.x+hit.w && player.x+player.w > hit.x && 
            player.y < hit.y+hit.h && player.y+player.h > hit.y) { 
            killPlayer(); 
            return; 
        }
    }
}

function checkFakePortalCollision() {
    for (let fp of fakePortals) {
        if (fp.triggered) continue;
        if (player.x < fp.x+fp.w && player.x+player.w > fp.x && 
            player.y < fp.y+fp.h && player.y+player.h > fp.y) {
            fp.triggered = true; 
            sfx.fake(); 
            triggerScreenShake(12, 18);
            screenFlashColor = 'rgba(255, 0, 0, 0.5)'; 
            screenFlashTimer = 20;
            setTimeout(() => {
                import('./game.js').then(m => {
                    m.loadLevel(currentLevelIndex, document.getElementById('gameCanvas'));
                });
            }, 500);
        }
    }
}

function checkPortalCollision() {
    if (!activePortal || portalAnimation.active) return;
    if (player.x < activePortal.x+activePortal.w && player.x+player.w > activePortal.x && 
        player.y < activePortal.y+activePortal.h && player.y+player.h > activePortal.y) {
        portalAnimation.active = true; 
        portalAnimation.timer = 0;
        portalAnimation.targetX = activePortal.x + activePortal.w/2 - player.w/2;
        portalAnimation.targetY = activePortal.y + activePortal.h/2 - player.h/2;
        sfx.portal(); 
        createParticles(player.x+player.w/2, player.y+player.h/2, '#9b59b6', 15, 6);
    }
}

function checkLavaCollision() {
    const canvas = document.getElementById('gameCanvas');
    if (activeWorld.hasLava && player.y + player.h >= canvas.height - 40) killPlayer();
}

function updatePortalAnimation() {
    portalAnimation.timer++;
    let progress = portalAnimation.timer / portalAnimation.maxTime;
    player.x += (portalAnimation.targetX - player.x) * 0.2;
    player.y += (portalAnimation.targetY - player.y) * 0.2;
    portalAnimation.targetScale = 1 - progress;
    if (portalAnimation.timer >= portalAnimation.maxTime) { 
        portalAnimation.active = false; 
        completeLevel(); 
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i]; 
        p.x += p.vx; 
        p.y += p.vy; 
        p.vy += 0.2; 
        p.life -= 0.03;
        if (p.life <= 0) particles.splice(i, 1);
    }
}

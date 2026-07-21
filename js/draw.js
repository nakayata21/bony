// ==========================================
// ÇİZİM (DRAW)
// ==========================================
import { 
    gameState, player, activeWorld, activePlatforms, activePortal,
    movingPlatforms, breakableBlocks, coins, windZones, spikes, enemies, fakePortals,
    particles, screenShake, screenShakeIntensity, screenFlashColor, screenFlashTimer,
    portalAnimation, stars
} from './game.js';

export function draw(ctx, canvas) {
    ctx.save();
    if (screenShake > 0) {
        ctx.translate(
            (Math.random()-0.5)*screenShakeIntensity, 
            (Math.random()-0.5)*screenShakeIntensity
        );
    }
    ctx.clearRect(-20, -20, canvas.width+40, canvas.height+40);

    // 1. Arkaplan
    let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, activeWorld.skyTop); 
    grad.addColorStop(1, activeWorld.skyBot);
    ctx.fillStyle = grad; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (activeWorld.name === 'Uzay') {
        ctx.fillStyle = '#fff';
        for (let s of stars) { 
            s.tw += 0.02; 
            ctx.globalAlpha = 0.5 + Math.sin(s.tw)*0.5; 
            ctx.beginPath(); 
            ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); 
            ctx.fill(); 
        }
        ctx.globalAlpha = 1;
    }

    // 2. Wind Zones
    for (let wz of windZones) {
        ctx.fillStyle = wz.forceY < 0 ? 'rgba(135, 206, 250, 0.15)' : 'rgba(255, 165, 0, 0.15)';
        ctx.fillRect(wz.x, wz.y, wz.w, wz.h);
        ctx.fillStyle = wz.forceY < 0 ? 'rgba(135, 206, 250, 0.6)' : 'rgba(255, 165, 0, 0.6)';
        ctx.font = '16px Arial'; 
        ctx.textAlign = 'center';
        let arrow = wz.forceY < 0 ? '▲' : (wz.forceX > 0 ? '►' : '◄');
        let t = Date.now() * 0.003;
        for (let r = 0; r < 3; r++) { 
            let oy = ((t*30 + r*30) % wz.h); 
            if (wz.y+oy < wz.y+wz.h) ctx.fillText(arrow, wz.x+wz.w/2, wz.y+oy); 
        }
    }

    // 3. Platforms
    ctx.fillStyle = activeWorld.platCol;
    for (let p of activePlatforms) { 
        ctx.fillRect(p.x, p.y, p.w, p.h); 
        ctx.fillStyle = activeWorld.platTop; 
        ctx.fillRect(p.x, p.y, p.w, 4); 
        ctx.fillStyle = activeWorld.platCol; 
    }
    for (let mp of movingPlatforms) { 
        ctx.fillStyle = '#3498db'; 
        ctx.fillRect(mp.x, mp.y, mp.w, mp.h); 
        ctx.fillStyle = '#2980b9'; 
        ctx.fillRect(mp.x, mp.y, mp.w, 3); 
    }
    for (let b of breakableBlocks) {
        let prog = b.isBreaking ? (b.breakTimer / b.breakTime) : 1;
        ctx.fillStyle = `rgb(${Math.floor(231*(1-prog)+192*prog)}, ${Math.floor(76*(1-prog)+133*prog)}, 60)`;
        ctx.fillRect(b.x + (b.shakeX||0), b.y + (b.shakeY||0), b.w, b.h);
    }

    // 4. Spikes
    for (let s of spikes) {
        ctx.fillStyle = '#e74c3c'; 
        ctx.beginPath();
        if (s.dir === 'up') { 
            ctx.moveTo(s.x, s.y+s.h); 
            ctx.lineTo(s.x+s.w/2, s.y); 
            ctx.lineTo(s.x+s.w, s.y+s.h); 
        } else if (s.dir === 'down') { 
            ctx.moveTo(s.x, s.y); 
            ctx.lineTo(s.x+s.w/2, s.y+s.h); 
            ctx.lineTo(s.x+s.w, s.y); 
        }
        ctx.closePath(); 
        ctx.fill();
    }

    // 5. Coins
    for (let c of coins) {
        if (c.collected) continue;
        ctx.fillStyle = '#f1c40f'; 
        ctx.beginPath(); 
        ctx.arc(c.x, c.drawY, c.r, 0, Math.PI*2); 
        ctx.fill();
        ctx.fillStyle = '#f39c12'; 
        ctx.beginPath(); 
        ctx.arc(c.x, c.drawY, c.r-3, 0, Math.PI*2); 
        ctx.fill();
        ctx.fillStyle = '#fff'; 
        ctx.font = 'bold 12px Arial'; 
        ctx.textAlign = 'center'; 
        ctx.textBaseline = 'middle'; 
        ctx.fillText('$', c.x, c.drawY);
    }

    // 6. Enemies
    for (let e of enemies) {
        if (e.dead) { 
            ctx.globalAlpha = e.deathTimer/30; 
            ctx.fillStyle = '#7f8c8d'; 
            ctx.fillRect(e.x, e.y+e.h-8, e.w, 8); 
            ctx.globalAlpha = 1; 
            continue; 
        }
        let dy = e.y - e.bounceY;
        ctx.fillStyle = e.col; 
        ctx.beginPath(); 
        ctx.roundRect(e.x, dy, e.w, e.h, 5); 
        ctx.fill();
        ctx.fillStyle = '#fff'; 
        ctx.beginPath(); 
        ctx.arc(e.x+8, dy+10, 4, 0, Math.PI*2); 
        ctx.fill(); 
        ctx.beginPath(); 
        ctx.arc(e.x+22, dy+10, 4, 0, Math.PI*2); 
        ctx.fill();
        ctx.fillStyle = '#000'; 
        ctx.beginPath(); 
        ctx.arc(e.x+8+(e.dir>0?2:-1), dy+10, 2, 0, Math.PI*2); 
        ctx.fill(); 
        ctx.beginPath(); 
        ctx.arc(e.x+22+(e.dir>0?2:-1), dy+10, 2, 0, Math.PI*2); 
        ctx.fill();
    }

    // 7. Portals
    for (let fp of fakePortals) {
        if (fp.triggered) continue;
        let p = Math.sin(Date.now()*0.005)*0.3+0.7;
        ctx.fillStyle = `rgba(180, 89, 182, ${p})`; 
        ctx.fillRect(fp.x, fp.y, fp.w, fp.h);
        ctx.strokeStyle = '#9b59b6'; 
        ctx.lineWidth = 3; 
        ctx.strokeRect(fp.x, fp.y, fp.w, fp.h);
    }
    if (activePortal) {
        let p = Math.sin(Date.now()*0.005)*0.3+0.7;
        ctx.fillStyle = `rgba(155, 89, 182, ${p})`; 
        ctx.fillRect(activePortal.x, activePortal.y, activePortal.w, activePortal.h);
        ctx.fillStyle = `rgba(255, 255, 255, ${p*0.6})`; 
        ctx.fillRect(activePortal.x+5, activePortal.y+5, activePortal.w-10, activePortal.h-10);
        ctx.strokeStyle = '#8e44ad'; 
        ctx.lineWidth = 3; 
        ctx.strokeRect(activePortal.x, activePortal.y, activePortal.w, activePortal.h);
    }

    // 8. Player
    ctx.save();
    if (portalAnimation.active) {
        let cx = player.x+player.w/2, cy = player.y+player.h/2;
        ctx.translate(cx, cy); 
        ctx.scale(portalAnimation.targetScale, portalAnimation.targetScale); 
        ctx.translate(-cx, -cy);
    }
    if (player.windShake) { 
        ctx.fillStyle = 'rgba(135, 206, 250, 0.3)'; 
        ctx.fillRect(player.x-2, player.y-2, player.w+4, player.h+4); 
    }
    ctx.fillStyle = player.color; 
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillStyle = '#fff'; 
    let ex = player.vx >= 0 ? player.x+20 : player.x+5; 
    let ey = player.isJumping ? player.y+6 : player.y+8;
    ctx.fillRect(ex, ey, 5, 5);
    ctx.restore();

    // 9. Particles & Effects
    for (let p of particles) { 
        ctx.globalAlpha = p.life; 
        ctx.fillStyle = p.color; 
        ctx.fillRect(p.x, p.y, p.size, p.size); 
    }
    ctx.globalAlpha = 1;

    if (activeWorld.name === 'Mağara') {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; 
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.globalCompositeOperation = 'destination-out';
        let grd = ctx.createRadialGradient(
            player.x+player.w/2, player.y+player.h/2, 20, 
            player.x+player.w/2, player.y+player.h/2, 150
        );
        grd.addColorStop(0, 'rgba(0,0,0,0)'); 
        grd.addColorStop(1, 'rgba(0,0,0,0.9)');
        ctx.fillStyle = grd; 
        ctx.beginPath(); 
        ctx.arc(player.x+player.w/2, player.y+player.h/2, 150, 0, Math.PI*2); 
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }

    if (activeWorld.hasLava) {
        let ly = canvas.height - 40; 
        let t = Date.now() * 0.002;
        ctx.fillStyle = '#ff4500'; 
        ctx.fillRect(0, ly, canvas.width, 40);
        ctx.fillStyle = '#ff6347'; 
        ctx.beginPath(); 
        ctx.moveTo(0, ly);
        for (let x = 0; x <= canvas.width; x += 10) {
            ctx.lineTo(x, ly + Math.sin(x*0.05+t)*5);
        }
        ctx.lineTo(canvas.width, canvas.height); 
        ctx.lineTo(0, canvas.height); 
        ctx.closePath(); 
        ctx.fill();
    }

    if (portalAnimation.active && portalAnimation.timer > portalAnimation.maxTime - 10) {
        ctx.fillStyle = `rgba(255,255,255, ${(portalAnimation.timer-(portalAnimation.maxTime-10))/10})`;
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    if (screenFlashTimer > 0) { 
        ctx.fillStyle = screenFlashColor; 
        ctx.fillRect(0,0,canvas.width,canvas.height); 
    }

    ctx.restore();
}

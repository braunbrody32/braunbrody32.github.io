const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const cellSize = 10;
const gridWidth = Math.floor(canvas.width / cellSize);
const gridHeight = Math.floor(canvas.height / cellSize);

let grid = Array.from({ length: gridWidth }, () => Array(gridHeight).fill(null));
let particles = [];
let selected = "none";
let frameCount = 0;

function getRandomInt(max) { return Math.floor(Math.random() * max); }

// ============================================================
// CONSTRUCTORS - Original Elements
// ============================================================
function Dirt(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#732A19":"#662516"; }
function Sand(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#E8CB87":"#E0C37E"; }
function Ash(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#828282":"#919090"; }
function AntiPowder(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#FF00FF":"#E802E8"; }
function AntiLiquid(gx, gy) { this.x=gx; this.y=gy; this.direction=Math.random()<.5?1:-1; this.finalColor=Math.random()<.5?"#A128BF":"#AD25CF"; }
function AntiGas(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#c767de":"#b876c9"; this.direction=Math.random()>.5?1:-1; this.frameDelay=3; this.life=250+Math.random()*100; }
function Destroyer(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#404040":"#333333"; }
function Bomb(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#1d612c":"#246d1c"; }
function Stone(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#8F8F8F":"#7D7C7C"; }
function Wood(gx, gy) { this.x=gx; this.y=gy; this.temp=20; this.finalColor=Math.random()<.5?"#6B510E":"#5C450C"; }
function Cloner(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#A9AB65":"#9A9C5C"; }
function Acid(gx, gy) { this.x=gx; this.y=gy; this.direction=Math.random()<.5?1:-1; this.finalColor=Math.random()<.5?"#00FF04":"#02EB06"; }
function Water(gx, gy) { this.x=gx; this.y=gy; this.temp=17; this.color="#1E90FF"; this.direction=Math.random()>.5?1:-1; }
function Oil(gx, gy) { this.x=gx; this.y=gy; this.temp=20; this.finalColor=Math.random()<.5?"#4a3800":"#3d2f00"; this.direction=Math.random()>.5?1:-1; }
function Fire(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#FF4900":"#F04602"; this.direction=Math.random()>.5?1:-1; this.frameDelay=3; this.life=getRandomInt(50); }
function Heater(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#736251":"#665747"; }
function Steam(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#d1d1d1":"#e8e8e8"; this.direction=Math.random()>.5?1:-1; this.frameDelay=3; this.life=250+Math.random()*100; }

// ============================================================
// CONSTRUCTORS - 20 New Elements
// ============================================================
function Snow(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#FFFFFF":"#E8F0FF"; }
function Ice(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#A0D8EF":"#88C8E0"; }
function Lava(gx, gy) { this.x=gx; this.y=gy; this.finalColor="#FF4500"; this.direction=Math.random()>.5?1:-1; }
function Obsidian(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#1a0a2e":"#2a1040"; }
function Glass(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#c8eef5":"#d6f4f9"; }
function Gunpowder(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#2f2f2f":"#1a1a1a"; }
function Fuse(gx, gy) { this.x=gx; this.y=gy; this.burning=false; this.burnTimer=0; this.finalColor=Math.random()<.5?"#8B4513":"#7a3b10"; }
function TNT(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#cc0000":"#bb0000"; }
function Rubber(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#1a1a1a":"#2b2b2b"; }
function Sponge(gx, gy) { this.x=gx; this.y=gy; this.absorbed=0; this.finalColor=Math.random()<.5?"#d4aa00":"#c9a200"; }
function Smoke(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#555555":"#666666"; this.direction=Math.random()>.5?1:-1; this.frameDelay=4; this.life=180+Math.random()*120; }
function ToxicGas(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#88dd00":"#77cc00"; this.direction=Math.random()>.5?1:-1; this.frameDelay=3; this.life=200+Math.random()*100; }
function Virus(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#ff00aa":"#ee0099"; this.spreadTimer=0; }
function Salt(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#F5F5F5":"#EEEEEE"; }
function Saltwater(gx, gy) { this.x=gx; this.y=gy; this.temp=17; this.finalColor=Math.random()<.5?"#4488cc":"#3377bb"; this.direction=Math.random()>.5?1:-1; }
function Concrete(gx, gy) { this.x=gx; this.y=gy; this.hardened=false; this.hardenTimer=180+Math.random()*60; this.finalColor=Math.random()<.5?"#aaaaaa":"#999999"; this.direction=Math.random()>.5?1:-1; }
function Cooler(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#00ccff":"#00aaee"; }
function Methane(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#aaffaa":"#99ee99"; this.direction=Math.random()>.5?1:-1; this.frameDelay=2; this.life=300+Math.random()*100; }
function Mud(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#4a2c00":"#3d2500"; }
function Plasma(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#ee44ff":"#cc22ee"; this.direction=Math.random()>.5?1:-1; this.frameDelay=1; this.life=80+Math.random()*40; }

// ============================================================
// HELPERS
// ============================================================
function removeParticle(p) {
    if (grid[p.x] && grid[p.x][p.y] === p) grid[p.x][p.y] = null;
    p.isDead = true;
}

const DIRS = [[0,1],[0,-1],[1,0],[-1,0]];

function isNextTo(p, T) {
    for (let [dx,dy] of DIRS) {
        let nx=p.x+dx, ny=p.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&grid[nx][ny] instanceof T) return true;
    }
    return false;
}
function getNeighbor(p, T) {
    for (let [dx,dy] of DIRS) {
        let nx=p.x+dx, ny=p.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&grid[nx][ny] instanceof T) return grid[nx][ny];
    }
    return null;
}

// Assign destroy to all types
const ALL_TYPES = [Dirt,Sand,Ash,AntiPowder,AntiLiquid,AntiGas,Destroyer,Bomb,Stone,Wood,Cloner,Acid,Water,Oil,Fire,Heater,Steam,
    Snow,Ice,Lava,Obsidian,Glass,Gunpowder,Fuse,TNT,Rubber,Sponge,Smoke,ToxicGas,Virus,Salt,Saltwater,Concrete,Cooler,Methane,Mud,Plasma];
ALL_TYPES.forEach(T => { T.prototype.destroy = function() { removeParticle(this); }; });

// Standard powder fall (falls down, displaces water/oil)
function powderFall(p) {
    let ny = p.y+1;
    if (ny>=gridHeight) return;
    let t=grid[p.x][ny];
    if (t===null||t instanceof Water||t instanceof Oil) {
        grid[p.x][p.y]=null;
        if (t instanceof Water||t instanceof Oil) { t.y=p.y; grid[p.x][t.y]=t; }
        p.y=ny; grid[p.x][p.y]=p;
    } else {
        let dirs=[p.x-1,p.x+1];
        if (Math.random()>.5) dirs.reverse();
        for (let nx of dirs) {
            if (nx>=0&&nx<gridWidth) {
                let st=grid[nx][ny];
                if (st===null||st instanceof Water) {
                    grid[p.x][p.y]=null;
                    if (st instanceof Water) { st.x=p.x; st.y=p.y; grid[p.x][p.y]=st; }
                    p.x=nx; p.y=ny; grid[p.x][p.y]=p; break;
                }
            }
        }
    }
}

// Standard liquid flow (falls, then flows sideways)
function liquidFlow(p) {
    let ny=p.y+1;
    if (ny<gridHeight&&grid[p.x][ny]===null) {
        grid[p.x][p.y]=null; p.y=ny; grid[p.x][p.y]=p;
    } else {
        let nx=p.x+p.direction;
        if (nx>=0&&nx<gridWidth&&grid[nx][p.y]===null) {
            grid[p.x][p.y]=null; p.x=nx; grid[p.x][p.y]=p;
        } else { p.direction*=-1; }
    }
}

// Standard gas rise
function gasRise(p) {
    let ny=p.y-1;
    if (ny>=0&&grid[p.x][ny]===null) {
        grid[p.x][p.y]=null; p.y=ny; grid[p.x][p.y]=p; return;
    }
    let nx=p.x+p.direction;
    if (nx>=0&&nx<gridWidth&&grid[nx][p.y]===null) {
        grid[p.x][p.y]=null; p.x=nx; grid[p.x][p.y]=p;
    } else { p.direction*=-1; }
}

// ============================================================
// UPDATE - Original Elements
// ============================================================
Dirt.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)) { this.destroy(); return; }
    if (isNextTo(this,Water)&&Math.random()<.02) {
        const cx=this.x,cy=this.y; this.destroy();
        let m=new Mud(cx,cy); particles.push(m); grid[cx][cy]=m; return;
    }
    powderFall(this);
};
Dirt.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

AntiPowder.prototype.update = function() {
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
            let n=grid[nx][ny];
            if (n instanceof Destroyer||n instanceof Acid||n instanceof Plasma) { this.destroy(); return; }
        }
    }
    // Fall upward
    let ny=this.y-1;
    if (ny>=0) {
        let t=grid[this.x][ny];
        if (t===null||t instanceof Water||t instanceof Oil||t instanceof AntiLiquid) {
            grid[this.x][this.y]=t;
            if (t) t.y=this.y;
            this.y=ny; grid[this.x][this.y]=this;
        } else {
            let dirs=[this.x-1,this.x+1];
            if (Math.random()>.5) dirs.reverse();
            for (let nx2 of dirs) {
                if (nx2>=0&&nx2<gridWidth) {
                    let st=grid[nx2][ny];
                    if (st===null||st instanceof Water||st instanceof Oil) {
                        grid[this.x][this.y]=st;
                        if (st) { st.x=this.x; st.y=this.y; }
                        this.x=nx2; this.y=ny; grid[this.x][this.y]=this; break;
                    }
                }
            }
        }
    }
};
AntiPowder.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Ash.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)) { this.destroy(); return; }
    powderFall(this);
};
Ash.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Stone.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)) { this.destroy(); return; }
    if (isNextTo(this,Acid)&&Math.random()<.05) { this.destroy(); return; }
    if (isNextTo(this,Lava)&&Math.random()<.005) {
        const cx=this.x,cy=this.y; this.destroy();
        let lv=new Lava(cx,cy); particles.push(lv); grid[cx][cy]=lv; return;
    }
};
Stone.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Bomb.prototype.update = function() {
    if (isNextTo(this,Destroyer)) { this.destroy(); return; }
    let ny=this.y+1;
    if (ny<gridHeight&&grid[this.x][ny]===null) { grid[this.x][this.y]=null; this.y=ny; grid[this.x][this.y]=this; }
    if (isNextTo(this,Fire)||isNextTo(this,Heater)||isNextTo(this,Lava)||isNextTo(this,Plasma)) {
        let bx=this.x,by=this.y; this.destroy();
        for (let i=-20;i<=20;i++) for (let j=-20;j<=20;j++) {
            let nx=bx+i,ny2=by+j;
            if (nx>=0&&nx<gridWidth&&ny2>=0&&ny2<gridHeight) {
                if (grid[nx][ny2]) particles=particles.filter(p=>p!==grid[nx][ny2]);
                let f=new Fire(nx,ny2); particles.push(f); grid[nx][ny2]=f;
            }
        }
    }
};
Bomb.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Destroyer.prototype.update = function() {};
Destroyer.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Wood.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextTo(this,Heater)||isNextTo(this,Lava)) { this.temp+=12; }
    else if (this.temp>20) { this.temp-=0.5; }
    if (this.temp>=100) {
        const cx=this.x,cy=this.y; this.destroy();
        let fre=new Fire(cx,cy); particles.push(fre); grid[cx][cy]=fre;
        let ash=new Ash(cx,cy); particles.push(ash); grid[cx][cy]=ash; return;
    }
    // Emit smoke while on fire
    if (this.temp>60&&Math.random()<0.02) {
        let sy=this.y-1;
        if (sy>=0&&grid[this.x][sy]===null) {
            let sm=new Smoke(this.x,sy); particles.push(sm); grid[this.x][sy]=sm;
        }
    }
};
Wood.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Heater.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)) { this.destroy(); return; }
};
Heater.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Sand.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,ToxicGas)||isNextTo(this,Plasma)) { this.destroy(); return; }
    if ((isNextTo(this,Heater)||isNextTo(this,Lava))&&Math.random()<.01) {
        const cx=this.x,cy=this.y; this.destroy();
        let gl=new Glass(cx,cy); particles.push(gl); grid[cx][cy]=gl; return;
    }
    if (!this.isWet) {
        for (let [dx,dy] of DIRS) {
            let nx=this.x+dx,ny=this.y+dy;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&grid[nx][ny] instanceof Water) {
                this.moisture=(this.moisture||0)+1;
                if (this.moisture>30) { this.isWet=true; this.finalColor="#b89a5a"; }
                break;
            }
        }
    }
    powderFall(this);
};
Sand.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Water.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)) { this.destroy(); return; }
    let saltN=getNeighbor(this,Salt);
    if (saltN&&Math.random()<.05) {
        saltN.destroy();
        const cx=this.x,cy=this.y; this.destroy();
        let sw=new Saltwater(cx,cy); particles.push(sw); grid[cx][cy]=sw; return;
    }
    if (isNextTo(this,Cooler)&&Math.random()<.05) {
        const cx=this.x,cy=this.y; this.destroy();
        let ic=new Ice(cx,cy); particles.push(ic); grid[cx][cy]=ic; return;
    }
    if (isNextTo(this,Lava)&&Math.random()<.1) {
        const cx=this.x,cy=this.y; this.destroy();
        let st=new Steam(cx,cy); particles.push(st); grid[cx][cy]=st; return;
    }
    let htg=isNextTo(this,Fire)||isNextTo(this,Heater)||isNextTo(this,Lava);
    if (htg) { this.temp+=10; } else if (this.temp>17) { this.temp-=0.5; }
    if (this.temp>=100) {
        const cx=this.x,cy=this.y; this.destroy();
        let ws=new Steam(cx,cy); particles.push(ws); grid[cx][cy]=ws; return;
    }
    liquidFlow(this);
};
Water.prototype.draw = function() { ctx.fillStyle=this.color; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

AntiLiquid.prototype.update = function() {
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
            let n=grid[nx][ny];
            if (n instanceof Destroyer||n instanceof Acid||n instanceof Plasma) { this.destroy(); return; }
        }
    }
    // Rise upward like a liquid
    let ny=this.y-1;
    if (ny>=0&&grid[this.x][ny]===null) {
        grid[this.x][this.y]=null; this.y=ny; grid[this.x][this.y]=this;
    } else {
        let nx=this.x+this.direction;
        if (nx>=0&&nx<gridWidth&&grid[nx][this.y]===null) {
            grid[this.x][this.y]=null; this.x=nx; grid[this.x][this.y]=this;
        } else { this.direction*=-1; }
    }
};
AntiLiquid.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// ACID FIX: properly dissolves neighbors, slowly self-consumes
Acid.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)) { this.destroy(); return; }
    const immune=[Destroyer,Acid,Glass,Rubber,Obsidian,Cooler];
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
            let nb=grid[nx][ny];
            if (nb&&!immune.some(T=>nb instanceof T)&&Math.random()<.03) {
                nb.destroy();
                if (Math.random()<.3) { this.destroy(); return; }
                break;
            }
        }
    }
    if (this.isDead) return;
    liquidFlow(this);
};
Acid.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// OIL FIX: floats on water, proper dark color, ignites correctly
Oil.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextTo(this,Heater)||isNextTo(this,Lava)) { this.temp+=10; }
    else if (this.temp>20) { this.temp-=0.5; }
    if (this.temp>=150) {
        const cx=this.x,cy=this.y; let r = getRandomInt(20); if(r ===1){this.destroy();}
        let fie=new Fire(cx,cy); particles.push(fie); grid[cx][cy]=fie; return;
    }
    let ny=this.y+1;
    if (ny<gridHeight) {
        let below=grid[this.x][ny];
        if (below===null) {
            grid[this.x][this.y]=null; this.y=ny; grid[this.x][this.y]=this;
        } else if (below instanceof Water) {
            // Oil is lighter: float up above water
            let ay=this.y-1;
            if (ay>=0&&grid[this.x][ay]===null) {
                grid[this.x][this.y]=null; this.y=ay; grid[this.x][this.y]=this;
            } else {
                let nx2=this.x+this.direction;
                if (nx2>=0&&nx2<gridWidth&&grid[nx2][this.y]===null) {
                    grid[this.x][this.y]=null; this.x=nx2; grid[this.x][this.y]=this;
                } else { this.direction*=-1; }
            }
        } else {
            let nx2=this.x+this.direction;
            if (nx2>=0&&nx2<gridWidth&&grid[nx2][this.y]===null) {
                grid[this.x][this.y]=null; this.x=nx2; grid[this.x][this.y]=this;
            } else { this.direction*=-1; }
        }
    } else {
        let nx2=this.x+this.direction;
        if (nx2>=0&&nx2<gridWidth&&grid[nx2][this.y]===null) {
            grid[this.x][this.y]=null; this.x=nx2; grid[this.x][this.y]=this;
        } else { this.direction*=-1; }
    }
};
Oil.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Steam.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)) { this.destroy(); return; }
    this.life--;
    if (this.life<=0) { this.destroy(); return; }
    if (frameCount%this.frameDelay!==0) return;
    let ny=this.y-1;
    if (ny>=0) {
        let t=grid[this.x][ny];
        if (t===null||t instanceof Water||t instanceof Oil) {
            grid[this.x][this.y]=null;
            if (t instanceof Water||t instanceof Oil) { t.y=this.y; grid[this.x][t.y]=t; }
            this.y=ny; grid[this.x][this.y]=this; return;
        }
    }
    let nx=this.x+this.direction;
    if (nx>=0&&nx<gridWidth&&grid[nx][this.y]===null) {
        grid[this.x][this.y]=null; this.x=nx; grid[this.x][this.y]=this;
    } else { this.direction*=-1; }
};
Steam.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

AntiGas.prototype.update = function() {
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&(grid[nx][ny] instanceof Destroyer||grid[nx][ny] instanceof Plasma)) { this.destroy(); return; }
    }
    this.life--; if (this.life<=0) { this.destroy(); return; }
    if (frameCount%this.frameDelay!==0) return;
    // Descends
    let ny=this.y+1;
    if (ny<gridHeight&&grid[this.x][ny]===null) {
        grid[this.x][this.y]=null; this.y=ny; grid[this.x][this.y]=this; return;
    }
    let nx=this.x+this.direction;
    if (nx>=0&&nx<gridWidth&&grid[nx][this.y]===null) {
        grid[this.x][this.y]=null; this.x=nx; grid[this.x][this.y]=this;
    } else { this.direction*=-1; }
};
AntiGas.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Fire.prototype.update = function() {
    if (isNextTo(this,Destroyer)) { this.destroy(); return; }
    this.life--; if (this.life<=0) { this.destroy(); return; }
    if (frameCount%this.frameDelay!==0) return;
    let ny=this.y-1;
    if (ny>=0) {
        let t=grid[this.x][ny];
        if (t===null||t instanceof Water||t instanceof Oil) {
            grid[this.x][this.y]=null;
            if (t instanceof Water||t instanceof Oil) { t.y=this.y; grid[this.x][t.y]=t; }
            this.y=ny; grid[this.x][this.y]=this; return;
        }
    }
    let nx=this.x+this.direction;
    if (nx>=0&&nx<gridWidth&&grid[nx][this.y]===null) {
        grid[this.x][this.y]=null; this.x=nx; grid[this.x][this.y]=this;
    } else { this.direction*=-1; }
};
Fire.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Cloner.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)) { this.destroy(); return; }
    let src=null;
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
            let n=grid[nx][ny];
            if (n&&!(n instanceof Cloner)&&!(n instanceof Stone)&&!(n instanceof Wood)) { src=n; break; }
        }
    }
    if (src) {
        for (let sy of [this.y-1,this.y+1]) {
            if (sy>=0&&sy<gridHeight&&grid[this.x][sy]===null) {
                let c=new src.constructor(this.x,sy); particles.push(c); grid[this.x][sy]=c;
            }
        }
    }
};
Cloner.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// ============================================================
// UPDATE - 20 New Elements
// ============================================================

// SNOW - powder, melts near heat
Snow.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,ToxicGas)||isNextTo(this,Plasma)) { this.destroy(); return; }
    if ((isNextTo(this,Fire)||isNextTo(this,Heater)||isNextTo(this,Lava))&&Math.random()<.05) {
        const cx=this.x,cy=this.y; this.destroy();
        let w=new Water(cx,cy); particles.push(w); grid[cx][cy]=w; return;
    }
    powderFall(this);
};
Snow.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// ICE - solid, melts near heat into water, water near cooler turns to ice
Ice.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)) { this.destroy(); return; }
    if ((isNextTo(this,Fire)||isNextTo(this,Heater)||isNextTo(this,Lava))&&Math.random()<.02) {
        const cx=this.x,cy=this.y; this.destroy();
        let w=new Water(cx,cy); particles.push(w); grid[cx][cy]=w; return;
    }
};
Ice.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// LAVA - liquid, solidifies on water contact, emits light
Lava.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)) { this.destroy(); return; }
    if (isNextTo(this,Water)&&Math.random()<.08) {
        const cx=this.x,cy=this.y; this.destroy();
        let ob=new Obsidian(cx,cy); particles.push(ob); grid[cx][cy]=ob; return;
    }
    if (isNextTo(this,Cooler)&&Math.random()<.05) {
        const cx=this.x,cy=this.y; this.destroy();
        let st=new Stone(cx,cy); particles.push(st); grid[cx][cy]=st; return;
    }
    // Emit smoke
    if (Math.random()<0.01) {
        let sy=this.y-1;
        if (sy>=0&&grid[this.x][sy]===null) { let sm=new Smoke(this.x,sy); particles.push(sm); grid[this.x][sy]=sm; }
    }
    liquidFlow(this);
};
Lava.prototype.draw = function() {
    const g=Math.floor(50+Math.random()*50);
    ctx.fillStyle=`rgb(255,${g},0)`;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
};

// OBSIDIAN - solid, very resistant
Obsidian.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)) { this.destroy(); return; }
};
Obsidian.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// GLASS - solid, transparent, immune to acid, made from sand+heat
Glass.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)) { this.destroy(); return; }
};
Glass.prototype.draw = function() {
    ctx.globalAlpha=0.55;
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// GUNPOWDER - powder, explodes on fire contact
Gunpowder.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextTo(this,Lava)) {
        let bx=this.x,by=this.y; this.destroy();
        for (let i=-4;i<=4;i++) for (let j=-4;j<=4;j++) {
            if (i*i+j*j>16) continue;
            let nx=bx+i,ny=by+j;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
                if (grid[nx][ny]) particles=particles.filter(p=>p!==grid[nx][ny]);
                let f=new Fire(nx,ny); particles.push(f); grid[nx][ny]=f;
            }
        }
        return;
    }
    powderFall(this);
};
Gunpowder.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// FUSE - solid, burns slowly and propagates
Fuse.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)) { this.destroy(); return; }
    if (!this.burning&&(isNextTo(this,Fire)||isNextTo(this,Lava))) this.burning=true;
    if (this.burning) {
        this.burnTimer++;
        this.finalColor=this.burnTimer%4<2?"#ff6600":"#cc4400";
        if (this.burnTimer>30) {
            const cx=this.x,cy=this.y; this.destroy();
            for (let [dx,dy] of DIRS) {
                let nx=cx+dx,ny=cy+dy;
                if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&grid[nx][ny] instanceof Fuse) grid[nx][ny].burning=true;
            }
            let f=new Fire(cx,cy); particles.push(f); grid[cx][cy]=f;
        }
    }
};
Fuse.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// TNT - solid, BIG explosion
TNT.prototype.update = function() {
    if (isNextTo(this,Destroyer)) { this.destroy(); return; }
    let ny=this.y+1;
    if (ny<gridHeight&&grid[this.x][ny]===null) { grid[this.x][this.y]=null; this.y=ny; grid[this.x][this.y]=this; }
    if (isNextTo(this,Fire)||isNextTo(this,Heater)||isNextTo(this,Lava)||isNextTo(this,Plasma)) {
        let bx=this.x,by=this.y; this.destroy();
        for (let i=-10;i<=10;i++) for (let j=-10;j<=10;j++) {
            if (i*i+j*j>100) continue;
            let nx=bx+i,ny2=by+j;
            if (nx>=0&&nx<gridWidth&&ny2>=0&&ny2<gridHeight) {
                if (grid[nx][ny2]) particles=particles.filter(p=>p!==grid[nx][ny2]);
                let f=new Fire(nx,ny2); particles.push(f); grid[nx][ny2]=f;
            }
        }
    }
};
TNT.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// RUBBER - solid, immune to acid and fire
Rubber.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)) { this.destroy(); return; }
};
Rubber.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// SPONGE - solid, absorbs water
Sponge.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)) { this.destroy(); return; }
    if (this.absorbed<20) {
        for (let [dx,dy] of DIRS) {
            let nx=this.x+dx,ny=this.y+dy;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
                let n=grid[nx][ny];
                if ((n instanceof Water||n instanceof Saltwater)&&Math.random()<.1) {
                    n.destroy(); this.absorbed++;
                    const t=Math.min(1,this.absorbed/20);
                    this.finalColor=`rgb(${Math.floor(212-t*80)},${Math.floor(162-t*60)},0)`;
                    break;
                }
            }
        }
    }
};
Sponge.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// SMOKE - rises, fades
Smoke.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)) { this.destroy(); return; }
    this.life--; if (this.life<=0) { this.destroy(); return; }
    if (frameCount%this.frameDelay!==0) return;
    gasRise(this);
};
Smoke.prototype.draw = function() {
    ctx.globalAlpha=Math.max(0.1,this.life/300);
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// TOXIC GAS - rises, slowly destroys organics
ToxicGas.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)) { this.destroy(); return; }
    this.life--; if (this.life<=0) { this.destroy(); return; }
    const safe=[ToxicGas,Destroyer,Stone,Wood,Rubber,Glass,Obsidian,Cooler,Heater,Ice,Concrete];
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
            let n=grid[nx][ny];
            if (n&&!safe.some(T=>n instanceof T)&&Math.random()<.005) { n.destroy(); break; }
        }
    }
    if (frameCount%this.frameDelay!==0) return;
    gasRise(this);
};
ToxicGas.prototype.draw = function() {
    ctx.globalAlpha=Math.max(0.15,this.life/300);
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// VIRUS - spreads to adjacent cells
Virus.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Fire)) { this.destroy(); return; }
    this.spreadTimer++;
    if (this.spreadTimer>20) {
        this.spreadTimer=0;
        const safe=[Virus,Destroyer,Stone,Rubber,Glass,Obsidian,Concrete];
        for (let [dx,dy] of DIRS) {
            let nx=this.x+dx,ny=this.y+dy;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
                let n=grid[nx][ny];
                if (n&&!safe.some(T=>n instanceof T)&&Math.random()<.3) {
                    n.destroy();
                    let v=new Virus(nx,ny); particles.push(v); grid[nx][ny]=v; break;
                }
            }
        }
    }
    let ny=this.y+1;
    if (ny<gridHeight&&grid[this.x][ny]===null) { grid[this.x][this.y]=null; this.y=ny; grid[this.x][this.y]=this; }
};
Virus.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// SALT - powder, dissolves in water to make saltwater
Salt.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,ToxicGas)) { this.destroy(); return; }
    if (isNextTo(this,Water)&&Math.random()<.02) { this.destroy(); return; }
    powderFall(this);
};
Salt.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// SALTWATER - liquid, evaporates at higher temp leaving salt
Saltwater.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextTo(this,Heater)||isNextTo(this,Lava)) { this.temp+=10; }
    else if (this.temp>17) { this.temp-=0.5; }
    if (this.temp>=110) {
        const cx=this.x,cy=this.y; this.destroy();
        let st=new Steam(cx,cy); particles.push(st); grid[cx][cy]=st;
        if (Math.random()<.5) {
            for (let [dx,dy] of DIRS) {
                let nx=cx+dx,ny=cy+dy;
                if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&grid[nx][ny]===null) {
                    let s=new Salt(nx,ny); particles.push(s); grid[nx][ny]=s; break;
                }
            }
        }
        return;
    }
    liquidFlow(this);
};
Saltwater.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// CONCRETE - liquid that hardens into solid
Concrete.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)) { this.destroy(); return; }
    this.hardenTimer--;
    if (this.hardenTimer<=0&&!this.hardened) { this.hardened=true; this.finalColor=Math.random()<.5?"#888888":"#777777"; }
    if (this.hardened) return;
    liquidFlow(this);
};
Concrete.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// COOLER - solid, freezes water, cools lava to stone
Cooler.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)) { this.destroy(); return; }
    if (isNextTo(this,Lava)&&Math.random()<.01) {
        let lv=getNeighbor(this,Lava);
        if (lv) { const lx=lv.x,ly=lv.y; lv.destroy(); let st=new Stone(lx,ly); particles.push(st); grid[lx][ly]=st; }
    }
};
Cooler.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// METHANE - gas, rises, explodes on ignition
Methane.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextTo(this,Lava)||isNextTo(this,Heater)) {
        let bx=this.x,by=this.y; this.destroy();
        for (let i=-6;i<=6;i++) for (let j=-6;j<=6;j++) {
            if (i*i+j*j>36) continue;
            let nx=bx+i,ny=by+j;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
                let n=grid[nx][ny];
                if (n&&!(n instanceof Stone)&&!(n instanceof Obsidian)&&!(n instanceof Rubber)&&!(n instanceof Glass)) {
                    particles=particles.filter(p=>p!==n); grid[nx][ny]=null;
                }
                if (!grid[nx][ny]) { let f=new Fire(nx,ny); particles.push(f); grid[nx][ny]=f; }
            }
        }
        return;
    }
    this.life--; if (this.life<=0) { this.destroy(); return; }
    if (frameCount%this.frameDelay!==0) return;
    gasRise(this);
};
Methane.prototype.draw = function() {
    ctx.globalAlpha=Math.max(0.2,this.life/400);
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// MUD - slow powder, dries into dirt near heat
Mud.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)) { this.destroy(); return; }
    if ((isNextTo(this,Fire)||isNextTo(this,Heater)||isNextTo(this,Lava))&&Math.random()<.005) {
        const cx=this.x,cy=this.y; this.destroy();
        let d=new Dirt(cx,cy); particles.push(d); grid[cx][cy]=d; return;
    }
    if (frameCount%3!==0) return;
    let ny=this.y+1;
    if (ny<gridHeight&&grid[this.x][ny]===null) {
        grid[this.x][this.y]=null; this.y=ny; grid[this.x][this.y]=this;
    } else {
        let dirs=[this.x-1,this.x+1];
        if (Math.random()>.5) dirs.reverse();
        for (let nx of dirs) {
            if (nx>=0&&nx<gridWidth&&grid[nx][ny]===null&&Math.random()<.3) {
                grid[this.x][this.y]=null; this.x=nx; this.y=ny; grid[this.x][this.y]=this; break;
            }
        }
    }
};
Mud.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// PLASMA - fast, destroys almost everything, fades
Plasma.prototype.update = function() {
    if (isNextTo(this,Destroyer)) { this.destroy(); return; }
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
            let n=grid[nx][ny];
            if (n&&!(n instanceof Plasma)&&!(n instanceof Destroyer)&&!(n instanceof Obsidian)&&Math.random()<.15) {
                n.destroy(); break;
            }
        }
    }
    this.life--; if (this.life<=0) { this.destroy(); return; }
    if (frameCount%this.frameDelay!==0) return;
    let ny=this.y-1;
    if (ny>=0&&grid[this.x][ny]===null) {
        grid[this.x][this.y]=null; this.y=ny; grid[this.x][this.y]=this; return;
    }
    let nx=this.x+this.direction;
    if (nx>=0&&nx<gridWidth&&grid[nx][this.y]===null) {
        grid[this.x][this.y]=null; this.x=nx; grid[this.x][this.y]=this;
    } else { this.direction*=-1; }
};
Plasma.prototype.draw = function() {
    ctx.globalAlpha=Math.max(0.3,this.life/120);
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// ============================================================
// ERASE
// ============================================================
function erase(x, y) {
    const gx=Math.floor(x/cellSize), gy=Math.floor(y/cellSize);
    if (gx>=0&&gx<gridWidth&&gy>=0&&gy<gridHeight) {
        const t=grid[gx][gy];
        if (t!==null) { particles.splice(particles.indexOf(t),1); grid[gx][gy]=null; }
    }
}

// ============================================================
// SPAWN (universal helper + all functions)
// ============================================================
function spawnParticle(x, y, Ctor) {
    const gx=Math.floor(x/cellSize), gy=Math.floor(y/cellSize);
    if (gx>=0&&gx<gridWidth&&gy>=0&&gy<gridHeight&&grid[gx][gy]===null) {
        let p=new Ctor(gx,gy); particles.push(p); grid[gx][gy]=p;
    }
}
function spawnDirt(x,y){spawnParticle(x,y,Dirt);}
function spawnAntiPowder(x,y){spawnParticle(x,y,AntiPowder);}
function spawnAntiLiquid(x,y){spawnParticle(x,y,AntiLiquid);}
function spawnAntiGas(x,y){spawnParticle(x,y,AntiGas);}
function spawnDestroyer(x,y){spawnParticle(x,y,Destroyer);}
function spawnStone(x,y){spawnParticle(x,y,Stone);}
function spawnWood(x,y){spawnParticle(x,y,Wood);}
function spawnBomb(x,y){spawnParticle(x,y,Bomb);}
function spawnHeater(x,y){spawnParticle(x,y,Heater);}
function spawnSand(x,y){spawnParticle(x,y,Sand);}
function spawnAsh(x,y){spawnParticle(x,y,Ash);}
function spawnWater(x,y){spawnParticle(x,y,Water);}
function spawnAcid(x,y){spawnParticle(x,y,Acid);}
function spawnOil(x,y){spawnParticle(x,y,Oil);}
function spawnSteam(x,y){spawnParticle(x,y,Steam);}
function spawnFire(x,y){spawnParticle(x,y,Fire);}
function spawnCloner(x,y){spawnParticle(x,y,Cloner);}
function spawnSnow(x,y){spawnParticle(x,y,Snow);}
function spawnIce(x,y){spawnParticle(x,y,Ice);}
function spawnLava(x,y){spawnParticle(x,y,Lava);}
function spawnObsidian(x,y){spawnParticle(x,y,Obsidian);}
function spawnGlass(x,y){spawnParticle(x,y,Glass);}
function spawnGunpowder(x,y){spawnParticle(x,y,Gunpowder);}
function spawnFuse(x,y){spawnParticle(x,y,Fuse);}
function spawnTNT(x,y){spawnParticle(x,y,TNT);}
function spawnRubber(x,y){spawnParticle(x,y,Rubber);}
function spawnSponge(x,y){spawnParticle(x,y,Sponge);}
function spawnSmoke(x,y){spawnParticle(x,y,Smoke);}
function spawnToxicGas(x,y){spawnParticle(x,y,ToxicGas);}
function spawnVirus(x,y){spawnParticle(x,y,Virus);}
function spawnSalt(x,y){spawnParticle(x,y,Salt);}
function spawnSaltwater(x,y){spawnParticle(x,y,Saltwater);}
function spawnConcrete(x,y){spawnParticle(x,y,Concrete);}
function spawnCooler(x,y){spawnParticle(x,y,Cooler);}
function spawnMethane(x,y){spawnParticle(x,y,Methane);}
function spawnMud(x,y){spawnParticle(x,y,Mud);}
function spawnPlasma(x,y){spawnParticle(x,y,Plasma);}

// ============================================================
// SELECTION
// ============================================================
function setSelected(n) { selected=n; document.body.style.cursor=n==="erase"?"not-allowed":"pointer"; }
function eraseSelected(){setSelected("erase");}
function dirtSelected(){setSelected("dirt");}
function stoneSelected(){setSelected("stone");}
function ashSelected(){setSelected("ash");}
function bombSelected(){setSelected("bomb");}
function oilSelected(){setSelected("oil");}
function destroyerSelected(){setSelected("destroyer");}
function woodSelected(){setSelected("wood");}
function clonerSelected(){setSelected("cloner");}
function heaterSelected(){setSelected("heater");}
function sandSelected(){setSelected("sand");}
function waterSelected(){setSelected("water");}
function acidSelected(){setSelected("acid");}
function antipowderSelected(){setSelected("antipowder");}
function antiliquidSelected(){setSelected("antiliquid");}
function antigasSelected(){setSelected("antigas");}
function steamSelected(){setSelected("steam");}
function fireSelected(){setSelected("fire");}
function snowSelected(){setSelected("snow");}
function iceSelected(){setSelected("ice");}
function lavaSelected(){setSelected("lava");}
function obsidianSelected(){setSelected("obsidian");}
function glassSelected(){setSelected("glass");}
function gunpowderSelected(){setSelected("gunpowder");}
function fuseSelected(){setSelected("fuse");}
function tntSelected(){setSelected("tnt");}
function rubberSelected(){setSelected("rubber");}
function spongeSelected(){setSelected("sponge");}
function smokeSelected(){setSelected("smoke");}
function toxicgasSelected(){setSelected("toxicgas");}
function virusSelected(){setSelected("virus");}
function saltSelected(){setSelected("salt");}
function saltwaterSelected(){setSelected("saltwater");}
function concreteSelected(){setSelected("concrete");}
function coolerSelected(){setSelected("cooler");}
function methaneSelected(){setSelected("methane");}
function mudSelected(){setSelected("mud");}
function plasmaSelected(){setSelected("plasma");}

// ============================================================
// MOUSE
// ============================================================
let isMouseDown=false, mouseX=0, mouseY=0;
canvas.addEventListener('mousedown',(e)=>{isMouseDown=true;updateMousePos(e);document.body.style.cursor="grab";});
window.addEventListener('mouseup',()=>isMouseDown=false);
canvas.addEventListener('mousemove',(e)=>updateMousePos(e));
function updateMousePos(e){const r=canvas.getBoundingClientRect();mouseX=e.clientX-r.left;mouseY=e.clientY-r.top;}

// ============================================================
// MAIN LOOP
// ============================================================
function update() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    frameCount++;
    if (isMouseDown) {
        if(selected==="dirt")spawnDirt(mouseX,mouseY);
        if(selected==="sand")spawnSand(mouseX,mouseY);
        if(selected==="ash")spawnAsh(mouseX,mouseY);
        if(selected==="stone")spawnStone(mouseX,mouseY);
        if(selected==="destroyer")spawnDestroyer(mouseX,mouseY);
        if(selected==="wood")spawnWood(mouseX,mouseY);
        if(selected==="water")spawnWater(mouseX,mouseY);
        if(selected==="steam")spawnSteam(mouseX,mouseY);
        if(selected==="antiliquid")spawnAntiLiquid(mouseX,mouseY);
        if(selected==="antigas")spawnAntiGas(mouseX,mouseY);
        if(selected==="fire")spawnFire(mouseX,mouseY);
        if(selected==="heater")spawnHeater(mouseX,mouseY);
        if(selected==="bomb")spawnBomb(mouseX,mouseY);
        if(selected==="antipowder")spawnAntiPowder(mouseX,mouseY);
        if(selected==="cloner")spawnCloner(mouseX,mouseY);
        if(selected==="oil")spawnOil(mouseX,mouseY);
        if(selected==="acid")spawnAcid(mouseX,mouseY);
        if(selected==="erase")erase(mouseX,mouseY);
        if(selected==="snow")spawnSnow(mouseX,mouseY);
        if(selected==="ice")spawnIce(mouseX,mouseY);
        if(selected==="lava")spawnLava(mouseX,mouseY);
        if(selected==="obsidian")spawnObsidian(mouseX,mouseY);
        if(selected==="glass")spawnGlass(mouseX,mouseY);
        if(selected==="gunpowder")spawnGunpowder(mouseX,mouseY);
        if(selected==="fuse")spawnFuse(mouseX,mouseY);
        if(selected==="tnt")spawnTNT(mouseX,mouseY);
        if(selected==="rubber")spawnRubber(mouseX,mouseY);
        if(selected==="sponge")spawnSponge(mouseX,mouseY);
        if(selected==="smoke")spawnSmoke(mouseX,mouseY);
        if(selected==="toxicgas")spawnToxicGas(mouseX,mouseY);
        if(selected==="virus")spawnVirus(mouseX,mouseY);
        if(selected==="salt")spawnSalt(mouseX,mouseY);
        if(selected==="saltwater")spawnSaltwater(mouseX,mouseY);
        if(selected==="concrete")spawnConcrete(mouseX,mouseY);
        if(selected==="cooler")spawnCooler(mouseX,mouseY);
        if(selected==="methane")spawnMethane(mouseX,mouseY);
        if(selected==="mud")spawnMud(mouseX,mouseY);
        if(selected==="plasma")spawnPlasma(mouseX,mouseY);
    }
    for (let i=particles.length-1;i>=0;i--) particles[i].update();
    for (let i=0;i<particles.length;i++) particles[i].draw();
    particles=particles.filter(p=>!p.isDead);
    requestAnimationFrame(update);
}
update();

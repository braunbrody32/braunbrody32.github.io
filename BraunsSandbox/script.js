const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const cellSize = 10;
const gridWidth = Math.floor(canvas.width / cellSize);
const gridHeight = Math.floor(canvas.height / cellSize);

let paused = false;
let grid = Array.from({ length: gridWidth }, () => Array(gridHeight).fill(null));
let particles = [];
let selected = "none";
let frameCount = 0;

function getRandomInt(max) { return Math.floor(Math.random() * max); }

function pause() {
    paused = !paused;
    const btn = document.getElementById('pause');
    if (btn) {
        btn.textContent = paused ? 'Resume' : 'Pause';
        btn.style.backgroundColor = paused ? '#ff4400' : 'rgb(0, 255, 0)';
        btn.style.color = paused ? 'white' : 'black';
    }
}

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
function Heater(gx, gy) { this.x=gx; this.y=gy; this.powered=false; this.finalColor=Math.random()<.5?"#736251":"#665747"; }
function Steam(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#d1d1d1":"#e8e8e8"; this.direction=Math.random()>.5?1:-1; this.frameDelay=3; this.life=250+Math.random()*100; }

// ============================================================
// CONSTRUCTORS - v1.6 Elements
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
function Cooler(gx, gy) { this.x=gx; this.y=gy; this.powered=false; this.finalColor=Math.random()<.5?"#00ccff":"#00aaee"; }
function Methane(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#aaffaa":"#99ee99"; this.direction=Math.random()>.5?1:-1; this.frameDelay=2; this.life=300+Math.random()*100; }
function Mud(gx, gy) { this.x=gx; this.y=gy; this.heatTimer=0; this.finalColor=Math.random()<.5?"#4a2c00":"#3d2500"; }
function Plasma(gx, gy) { this.x=gx; this.y=gy; this.finalColor=Math.random()<.5?"#ee44ff":"#cc22ee"; this.direction=Math.random()>.5?1:-1; this.frameDelay=1; this.life=80+Math.random()*40; }

// ============================================================
// CONSTRUCTORS - v1.7 Elements (30 new)
// ============================================================
function Charcoal(gx,gy){this.x=gx;this.y=gy;this.burning=false;this.burnTimer=0;this.finalColor=Math.random()<.5?"#1a1a1a":"#222222";}
function Poop(gx,gy){this.x=gx;this.y=gy;this.burning=false;this.burnTimer=0;this.finalColor=Math.random()<.5?"#472917":"#53311c";}
function Sulfur(gx,gy){this.x=gx;this.y=gy;this.finalColor=Math.random()<.5?"#c8b400":"#d4bc00";}
function Coal(gx,gy){this.x=gx;this.y=gy;this.burning=false;this.burnTimer=0;this.finalColor=Math.random()<.5?"#111111":"#191919";}
function Chalk(gx,gy){this.x=gx;this.y=gy;this.finalColor=Math.random()<.5?"#f0f0f0":"#e8e8e8";}
function Gravel(gx,gy){this.x=gx;this.y=gy;this.finalColor=Math.random()<.5?"#787878":"#686868";}
function Steel(gx,gy){this.x=gx;this.y=gy;this.hot=false;this.rustTimer=0;this.finalColor=Math.random()<.5?"#b0b8c0":"#a0a8b0";}
function Diamond(gx,gy){this.x=gx;this.y=gy;this.finalColor=Math.random()<.5?"#c8f0ff":"#d0f4ff";}
function Wax(gx,gy){this.x=gx;this.y=gy;this.finalColor=Math.random()<.5?"#fffacd":"#faf0b0";}
function Ceramic(gx,gy){this.x=gx;this.y=gy;this.finalColor=Math.random()<.5?"#e8d8c0":"#d8c8b0";}
function Brick(gx,gy){this.x=gx;this.y=gy;this.finalColor=Math.random()<.5?"#8B3500":"#7a2a00";}
function Alcohol(gx,gy){this.x=gx;this.y=gy;this.temp=20;this.evapTimer=0;this.direction=Math.random()>.5?1:-1;this.finalColor=Math.random()<.5?"#d4f0ff":"#c0e8ff";}
function Mercury(gx,gy){this.x=gx;this.y=gy;this.direction=Math.random()>.5?1:-1;this.finalColor=Math.random()<.5?"#c8c8cc":"#b8b8bc";}
function Honey(gx,gy){this.x=gx;this.y=gy;this.flowTimer=0;this.direction=Math.random()>.5?1:-1;this.finalColor=Math.random()<.5?"#d4a000":"#c89600";}
function Tar(gx,gy){this.x=gx;this.y=gy;this.temp=20;this.direction=Math.random()>.5?1:-1;this.finalColor=Math.random()<.5?"#0a0a0a":"#141414";}
function Slime(gx,gy){this.x=gx;this.y=gy;this.direction=Math.random()>.5?1:-1;this.finalColor=Math.random()<.5?"#00aa44":"#009933";}
function Hydrogen(gx,gy){this.x=gx;this.y=gy;this.direction=Math.random()>.5?1:-1;this.frameDelay=1;this.life=200+Math.random()*100;this.finalColor=Math.random()<.5?"#eeffee":"#ddfff0";}
function Oxygen(gx,gy){this.x=gx;this.y=gy;this.direction=Math.random()>.5?1:-1;this.frameDelay=2;this.life=250+Math.random()*100;this.finalColor=Math.random()<.5?"#eeeeff":"#e0e0ff";}
function Nitrogen(gx,gy){this.x=gx;this.y=gy;this.direction=Math.random()>.5?1:-1;this.frameDelay=2;this.life=300+Math.random()*100;this.finalColor=Math.random()<.5?"#c0c8ff":"#b0b8ee";}
function Propane(gx,gy){this.x=gx;this.y=gy;this.direction=Math.random()>.5?1:-1;this.frameDelay=2;this.life=250+Math.random()*100;this.finalColor=Math.random()<.5?"#ffffcc":"#ffeeaa";}
function Fog(gx,gy){this.x=gx;this.y=gy;this.direction=Math.random()>.5?1:-1;this.frameDelay=4;this.life=200+Math.random()*100;this.finalColor=Math.random()<.5?"#e8e8e8":"#f0f0f0";}
function Lightning(gx,gy){this.x=gx;this.y=gy;this.life=6+Math.floor(Math.random()*4);this.finalColor="#ffffff";}
function Antimatter(gx,gy){this.x=gx;this.y=gy;this.life=50+Math.floor(Math.random()*40);this.finalColor=Math.random()<.5?"#220022":"#110011";}
function Ember(gx,gy){this.x=gx;this.y=gy;this.direction=Math.random()>.5?1:-1;this.frameDelay=4;this.life=200+Math.floor(Math.random()*150);this.finalColor="#ff6600";}
function Gel(gx,gy){this.x=gx;this.y=gy;this.absorbed=0;this.direction=Math.random()>.5?1:-1;this.finalColor=Math.random()<.5?"#88ff88":"#66ee66";}
function Void(gx,gy){this.x=gx;this.y=gy;this.life=400+Math.floor(Math.random()*200);this.spreadTimer=0;this.finalColor=Math.random()<.5?"#050005":"#080008";}
function Crystal(gx,gy){this.x=gx;this.y=gy;this.growTimer=0;this.finalColor=Math.random()<.5?"#aaffff":"#88eeff";}
function Rust(gx,gy){this.x=gx;this.y=gy;this.finalColor=Math.random()<.5?"#8B4010":"#7a3010";}
function Blood(gx,gy){this.x=gx;this.y=gy;this.direction=Math.random()>.5?1:-1;this.finalColor=Math.random()<.5?"#cc0000":"#aa0000";}
function NitroGel(gx,gy){this.x=gx;this.y=gy;this.finalColor=Math.random()<.5?"#80ff40":"#70ee30";}
function Superacid(gx,gy){this.x=gx;this.y=gy;this.direction=Math.random()>.5?1:-1;this.finalColor=Math.random()<.5?"#dd00ff":"#cc00ee";}
// ============================================================
// CONSTRUCTORS - v1.8
// ============================================================
function Wire(gx,gy){this.x=gx;this.y=gy;this.powered=false;this.finalColor='#996600';}
function Battery(gx,gy){this.x=gx;this.y=gy;this.finalColor='#22bb22';}
function Pump(gx,gy){this.x=gx;this.y=gy;this.powered=false;this.pumpTimer=0;this.finalColor='#1144bb';}
function Base(gx,gy){this.x=gx;this.y=gy;this.direction=Math.random()>.5?1:-1;this.finalColor=Math.random()<.5?'#2244ff':'#1a33ee';}
function Proton(gx,gy){this.x=gx;this.y=gy;this.life=800+Math.floor(Math.random()*400);this.finalColor=Math.random()<.5?'#ff3333':'#ee1111';}
function Electron(gx,gy){this.x=gx;this.y=gy;this.direction=Math.random()>.5?1:-1;this.life=800+Math.floor(Math.random()*400);this.finalColor=Math.random()<.5?'#4488ff':'#3377ee';}
function Human(gx,gy){
    this.x=gx; this.y=gy;      // y = body/feet cell; y-1 = head cell
    this.vx=Math.random()<.5?-1:1;
    this.moveTimer=0;
    this.throwTimer=Math.floor(Math.random()*60);
    this.drownTimer=0;
    this.finalColor='#ffcc88';
}



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

const ALL_TYPES = [
    Dirt,Sand,Ash,AntiPowder,AntiLiquid,AntiGas,Destroyer,Bomb,Stone,Wood,Acid,Water,Oil,Fire,Heater,Steam,Cloner,
    Snow,Ice,Lava,Obsidian,Glass,Gunpowder,Fuse,TNT,Rubber,Sponge,Smoke,ToxicGas,Virus,Salt,Saltwater,
    Concrete,Cooler,Methane,Mud,Plasma,
    Charcoal,Sulfur,Coal,Chalk,Gravel,Steel,Diamond,Wax,Ceramic,Brick,
    Alcohol,Mercury,Honey,Tar,Slime,
    Hydrogen,Oxygen,Nitrogen,Propane,Fog,
    Lightning,Antimatter,Ember,Gel,Void,Crystal,Rust,Blood,NitroGel,Superacid,
    Wire,Battery,Pump,Base,Proton,Electron,Human,Poop
];
ALL_TYPES.forEach(T => { T.prototype.destroy = function() { removeParticle(this); }; });

// TYPE_MAP for save/load
const TYPE_MAP = {};
ALL_TYPES.forEach(T => { TYPE_MAP[T.name] = T; });

// ============================================================
// MOVEMENT HELPERS
// ============================================================
function powderFall(p) {
    let ny = p.y+1;
    if (ny>=gridHeight) return;
    let t=grid[p.x][ny];
    const canDisplace = t===null||t instanceof Water||t instanceof Oil||t instanceof Acid||t instanceof Alcohol||t instanceof Blood||t instanceof Slime||t instanceof Mercury;
    if (canDisplace) {
        grid[p.x][p.y]=null;
        if (t) { t.y=p.y; grid[p.x][t.y]=t; }
        p.y=ny; grid[p.x][p.y]=p;
    } else {
        let dirs=[p.x-1,p.x+1];
        if (Math.random()>.5) dirs.reverse();
        for (let nx of dirs) {
            if (nx>=0&&nx<gridWidth) {
                let st=grid[nx][ny];
                if (st===null||st instanceof Water||st instanceof Acid||st instanceof Alcohol||st instanceof Blood) {
                    grid[p.x][p.y]=null;
                    if (st) { st.x=p.x; st.y=p.y; grid[p.x][p.y]=st; }
                    p.x=nx; p.y=ny; grid[p.x][p.y]=p; break;
                }
            }
        }
    }
}

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

function slowLiquidFlow(p, frameInterval) {
    if (frameCount % frameInterval !== 0) return;
    liquidFlow(p);
}

function explode(cx, cy, radius) {
    for (let i=-radius;i<=radius;i++) for (let j=-radius;j<=radius;j++) {
        if (i*i+j*j > radius*radius) continue;
        let nx=cx+i, ny=cy+j;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
            let n=grid[nx][ny];
            if (n&&!(n instanceof Stone)&&!(n instanceof Obsidian)&&!(n instanceof Rubber)&&!(n instanceof Diamond)&&!(n instanceof Ceramic)&&!(n instanceof Brick)&&!(n instanceof Destroyer)) {
                particles=particles.filter(pp=>pp!==n); grid[nx][ny]=null;
            }
            if (!grid[nx][ny]) { let f=new Fire(nx,ny); particles.push(f); grid[nx][ny]=f; }
        }
    }
}

// ============================================================
// UPDATE - Original Elements (with new reactions added)
// ============================================================
Dirt.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
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
            if (n instanceof Destroyer||n instanceof Acid||n instanceof Plasma||n instanceof Superacid||n instanceof Void) { this.destroy(); return; }
        }
    }
    let ny=this.y-1;
    if (ny>=0) {
        let t=grid[this.x][ny];
        if (t===null||t instanceof Water||t instanceof Oil||t instanceof AntiLiquid||t instanceof Blood||t instanceof Slime) {
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
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    powderFall(this);
};
Ash.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Stone.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Acid)&&Math.random()<.05) { this.destroy(); return; }
    if (isNextTo(this,Superacid)&&Math.random()<.1) { this.destroy(); return; }
    if (isNextTo(this,Lava)&&Math.random()<.005) {
        const cx=this.x,cy=this.y; this.destroy();
        let lv=new Lava(cx,cy); particles.push(lv); grid[cx][cy]=lv; return;
    }
};
Stone.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Bomb.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Void)) { this.destroy(); return; }
    let ny=this.y+1;
    if (ny<gridHeight&&grid[this.x][ny]===null) { grid[this.x][this.y]=null; this.y=ny; grid[this.x][this.y]=this; }
    if (isNextTo(this,Fire)||isNextToActiveHeater(this)||isNextTo(this,Lava)||isNextTo(this,Plasma)||isNextTo(this,Ember)||isNextTo(this,Lightning)) {
        let bx=this.x,by=this.y; this.destroy(); explode(bx,by,20);
    }
    powderFall(this);
};
Bomb.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Destroyer.prototype.update = function() {};
Destroyer.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Wood.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextToActiveHeater(this)||isNextTo(this,Lava)||isNextTo(this,Ember)||isNextTo(this,Coal)) { this.temp+=12; }
    else if (this.temp>20) { this.temp-=0.5; }
    if (this.temp>=100) {
        const cx=this.x,cy=this.y; this.destroy();
        let fre=new Fire(cx,cy); particles.push(fre); grid[cx][cy]=fre;
        // also drop charcoal nearby
        for (let [dx,dy] of DIRS) {
            let nx=cx+dx,ny=cy+dy;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&grid[nx][ny]===null&&Math.random()<.3) {
                let ch=new Charcoal(nx,ny); particles.push(ch); grid[nx][ny]=ch; break;
            }
        }
        return;
    }
    if (this.temp>60&&Math.random()<0.02) {
        let sy=this.y-1;
        if (sy>=0&&grid[this.x][sy]===null) { let sm=new Smoke(this.x,sy); particles.push(sm); grid[this.x][sy]=sm; }
    }
};
Wood.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Heater.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
};
Heater.prototype.draw = function() {
    ctx.fillStyle=this.powered?'#ffaa55':this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    if(this.powered){ctx.strokeStyle='rgba(255,170,80,0.7)';ctx.lineWidth=2;ctx.strokeRect(this.x*cellSize+1,this.y*cellSize+1,cellSize-2,cellSize-2);}
};

Sand.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,ToxicGas)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if ((isNextToActiveHeater(this)||isNextTo(this,Lava)||isNextTo(this,Coal))&&Math.random()<.01) {
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
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)) { this.destroy(); return; }
    if (isNextTo(this,Void)&&Math.random()<.05) { this.destroy(); return; }
    // Salt → Saltwater
    let saltN=getNeighbor(this,Salt);
    if (saltN&&Math.random()<.05) {
        saltN.destroy();
        const cx=this.x,cy=this.y; this.destroy();
        let sw=new Saltwater(cx,cy); particles.push(sw); grid[cx][cy]=sw; return;
    }
    // Cooler → Ice
    if (isNextToActiveCooler(this)&&Math.random()<.05) {
        const cx=this.x,cy=this.y; this.destroy();
        let ic=new Ice(cx,cy); particles.push(ic); grid[cx][cy]=ic; return;
    }
    // Nitrogen → Ice
    if (isNextTo(this,Nitrogen)&&Math.random()<.05) {
        const cx=this.x,cy=this.y; this.destroy();
        let ic=new Ice(cx,cy); particles.push(ic); grid[cx][cy]=ic; return;
    }
    // Lava → Steam
    if (isNextTo(this,Lava)&&Math.random()<.1) {
        const cx=this.x,cy=this.y; this.destroy();
        let st=new Steam(cx,cy); particles.push(st); grid[cx][cy]=st; return;
    }
    // Sulfur → Acid
    if (isNextTo(this,Sulfur)&&Math.random()<.02) {
        const cx=this.x,cy=this.y; this.destroy();
        let ac=new Acid(cx,cy); particles.push(ac); grid[cx][cy]=ac; return;
    }
    // Blood dilution
    if (isNextTo(this,Blood)&&Math.random()<.01) {
        let bl=getNeighbor(this,Blood);
        if (bl) { bl.destroy(); }
    }
    let htg=isNextTo(this,Fire)||isNextToActiveHeater(this)||isNextTo(this,Lava)||isNextTo(this,Ember)||isNextTo(this,Coal)||isNextTo(this,Steel)&&this.temp>50;
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
            if (n instanceof Destroyer||n instanceof Acid||n instanceof Plasma||n instanceof Superacid||n instanceof Void) { this.destroy(); return; }
        }
    }
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

Acid.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)) { this.destroy(); return; }
    const immune=[Destroyer,Acid,Glass,Rubber,Obsidian,Cooler,Superacid,Mercury,Diamond,Crystal,Ceramic,Brick,Heater,Steel,Cloner];
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
            let nb=grid[nx][ny];
            if (nb&&!immune.some(T=>nb instanceof T)&&Math.random()<.03) {
                // Steam + acid = toxic gas
                if (nb instanceof Steam) {
                    nb.destroy();
                    let tg=new ToxicGas(nx,ny); particles.push(tg); grid[nx][ny]=tg;
                    if (Math.random()<.3) { this.destroy(); return; }
                    break;
                }
                // Alcohol + acid = explosion
                if (nb instanceof Alcohol) {
                    let bx=nx,by=ny; nb.destroy();
                    explode(bx,by,4);
                    if (Math.random()<.5) { this.destroy(); return; }
                    break;
                }
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

Oil.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)) { this.destroy(); return; }
    if (isNextTo(this,Void)&&Math.random()<.02) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextToActiveHeater(this)||isNextTo(this,Lava)||isNextTo(this,Ember)) { this.temp+=10; }
    else if (this.temp>20) { this.temp-=0.5; }
    // Extreme heat turns oil to tar
    if (this.temp>=200) {
        const cx=this.x,cy=this.y; this.destroy();
        let tr=new Tar(cx,cy); particles.push(tr); grid[cx][cy]=tr; return;
    }
    if (this.temp>=150) {
        const cx=this.x,cy=this.y; this.destroy();
        let fie=new Fire(cx,cy); particles.push(fie); grid[cx][cy]=fie; return;
    }
    let ny=this.y+1;
    if (ny<gridHeight) {
        let below=grid[this.x][ny];
        if (below===null) {
            grid[this.x][this.y]=null; this.y=ny; grid[this.x][this.y]=this;
        } else if (below instanceof Water||below instanceof Blood||below instanceof Saltwater) {
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
    // Acid + steam = toxic gas
    if (isNextTo(this,Acid)&&Math.random()<.08) {
        const cx=this.x,cy=this.y; this.destroy();
        let tg=new ToxicGas(cx,cy); particles.push(tg); grid[cx][cy]=tg; return;
    }
    // Superacid + steam = toxic gas
    if (isNextTo(this,Superacid)&&Math.random()<.1) {
        const cx=this.x,cy=this.y; this.destroy();
        let tg=new ToxicGas(cx,cy); particles.push(tg); grid[cx][cy]=tg; return;
    }
    // Fog condenses from steam + cold
    if (isNextToActiveCooler(this)&&Math.random()<.05) {
        const cx=this.x,cy=this.y; this.destroy();
        let fg=new Fog(cx,cy); particles.push(fg); grid[cx][cy]=fg; return;
    }
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
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&(grid[nx][ny] instanceof Destroyer||grid[nx][ny] instanceof Plasma||grid[nx][ny] instanceof Void)) { this.destroy(); return; }
    }
    this.life--; if (this.life<=0) { this.destroy(); return; }
    if (frameCount%this.frameDelay!==0) return;
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
    // Nitrogen extinguishes fire
    if (isNextTo(this,Nitrogen)&&Math.random()<.15) { this.destroy(); return; }
    this.life--; if (this.life<=0) { const fx=this.x,fy=this.y-1; this.destroy(); if(fy>=0&&!grid[fx][fy]){let sm=new Smoke(fx,fy);particles.push(sm);grid[fx][fy]=sm;} return; }
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
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
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
// UPDATE - v1.6 Elements (with new reactions)
// ============================================================
Snow.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,ToxicGas)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if ((isNextTo(this,Fire)||isNextToActiveHeater(this)||isNextTo(this,Lava)||isNextTo(this,Ember)||isNextTo(this,Coal))&&Math.random()<.05) {
        const cx=this.x,cy=this.y; this.destroy();
        let w=new Water(cx,cy); particles.push(w); grid[cx][cy]=w; return;
    }
    // Snow + lava = water + steam nearby
    if (isNextTo(this,Lava)&&Math.random()<.1) {
        const cx=this.x,cy=this.y; this.destroy();
        let w=new Water(cx,cy); particles.push(w); grid[cx][cy]=w; return;
    }
    powderFall(this);
};
Snow.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Ice.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if ((isNextTo(this,Fire)||isNextToActiveHeater(this)||isNextTo(this,Ember)||isNextTo(this,Coal))&&Math.random()<.02) {
        const cx=this.x,cy=this.y; this.destroy();
        let w=new Water(cx,cy); particles.push(w); grid[cx][cy]=w; return;
    }
    // Ice + lava = obsidian + steam
    if (isNextTo(this,Lava)&&Math.random()<.05) {
        const cx=this.x,cy=this.y; this.destroy();
        let ob=new Obsidian(cx,cy); particles.push(ob); grid[cx][cy]=ob;
        for (let [dx,dy] of DIRS) {
            let nx=cx+dx,ny=cy+dy;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&grid[nx][ny]===null) {
                let st=new Steam(nx,ny); particles.push(st); grid[nx][ny]=st; break;
            }
        }
        return;
    }
};
Ice.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Lava.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Water)&&Math.random()<.08) {
        const cx=this.x,cy=this.y; this.destroy();
        let ob=new Obsidian(cx,cy); particles.push(ob); grid[cx][cy]=ob; return;
    }
    if (isNextToActiveCooler(this)&&Math.random()<.05) {
        const cx=this.x,cy=this.y; this.destroy();
        let st=new Stone(cx,cy); particles.push(st); grid[cx][cy]=st; return;
    }
    // Nitrogen cools lava to stone
    if (isNextTo(this,Nitrogen)&&Math.random()<.05) {
        const cx=this.x,cy=this.y; this.destroy();
        let st=new Stone(cx,cy); particles.push(st); grid[cx][cy]=st; return;
    }
    // Superacid reacts with lava -> plasma burst
    if (isNextTo(this,Superacid)&&Math.random()<.03) {
        const cx=this.x,cy=this.y; this.destroy();
        let pl=new Plasma(cx,cy); particles.push(pl); grid[cx][cy]=pl; return;
    }
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

Obsidian.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Superacid)&&Math.random()<.01) { this.destroy(); return; }
};
Obsidian.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Glass.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Superacid)&&Math.random()<.05) { this.destroy(); return; }
    if (isNextTo(this,Antimatter)) { this.destroy(); return; }
};
Glass.prototype.draw = function() {
    ctx.globalAlpha=0.55;
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

Gunpowder.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextTo(this,Lava)||isNextTo(this,Ember)||isNextTo(this,Lightning)) {
        let bx=this.x,by=this.y; this.destroy(); explode(bx,by,4);
        return;
    }
    powderFall(this);
};
Gunpowder.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Fuse.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    if (!this.burning&&(isNextTo(this,Fire)||isNextTo(this,Lava)||isNextTo(this,Ember)||isNextTo(this,Lightning))) this.burning=true;
    if (this.burning) {
        this.burnTimer++;
        this.finalColor=this.burnTimer%4<2?"#ff6600":"#cc4400";
        if (this.burnTimer>20) {
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

TNT.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextToActiveHeater(this)||isNextTo(this,Lava)||isNextTo(this,Plasma)||isNextTo(this,Ember)||isNextTo(this,Lightning)) {
        let bx=this.x,by=this.y; this.destroy(); explode(bx,by,10);
    }
    powderFall(this);
};
TNT.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Rubber.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Superacid)&&Math.random()<.05) { this.destroy(); return; }
    if (isNextTo(this,Antimatter)) { this.destroy(); return; }
    if (isNextTo(this,Lava)&&Math.random()<.002) { this.destroy(); return; }
};
Rubber.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Sponge.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if (this.absorbed<20) {
        for (let [dx,dy] of DIRS) {
            let nx=this.x+dx,ny=this.y+dy;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
                let n=grid[nx][ny];
                if ((n instanceof Water||n instanceof Saltwater||n instanceof Blood||n instanceof Slime)&&Math.random()<.1) {
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

ToxicGas.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)) { this.destroy(); return; }
    this.life--; if (this.life<=0) { this.destroy(); return; }
    const safe=[ToxicGas,Destroyer,Stone,Wood,Rubber,Glass,Obsidian,Cooler,Heater,Ice,Concrete,Steel,Diamond,Ceramic,Brick,Crystal];
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

Virus.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Fire)||isNextTo(this,Void)) { this.destroy(); return; }
    this.spreadTimer++;
    if (this.spreadTimer>20) {
        this.spreadTimer=0;
        const safe=[Virus,Destroyer,Stone,Rubber,Glass,Obsidian,Concrete,Steel,Diamond,Ceramic,Brick,Crystal];
        for (let [dx,dy] of DIRS) {
            let nx=this.x+dx,ny=this.y+dy;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
                let n=grid[nx][ny];
                if (n&&!safe.some(T=>n instanceof T)&&Math.random()<.1) {
                    n.destroy();
                    let v=new Virus(nx,ny); particles.push(v); grid[nx][ny]=v; break;
                }
            }
        }
    }
    powderFall(this);
};
Virus.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Salt.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,ToxicGas)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Water)&&Math.random()<.02) { this.destroy(); return; }
    powderFall(this);
};
Salt.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Saltwater.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextToActiveHeater(this)||isNextTo(this,Lava)||isNextTo(this,Ember)) { this.temp+=10; }
    else if (this.temp>17) { this.temp-=0.5; }
    if (this.temp>=110) {
        const cx=this.x,cy=this.y; this.destroy();
        let st=new Steam(cx,cy); particles.push(st); grid[cx][cy]=st;
        if (Math.random()<.5) {
            for (let [dx,dy] of DIRS) {
                let nx=cx+dx,ny=cy+dy;
                if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&grid[nx][ny]===null) {
                    // Saltwater evaporation can make crystal
                    let result = Math.random()<.3 ? new Crystal(nx,ny) : new Salt(nx,ny);
                    particles.push(result); grid[nx][ny]=result; break;
                }
            }
        }
        return;
    }
    // Cooler → Ice
    if (isNextToActiveCooler(this)&&Math.random()<.03) {
        const cx=this.x,cy=this.y; this.destroy();
        let ic=new Ice(cx,cy); particles.push(ic); grid[cx][cy]=ic; return;
    }
    liquidFlow(this);
};
Saltwater.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Concrete.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    this.hardenTimer--;
    if (this.hardenTimer<=0&&!this.hardened) { this.hardened=true; this.finalColor=Math.random()<.5?"#888888":"#777777"; }
    if (this.hardened) return;
    liquidFlow(this);
};
Concrete.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Cooler.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    if (this.powered&&isNextTo(this,Lava)&&Math.random()<.01) {
        let lv=getNeighbor(this,Lava);
        if (lv) { const lx=lv.x,ly=lv.y; lv.destroy(); let st=new Stone(lx,ly); particles.push(st); grid[lx][ly]=st; }
    }
};
Cooler.prototype.draw = function() {
    ctx.fillStyle=this.powered?'#44eeff':this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    if(this.powered){ctx.strokeStyle='rgba(80,230,255,0.7)';ctx.lineWidth=2;ctx.strokeRect(this.x*cellSize+1,this.y*cellSize+1,cellSize-2,cellSize-2);}
};

Methane.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextTo(this,Lava)||isNextToActiveHeater(this)||isNextTo(this,Ember)||isNextTo(this,Lightning)) {
        let bx=this.x,by=this.y; this.destroy(); explode(bx,by,6);
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

Mud.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    const nearHeat = isNextTo(this,Fire)||isNextToActiveHeater(this)||isNextTo(this,Lava)||isNextTo(this,Coal)||isNextTo(this,Ember);
    if (nearHeat) {
        this.heatTimer++;
        // Sustained heat → brick
        if (this.heatTimer>400&&Math.random()<.008) {
            const cx=this.x,cy=this.y; this.destroy();
            let b=new Brick(cx,cy); particles.push(b); grid[cx][cy]=b; return;
        } else if (Math.random()<.001) {
            const cx=this.x,cy=this.y; this.destroy();
            let d=new Dirt(cx,cy); particles.push(d); grid[cx][cy]=d; return;
        }
    } else {
        this.heatTimer = Math.max(0, this.heatTimer-1);
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

Plasma.prototype.update = function() {
    if (isNextTo(this,Destroyer)) { this.destroy(); return; }
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
            let n=grid[nx][ny];
            if (n&&!(n instanceof Plasma)&&!(n instanceof Destroyer)&&!(n instanceof Obsidian)&&!(n instanceof Diamond)&&Math.random()<.15) {
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
// UPDATE - v1.7 Elements (30 new)
// ============================================================

// CHARCOAL - burns slowly, produces ember + smoke, made from wood burn
Charcoal.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if (!this.burning&&(isNextTo(this,Fire)||isNextTo(this,Lava)||isNextTo(this,Ember)||isNextTo(this,Lightning))&&Math.random()<.05) this.burning=true;
    if (this.burning) {
        this.burnTimer++;
        this.finalColor = this.burnTimer%6<3?"#ff4400":"#cc2200";
        // Emit ember and smoke
        if (Math.random()<0.04) {
            let sy=this.y-1;
            if (sy>=0&&grid[this.x][sy]===null) { let em=new Ember(this.x,sy); particles.push(em); grid[this.x][sy]=em; }
        }
        if (Math.random()<0.03) {
            let sy=this.y-1;
            if (sy>=0&&grid[this.x][sy]===null) { let sm=new Smoke(this.x,sy); particles.push(sm); grid[this.x][sy]=sm; }
        }
        if (this.burnTimer>500) {
            const cx=this.x,cy=this.y; this.destroy();
            let a=new Ash(cx,cy); particles.push(a); grid[cx][cy]=a; return;
        }
    }
    powderFall(this);
};
Charcoal.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// SULFUR - powder, burns to toxic gas, dissolves in water → acid
Sulfur.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if ((isNextTo(this,Fire)||isNextToActiveHeater(this)||isNextTo(this,Lava)||isNextTo(this,Ember))&&Math.random()<.08) {
        const cx=this.x,cy=this.y; this.destroy();
        let tg=new ToxicGas(cx,cy); particles.push(tg); grid[cx][cy]=tg;
        for (let [dx,dy] of DIRS) {
            let nx=cx+dx,ny=cy+dy;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&grid[nx][ny]===null) {
                let tg2=new ToxicGas(nx,ny); particles.push(tg2); grid[nx][ny]=tg2; break;
            }
        }
        return;
    }
    if (isNextTo(this,Water)&&Math.random()<.03) {
        const cx=this.x,cy=this.y; this.destroy();
        let ac=new Acid(cx,cy); particles.push(ac); grid[cx][cy]=ac; return;
    }
    powderFall(this);
};
Sulfur.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// COAL - powder, burns very hot, produces lots of smoke
Coal.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if (!this.burning&&(isNextTo(this,Fire)||isNextTo(this,Lava)||isNextTo(this,Ember)||isNextTo(this,Lightning))) this.burning=true;
    if (this.burning) {
        this.burnTimer++;
        this.finalColor = this.burnTimer%4<2?"#ff3300":"#dd2200";
        // Coal heats adjacent things like a heater
        for (let [dx,dy] of DIRS) {
            let nx=this.x+dx,ny=this.y+dy;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
                let n=grid[nx][ny];
                if (n instanceof Water&&Math.random()<.02) { const cx=n.x,cy=n.y; n.destroy(); let s=new Steam(cx,cy); particles.push(s); grid[cx][cy]=s; }
                if (n instanceof Ice&&Math.random()<.01) { const cx=n.x,cy=n.y; n.destroy(); let w=new Water(cx,cy); particles.push(w); grid[cx][cy]=w; }
                if (n instanceof Snow&&Math.random()<.02) { const cx=n.x,cy=n.y; n.destroy(); let w=new Water(cx,cy); particles.push(w); grid[cx][cy]=w; }
                if (n instanceof Wood&&Math.random()<.005) { if (n.temp !== undefined) n.temp+=20; }
            }
        }
        if (Math.random()<0.05) {
            let sy=this.y-1;
            if (sy>=0&&grid[this.x][sy]===null) { let sm=new Smoke(this.x,sy); particles.push(sm); grid[this.x][sy]=sm; }
        }
        if (this.burnTimer>800) {
            const cx=this.x,cy=this.y; this.destroy();
            let a=new Ash(cx,cy); particles.push(a); grid[cx][cy]=a; return;
        }
    }
    powderFall(this);
};
Coal.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// CHALK - powder, dissolves in water and acid
Chalk.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,ToxicGas)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Acid)&&Math.random()<.15) { this.destroy(); return; }
    if (isNextTo(this,Superacid)&&Math.random()<.3) { this.destroy(); return; }
    if (isNextTo(this,Water)&&Math.random()<.02) { this.destroy(); return; }
    if (isNextTo(this,Saltwater)&&Math.random()<.03) { this.destroy(); return; }
    powderFall(this);
};
Chalk.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// GRAVEL - heavy powder, resistant to acid, sinks through most liquids
Gravel.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Acid)&&Math.random()<.005) { this.destroy(); return; }
    powderFall(this);
};
Gravel.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// STEEL - solid, conducts heat, slowly rusts with water
Steel.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Antimatter)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Superacid)&&Math.random()<.04) { this.destroy(); return; }
    if (isNextTo(this,Acid)&&Math.random()<.008) { this.destroy(); return; }
    // Heat conduction
    this.hot = isNextTo(this,Fire)||isNextToActiveHeater(this)||isNextTo(this,Lava)||isNextTo(this,Coal)||isNextTo(this,Ember);
    if (this.hot) {
        for (let [dx,dy] of DIRS) {
            let nx=this.x+dx,ny=this.y+dy;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
                let n=grid[nx][ny];
                if (n instanceof Water&&Math.random()<.02) { const cx=n.x,cy=n.y; n.destroy(); let s=new Steam(cx,cy); particles.push(s); grid[cx][cy]=s; }
                if (n instanceof Ice&&Math.random()<.01) { const cx=n.x,cy=n.y; n.destroy(); let w=new Water(cx,cy); particles.push(w); grid[cx][cy]=w; }
                if (n instanceof Wood&&Math.random()<.003&&n.temp!==undefined) n.temp+=15;
            }
        }
    }
    // Rusting
    if ((isNextTo(this,Water)||isNextTo(this,Saltwater)||isNextTo(this,Blood))) {
        this.rustTimer++;
        if (this.rustTimer>600&&Math.random()<.01) {
            const cx=this.x,cy=this.y; this.destroy();
            let r=new Rust(cx,cy); particles.push(r); grid[cx][cy]=r;
        }
    }
};
Steel.prototype.draw = function() {
    ctx.fillStyle = this.hot ? "#ddaa44" : this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
};

// DIAMOND - nearly indestructible solid
Diamond.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Antimatter)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Superacid)&&Math.random()<.001) { this.destroy(); return; }
};
Diamond.prototype.draw = function() {
    ctx.globalAlpha=0.8;
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// WAX - solid, melts to oil near heat
Wax.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if ((isNextTo(this,Fire)||isNextToActiveHeater(this)||isNextTo(this,Lava)||isNextTo(this,Ember)||isNextTo(this,Coal))&&Math.random()<.03) {
        const cx=this.x,cy=this.y; this.destroy();
        let o=new Oil(cx,cy); particles.push(o); grid[cx][cy]=o; return;
    }
};
Wax.prototype.draw = function() {
    ctx.globalAlpha=0.85;
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// CERAMIC - heat resistant solid, immune to fire/lava
Ceramic.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Antimatter)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Plasma)&&Math.random()<.05) { this.destroy(); return; }
    if (isNextTo(this,Superacid)&&Math.random()<.005) { this.destroy(); return; }
    if (isNextTo(this,Acid)&&Math.random()<.001) { this.destroy(); return; }
    // immune to fire, lava, heat
};
Ceramic.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// BRICK - solid, made from mud+heat, water resistant
Brick.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Antimatter)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Superacid)&&Math.random()<.03) { this.destroy(); return; }
    if (isNextTo(this,Acid)&&Math.random()<.008) { this.destroy(); return; }
};
Brick.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// ALCOHOL - liquid, very flammable, evaporates, ignites into burst
Alcohol.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextToActiveHeater(this)||isNextTo(this,Lava)||isNextTo(this,Ember)||isNextTo(this,Lightning)) { this.temp+=20; }
    else if (this.temp>20) { this.temp-=0.5; }
    if (this.temp>=80) {
        // Alcohol ignites: burst of fire + steam
        let bx=this.x,by=this.y; this.destroy();
        for (let i=-5;i<=5;i++) for (let j=-5;j<=5;j++) {
            if (i*i+j*j>25) continue;
            let nx=bx+i,ny2=by+j;
            if (nx>=0&&nx<gridWidth&&ny2>=0&&ny2<gridHeight&&grid[nx][ny2]===null) {
                let p = Math.random()<.6 ? new Fire(nx,ny2) : new Steam(nx,ny2);
                particles.push(p); grid[nx][ny2]=p;
            }
        }
        return;
    }
    // Slow evaporation
    this.evapTimer++;
    if (this.evapTimer > 1000 && Math.random()<.005) {
        const cx=this.x,cy=this.y; this.destroy();
        let st=new Steam(cx,cy); particles.push(st); grid[cx][cy]=st; return;
    }
    // Mix with water: dilutes
    if (isNextTo(this,Water)&&Math.random()<.005) {
        const cx=this.x,cy=this.y; this.destroy();
        let w=new Water(cx,cy); particles.push(w); grid[cx][cy]=w; return;
    }
    if (this.isDead) return;
    liquidFlow(this);
};
Alcohol.prototype.draw = function() {
    ctx.globalAlpha=0.75;
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// MERCURY - heavy liquid metal, toxic, immune to acid
Mercury.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Antimatter)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Superacid)&&Math.random()<.02) { this.destroy(); return; }
    // Emits toxic gas when heated
    if ((isNextTo(this,Fire)||isNextToActiveHeater(this)||isNextTo(this,Lava)||isNextTo(this,Coal))&&Math.random()<.03) {
        let sy=this.y-1;
        if (sy>=0&&grid[this.x][sy]===null) { let tg=new ToxicGas(this.x,sy); particles.push(tg); grid[this.x][sy]=tg; }
    }
    // Mercury is toxic to organics nearby
    const organics=[Water,Dirt,Wood,Sand,Ash,Mud,Blood,Slime,Virus,Alcohol,Honey];
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
            let n=grid[nx][ny];
            if (n&&organics.some(T=>n instanceof T)&&Math.random()<.001) { n.destroy(); break; }
        }
    }
    // Heavy liquid: sinks through water/alcohol
    let ny=this.y+1;
    if (ny<gridHeight) {
        let below=grid[this.x][ny];
        if (below===null) {
            grid[this.x][this.y]=null; this.y=ny; grid[this.x][this.y]=this;
        } else if (below instanceof Water||below instanceof Alcohol||below instanceof Blood||below instanceof Slime) {
            // Swap: mercury sinks under these
            grid[this.x][this.y]=below; below.y=this.y; grid[this.x][below.y]=below;
            this.y=ny; grid[this.x][this.y]=this;
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
Mercury.prototype.draw = function() {
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    // Sheen effect
    ctx.fillStyle="rgba(255,255,255,0.3)";
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize/3,cellSize/3);
};

// HONEY - very slow liquid, burns slowly
Honey.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if ((isNextTo(this,Fire)||isNextTo(this,Lava)||isNextTo(this,Ember))&&Math.random()<.01) {
        const cx=this.x,cy=this.y; this.destroy();
        let f=new Fire(cx,cy); particles.push(f); grid[cx][cy]=f; return;
    }
    // Very slow flow (every 6 frames)
    if (frameCount%6!==0) return;
    liquidFlow(this);
};
Honey.prototype.draw = function() {
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
};

// TAR - thick slow liquid, very flammable
Tar.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Acid)&&Math.random()<.02) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextToActiveHeater(this)||isNextTo(this,Lava)||isNextTo(this,Ember)||isNextTo(this,Coal)) { this.temp+=15; }
    else if (this.temp>20) { this.temp-=0.3; }
    if (this.temp>=120) {
        // Burns intensely with lots of smoke
        const cx=this.x,cy=this.y; this.destroy();
        let fi=new Fire(cx,cy); particles.push(fi); grid[cx][cy]=fi;
        for (let i=0;i<3;i++) {
            for (let [dx,dy] of DIRS) {
                let nx=cx+dx,ny=cy+dy;
                if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&grid[nx][ny]===null) {
                    let sm=new Smoke(nx,ny); particles.push(sm); grid[nx][ny]=sm; break;
                }
            }
        }
        return;
    }
    // Slow flow (every 3 frames)
    if (frameCount%3!==0) return;
    liquidFlow(this);
};
Tar.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// SLIME - medium liquid, infects water slowly
Slime.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if ((isNextTo(this,Fire)||isNextTo(this,Lava)||isNextTo(this,Ember))&&Math.random()<.05) { this.destroy(); return; }
    // Spreads to adjacent water
    if (Math.random()<.002) {
        for (let [dx,dy] of DIRS) {
            let nx=this.x+dx,ny=this.y+dy;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&grid[nx][ny] instanceof Water) {
                let w=grid[nx][ny]; w.destroy();
                let sl=new Slime(nx,ny); particles.push(sl); grid[nx][ny]=sl; break;
            }
        }
    }
    // Slow-ish flow (every 2 frames)
    if (frameCount%2!==0) return;
    liquidFlow(this);
};
Slime.prototype.draw = function() {
    ctx.globalAlpha=0.85;
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// HYDROGEN - very light explosive gas
Hydrogen.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextTo(this,Lava)||isNextTo(this,Ember)||isNextTo(this,Lightning)) {
        let bx=this.x,by=this.y;
        // If near oxygen, some cells become water
        let hasOxygen = isNextTo(this,Oxygen);
        this.destroy();
        for (let i=-10;i<=10;i++) for (let j=-10;j<=10;j++) {
            if (i*i+j*j>100) continue;
            let nx=bx+i,ny=by+j;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
                let n=grid[nx][ny];
                if (n&&!(n instanceof Stone)&&!(n instanceof Obsidian)&&!(n instanceof Diamond)&&!(n instanceof Ceramic)&&!(n instanceof Destroyer)) {
                    particles=particles.filter(pp=>pp!==n); grid[nx][ny]=null;
                }
                if (!grid[nx][ny]) {
                    let newP = (hasOxygen&&Math.random()<.2) ? new Water(nx,ny) : new Fire(nx,ny);
                    particles.push(newP); grid[nx][ny]=newP;
                }
            }
        }
        return;
    }
    this.life--; if (this.life<=0) { this.destroy(); return; }
    if (frameCount%this.frameDelay!==0) return;
    // Very fast rising
    gasRise(this);
};
Hydrogen.prototype.draw = function() {
    ctx.globalAlpha=Math.max(0.1,this.life/300);
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// OXYGEN - gas, makes fire spread faster
Oxygen.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    // Makes fire spread
    if (isNextTo(this,Fire)&&Math.random()<.1) {
        for (let [dx,dy] of DIRS) {
            let nx=this.x+dx,ny=this.y+dy;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&grid[nx][ny]===null&&Math.random()<.4) {
                let f=new Fire(nx,ny); particles.push(f); grid[nx][ny]=f; break;
            }
        }
    }
    // Oxygen + hydrogen + fire = water (handled in Hydrogen)
    this.life--; if (this.life<=0) { this.destroy(); return; }
    if (frameCount%this.frameDelay!==0) return;
    gasRise(this);
};
Oxygen.prototype.draw = function() {
    ctx.globalAlpha=Math.max(0.1,this.life/350);
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// NITROGEN - cold gas, freezes water, extinguishes fire
Nitrogen.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    // Extinguish fire
    if (isNextTo(this,Fire)&&Math.random()<.1) {
        let fi=getNeighbor(this,Fire);
        if (fi) { fi.destroy(); }
    }
    // Freeze nearby water
    if (isNextTo(this,Water)&&Math.random()<.03) {
        let w=getNeighbor(this,Water);
        if (w) { const cx=w.x,cy=w.y; w.destroy(); let ic=new Ice(cx,cy); particles.push(ic); grid[cx][cy]=ic; }
    }
    // Freeze saltwater too
    if (isNextTo(this,Saltwater)&&Math.random()<.02) {
        let sw=getNeighbor(this,Saltwater);
        if (sw) { const cx=sw.x,cy=sw.y; sw.destroy(); let ic=new Ice(cx,cy); particles.push(ic); grid[cx][cy]=ic; }
    }
    // Cool lava to stone
    if (isNextTo(this,Lava)&&Math.random()<.05) {
        let lv=getNeighbor(this,Lava);
        if (lv) { const cx=lv.x,cy=lv.y; lv.destroy(); let st=new Stone(cx,cy); particles.push(st); grid[cx][cy]=st; }
    }
    this.life--; if (this.life<=0) { this.destroy(); return; }
    if (frameCount%this.frameDelay!==0) return;
    gasRise(this);
};
Nitrogen.prototype.draw = function() {
    ctx.globalAlpha=Math.max(0.1,this.life/400);
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// PROPANE - heavy gas, sinks and explodes
Propane.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextTo(this,Ember)||isNextTo(this,Lava)||isNextTo(this,Lightning)||isNextToActiveHeater(this)) {
        let bx=this.x,by=this.y; this.destroy(); explode(bx,by,8);
        return;
    }
    this.life--; if (this.life<=0) { this.destroy(); return; }
    if (frameCount%this.frameDelay!==0) return;
    // Heavy gas sinks
    let ny=this.y+1;
    if (ny<gridHeight&&grid[this.x][ny]===null) {
        grid[this.x][this.y]=null; this.y=ny; grid[this.x][this.y]=this; return;
    }
    let nx=this.x+this.direction;
    if (nx>=0&&nx<gridWidth&&grid[nx][this.y]===null) {
        grid[this.x][this.y]=null; this.x=nx; grid[this.x][this.y]=this;
    } else { this.direction*=-1; }
};
Propane.prototype.draw = function() {
    ctx.globalAlpha=Math.max(0.15,this.life/350);
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// FOG - thin gas, condenses to water with cold, becomes steam with heat
Fog.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    if ((isNextTo(this,Fire)||isNextToActiveHeater(this)||isNextTo(this,Lava)||isNextTo(this,Coal))&&Math.random()<.05) {
        const cx=this.x,cy=this.y; this.destroy();
        let st=new Steam(cx,cy); particles.push(st); grid[cx][cy]=st; return;
    }
    if ((isNextToActiveCooler(this)||isNextTo(this,Nitrogen)||isNextTo(this,Ice))&&Math.random()<.05) {
        const cx=this.x,cy=this.y; this.destroy();
        let w=new Water(cx,cy); particles.push(w); grid[cx][cy]=w; return;
    }
    // Acid fog = toxic gas
    if (isNextTo(this,Acid)&&Math.random()<.04) {
        const cx=this.x,cy=this.y; this.destroy();
        let tg=new ToxicGas(cx,cy); particles.push(tg); grid[cx][cy]=tg; return;
    }
    this.life--; if (this.life<=0) { this.destroy(); return; }
    if (frameCount%this.frameDelay!==0) return;
    gasRise(this);
};
Fog.prototype.draw = function() {
    ctx.globalAlpha=Math.max(0.05,this.life/400)*0.4;
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// LIGHTNING - travels downward, destroys path, spawns fire
Lightning.prototype.update = function() {
    this.life--;
    if (this.life<=0) { this.destroy(); return; }
    // Destroy neighbors and spawn fire
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
            let n=grid[nx][ny];
            if (n&&!(n instanceof Lightning)&&!(n instanceof Stone)&&!(n instanceof Obsidian)&&!(n instanceof Diamond)&&!(n instanceof Ceramic)&&!(n instanceof Destroyer)) {
                n.destroy();
                if (grid[nx][ny]===null&&Math.random()<.7) {
                    let f=new Fire(nx,ny); particles.push(f); grid[nx][ny]=f;
                }
            }
        }
    }
    // Move downward (fast)
    for (let step=0;step<3;step++) {
        let ny=this.y+1;
        if (ny>=gridHeight) break;
        let t=grid[this.x][ny];
        if (t&&!(t instanceof Lightning)) {
            t.destroy();
            if (grid[this.x][ny]===null) { let f=new Fire(this.x,ny); particles.push(f); grid[this.x][ny]=f; }
        }
        if (grid[this.x][ny]===null||grid[this.x][ny] instanceof Fire) {
            grid[this.x][this.y]=null; this.y=ny; grid[this.x][this.y]=this;
        } else {
            // Go diagonal
            let nx2 = this.x + (Math.random()<.5?1:-1);
            if (nx2>=0&&nx2<gridWidth) {
                let t2=grid[nx2][ny];
                if (t2&&!(t2 instanceof Lightning)) { t2.destroy(); }
                if (!grid[nx2][ny]) { grid[this.x][this.y]=null; this.x=nx2; this.y=ny; grid[this.x][this.y]=this; }
            }
            break;
        }
    }
};
Lightning.prototype.draw = function() {
    ctx.fillStyle="#ffffff";
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.fillStyle="rgba(180,180,255,0.5)";
    ctx.fillRect((this.x-1)*cellSize,(this.y)*cellSize,cellSize*3,cellSize);
};

// ANTIMATTER - destroys everything including immune materials, fades
Antimatter.prototype.update = function() {
    this.life--;
    if (this.life<=0) { this.destroy(); return; }
    // Destroy all neighbors
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
            let n=grid[nx][ny];
            if (n&&!(n instanceof Antimatter)&&!(n instanceof Destroyer)&&Math.random()<.6) {
                n.destroy();
            }
        }
    }
    // Random movement
    let moves=[];
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&grid[nx][ny]===null) moves.push([nx,ny]);
    }
    if (moves.length>0) {
        let [nx,ny]=moves[Math.floor(Math.random()*moves.length)];
        grid[this.x][this.y]=null; this.x=nx; this.y=ny; grid[this.x][this.y]=this;
    }
};
Antimatter.prototype.draw = function() {
    ctx.globalAlpha=Math.max(0.3,this.life/90);
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    // Purple glow
    ctx.fillStyle=`rgba(180,0,255,${0.3*this.life/90})`;
    ctx.fillRect((this.x-1)*cellSize,(this.y-1)*cellSize,cellSize*3,cellSize*3);
    ctx.globalAlpha=1.0;
};

// EMBER - slow fire, longer lived, ignites flammables
Ember.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Void)) { this.destroy(); return; }
    // Nitrogen extinguishes embers
    if (isNextTo(this,Nitrogen)&&Math.random()<.1) { this.destroy(); return; }
    // Water extinguishes embers
    if (isNextTo(this,Water)||isNextTo(this,Saltwater)||isNextTo(this,Blood)) {
        this.destroy(); return;
    }
    // Ember ignites things
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
            let n=grid[nx][ny];
            if ((n instanceof Wood||n instanceof Fuse||n instanceof Charcoal||n instanceof Coal)&&Math.random()<.02) {
                if (n instanceof Wood) n.temp+=10;
                if (n instanceof Fuse) n.burning=true;
                if (n instanceof Charcoal||n instanceof Coal) n.burning=true;
            }
        }
    }
    this.life--; if (this.life<=0) {
        // Ember dies → puff of smoke
        const cx=this.x,cy=this.y; this.destroy();
        if (cy-1>=0&&grid[cx][cy-1]===null) { let sm=new Smoke(cx,cy-1); particles.push(sm); grid[cx][cy-1]=sm; }
        return;
    }
    if (frameCount%this.frameDelay!==0) return;
    // Flickers between orange and red
    this.finalColor = frameCount%8<4?"#ff6600":"#ff4400";
    gasRise(this);
};
Ember.prototype.draw = function() {
    ctx.globalAlpha=Math.max(0.3,this.life/350);
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// GEL - slow sticky material, absorbs water
Gel.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if ((isNextTo(this,Fire)||isNextTo(this,Lava))&&Math.random()<.02) {
        const cx=this.x,cy=this.y; this.destroy();
        let f=new Fire(cx,cy); particles.push(f); grid[cx][cy]=f; return;
    }
    // Absorb water
    if (this.absorbed<10) {
        for (let [dx,dy] of DIRS) {
            let nx=this.x+dx,ny=this.y+dy;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&(grid[nx][ny] instanceof Water||grid[nx][ny] instanceof Blood)&&Math.random()<.05) {
                grid[nx][ny].destroy(); this.absorbed++;
                const t=Math.min(1,this.absorbed/10);
                this.finalColor=`rgb(${Math.floor(136+t*60)},${Math.floor(255-t*100)},${Math.floor(136+t*60)})`;
                break;
            }
        }
    }
    // Very slow flow (every 8 frames)
    if (frameCount%8!==0) return;
    liquidFlow(this);
};
Gel.prototype.draw = function() {
    ctx.globalAlpha=0.8;
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// VOID - spreads and consumes, then dissipates
Void.prototype.update = function() {
    this.life--;
    if (this.life<=0) { this.destroy(); return; }
    this.spreadTimer++;
    if (this.spreadTimer>12) {
        this.spreadTimer=0;
        for (let [dx,dy] of DIRS) {
            let nx=this.x+dx,ny=this.y+dy;
            if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
                let n=grid[nx][ny];
                if (n&&!(n instanceof Void)&&!(n instanceof Destroyer)&&Math.random()<.25) {
                    n.destroy();
                    let v=new Void(nx,ny); particles.push(v); grid[nx][ny]=v;
                    break;
                }
            }
        }
    }
    // Void slowly pulses
    this.finalColor = frameCount%20<10?"#050005":"#0a000a";
};
Void.prototype.draw = function() {
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.fillStyle="rgba(80,0,80,0.2)";
    ctx.fillRect((this.x-1)*cellSize,(this.y-1)*cellSize,cellSize*3,cellSize*3);
};

// CRYSTAL - solid, grows in saltwater, transparent
Crystal.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Superacid)||isNextTo(this,Antimatter)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Acid)&&Math.random()<.08) { this.destroy(); return; }
    if (isNextTo(this,Plasma)&&Math.random()<.2) { this.destroy(); return; }
    // Grows by converting saltwater neighbors
    this.growTimer++;
    if (this.growTimer>80) {
        this.growTimer=0;
        let sw=getNeighbor(this,Saltwater);
        if (sw&&Math.random()<.3) {
            const cx=sw.x,cy=sw.y; sw.destroy();
            let c=new Crystal(cx,cy); particles.push(c); grid[cx][cy]=c;
        }
    }
};
Crystal.prototype.draw = function() {
    ctx.globalAlpha=0.65;
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// RUST - orange-brown powder, spreads corrosion to steel
Rust.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Acid)&&Math.random()<.1) { this.destroy(); return; }
    // Rust spreads to adjacent steel with water
    if (isNextTo(this,Steel)&&(isNextTo(this,Water)||isNextTo(this,Saltwater)||isNextTo(this,Blood))&&Math.random()<.005) {
        let st=getNeighbor(this,Steel);
        if (st) { const cx=st.x,cy=st.y; st.destroy(); let r=new Rust(cx,cy); particles.push(r); grid[cx][cy]=r; }
    }
    powderFall(this);
};
Rust.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// BLOOD - red liquid, burns to smoke, infectable by virus
Blood.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Acid)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if ((isNextTo(this,Fire)||isNextTo(this,Lava)||isNextTo(this,Ember))&&Math.random()<.05) {
        const cx=this.x,cy=this.y; this.destroy();
        let sm=new Smoke(cx,cy); particles.push(sm); grid[cx][cy]=sm; return;
    }
    // Dilutes in water
    if (isNextTo(this,Water)&&Math.random()<.005) {
        const cx=this.x,cy=this.y; this.destroy();
        let w=new Water(cx,cy); particles.push(w); grid[cx][cy]=w; return;
    }
    liquidFlow(this);
};
Blood.prototype.draw = function() {
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
};

// NITROGEL - explosive gel, triggered by many things
NitroGel.prototype.update = function() {
    if (isNextTo(this,Destroyer)) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextTo(this,Ember)||isNextToActiveHeater(this)||isNextTo(this,Lava)||
        isNextTo(this,Acid)||isNextTo(this,Superacid)||isNextTo(this,Plasma)||isNextTo(this,Lightning)) {
        let bx=this.x,by=this.y; this.destroy(); explode(bx,by,18);
        return;
    }
    // Falls slowly
    if (frameCount%3!==0) return;
    powderFall(this);
};
NitroGel.prototype.draw = function() {
    ctx.globalAlpha=0.9;
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.globalAlpha=1.0;
};

// SUPERACID - dissolves nearly everything including acid-immune materials
Superacid.prototype.update = function() {
    if (isNextTo(this,Destroyer)) { this.destroy(); return; }
    if (isNextTo(this,Void)) { this.destroy(); return; }
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
            let nb=grid[nx][ny];
            if (!nb) continue;
            if (nb instanceof Superacid||nb instanceof Destroyer||nb instanceof Void) continue;
            let rate = 0.04;
            if (nb instanceof Diamond) rate=0.001;
            else if (nb instanceof Obsidian) rate=0.015;
            else if (nb instanceof Rubber) rate=0.02;
            else if (nb instanceof Ceramic) rate=0.008;
            else if (nb instanceof Brick) rate=0.02;
            else if (nb instanceof Steel) rate=0.025;
            else if (nb instanceof Crystal) rate=0.05;
            else if (nb instanceof Glass) rate=0.04;
            else if (nb instanceof Antimatter) continue; // immune
            if (Math.random()<rate) {
                nb.destroy();
                if (Math.random()<.25) { this.destroy(); return; }
                break;
            }
        }
    }
    if (this.isDead) return;
    liquidFlow(this);
};
Superacid.prototype.draw = function() {
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    // Bubble effect
    if (Math.random()<0.2) {
        ctx.fillStyle="rgba(255,255,255,0.4)";
        ctx.fillRect((this.x)*cellSize+2,(this.y)*cellSize+2,3,3);
    }
};


// ============================================================
// BRUSH SIZE & MIX TOOL
// ============================================================
let brushSize = 1; // radius in cells
let isMixing = false;

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0) brushSize = Math.min(10, brushSize + 1);
    else              brushSize = Math.max(1,  brushSize - 1);
}, { passive: false });

function eraseArea(x, y) {
    const cx = Math.floor(x/cellSize), cy = Math.floor(y/cellSize);
    for (let dx=-brushSize+1; dx<brushSize; dx++) {
        for (let dy=-brushSize+1; dy<brushSize; dy++) {
            const gx=cx+dx, gy=cy+dy;
            if (gx<0||gx>=gridWidth||gy<0||gy>=gridHeight) continue;
            const t=grid[gx][gy];
            if (t) { const idx=particles.indexOf(t); if(idx>-1) particles.splice(idx,1); grid[gx][gy]=null; }
        }
    }
}

function spawnArea(x, y, Ctor) {
    const cx = Math.floor(x/cellSize), cy = Math.floor(y/cellSize);
    for (let dx=-brushSize+1; dx<brushSize; dx++) {
        for (let dy=-brushSize+1; dy<brushSize; dy++) {
            const gx=cx+dx, gy=cy+dy;
            if (gx<0||gx>=gridWidth||gy<0||gy>=gridHeight) continue;
            if (!grid[gx][gy]) { let p=new Ctor(gx,gy); particles.push(p); grid[gx][gy]=p; }
        }
    }
}

function mixArea(x, y) {
    const cx = Math.floor(x/cellSize), cy = Math.floor(y/cellSize);
    const cells = [];
    for (let dx=-brushSize; dx<=brushSize; dx++) {
        for (let dy=-brushSize; dy<=brushSize; dy++) {
            const gx=cx+dx, gy=cy+dy;
            if (gx>=0&&gx<gridWidth&&gy>=0&&gy<gridHeight) cells.push([gx,gy]);
        }
    }
    // Shuffle particle positions
    for (let i=cells.length-1; i>0; i--) {
        const j=Math.floor(Math.random()*(i+1));
        const [ax,ay]=cells[i], [bx,by]=cells[j];
        const pa=grid[ax][ay], pb=grid[bx][by];
        grid[ax][ay]=pb; grid[bx][by]=pa;
        if(pa){pa.x=bx;pa.y=by;}
        if(pb){pb.x=ax;pb.y=ay;}
    }
}

function drawBrushCursor() {
    if (mouseX===undefined||mouseY===undefined) return;
    const cx=Math.floor(mouseX/cellSize), cy=Math.floor(mouseY/cellSize);
    ctx.strokeStyle = selected==='mix' ? 'rgba(0,255,200,0.7)' : selected==='erase' ? 'rgba(255,80,80,0.7)' : 'rgba(255,255,255,0.5)';
    ctx.lineWidth=1;
    const s=brushSize, r=cellSize;
    ctx.strokeRect((cx-s+1)*r,(cy-s+1)*r,(s*2-2)*r,(s*2-2)*r);
    // Brush size label
    ctx.fillStyle='rgba(255,255,255,0.7)';
    ctx.font='9px monospace';
    ctx.fillText('\u2A2F'+brushSize, (cx+s)*r+2, (cy-s+1)*r+10);
}

// ============================================================
// ELECTRICITY HELPERS
// ============================================================
function isNextToActiveHeater(p) {
    for (let [dx,dy] of DIRS) {
        let nx=p.x+dx, ny=p.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
            let n=grid[nx][ny];
            if (n instanceof Heater && n.powered) return true;
        }
    }
    return false;
}
function isNextToActiveCooler(p) {
    for (let [dx,dy] of DIRS) {
        let nx=p.x+dx, ny=p.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight) {
            let n=grid[nx][ny];
            if (n instanceof Cooler && n.powered) return true;
        }
    }
    return false;
}

function propagateElectricity() {
    // Reset powered state
    for (const p of particles) {
        if (!p.isDead && (p instanceof Wire || p instanceof Heater || p instanceof Cooler || p instanceof Pump))
            p.powered = false;
    }
    // BFS from batteries
    const visited = new Set(), queue = [];
    for (const p of particles) {
        if (!p.isDead && p instanceof Battery) { visited.add(p); queue.push(p); }
    }
    while (queue.length) {
        const curr = queue.shift();
        for (let [dx,dy] of DIRS) {
            let nx=curr.x+dx, ny=curr.y+dy;
            if (nx<0||nx>=gridWidth||ny<0||ny>=gridHeight) continue;
            const n = grid[nx][ny];
            if (!n || visited.has(n)) continue;
            if (n instanceof Wire) {
                n.powered = true; visited.add(n); queue.push(n);
            } else if (n instanceof Heater || n instanceof Cooler || n instanceof Pump) {
                n.powered = true; visited.add(n);
                // Heater/Cooler/Pump don't propagate but can daisy-chain through wire
            }
        }
    }
}

// ============================================================
// v1.8 UPDATE / DRAW PROTOTYPES
// ============================================================
Wire.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    if ((isNextTo(this,Acid)||isNextTo(this,Superacid))&&Math.random()<.02) { this.destroy(); return; }
};
Wire.prototype.draw = function() {
    ctx.fillStyle = this.powered ? '#ffcc00' : '#442200';
    ctx.fillRect(this.x*cellSize, this.y*cellSize, cellSize, cellSize);
    ctx.fillStyle = this.powered ? '#fff5aa' : '#885500';
    ctx.fillRect(this.x*cellSize+3, this.y*cellSize+3, cellSize-6, cellSize-6);
    if (this.powered) {
        ctx.globalAlpha = 0.25 + 0.15*Math.sin(frameCount*0.4 + this.x*0.7);
        ctx.fillStyle = '#ffee44';
        ctx.fillRect(this.x*cellSize, this.y*cellSize, cellSize, cellSize);
        ctx.globalAlpha = 1;
    }
};

Battery.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    if ((isNextTo(this,Acid)||isNextTo(this,Superacid))&&Math.random()<.04) {
        const bx=this.x,by=this.y; this.destroy(); explode(bx,by,3); return;
    }
};
Battery.prototype.draw = function() {
    const x=this.x*cellSize, y=this.y*cellSize, s=cellSize;
    ctx.fillStyle='#113311'; ctx.fillRect(x,y,s,s);
    ctx.fillStyle='#33cc33'; ctx.fillRect(x+2,y+2,s-4,s-4);
    ctx.fillStyle='#ffffff'; ctx.fillRect(x+s/2-1,y+2,2,s-4); ctx.fillRect(x+2,y+s/2-1,s-4,2);
};

Pump.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    if (!this.powered) return;
    this.pumpTimer++;
    if (this.pumpTimer < 3) return;
    this.pumpTimer = 0;
    const isFluid = p => p && (
        p instanceof Water || p instanceof Oil || p instanceof Acid || p instanceof Lava ||
        p instanceof Saltwater || p instanceof Alcohol || p instanceof Blood || p instanceof Slime ||
        p instanceof Mercury || p instanceof Honey || p instanceof Tar || p instanceof Base
    );
    // Pull fluid from below into this cell's position, then shift column upward
    const below = (this.y+1 < gridHeight) ? grid[this.x][this.y+1] : null;
    if (isFluid(below)) {
        // Walk up the column and shift every fluid up one
        for (let gy = this.y-1; gy >= 0; gy--) {
            const cur = grid[this.x][gy];
            const up  = gy-1 >= 0 ? grid[this.x][gy-1] : null;
            if (!isFluid(cur)) break;
            if (!up) { grid[this.x][gy]=null; cur.y=gy-1; grid[this.x][gy-1]=cur; }
        }
        // Now move below up into the cell above pump
        const dest = this.y-1;
        if (dest >= 0 && !grid[this.x][dest]) {
            grid[this.x][below.y]=null; below.y=dest; grid[this.x][dest]=below;
        }
    }
};
Pump.prototype.draw = function() {
    const x=this.x*cellSize, y=this.y*cellSize, s=cellSize;
    ctx.fillStyle = this.powered ? '#2255ee' : '#112288';
    ctx.fillRect(x, y, s, s);
    // Animated upward arrow
    const phase = this.powered ? (Math.floor(frameCount/5) % 4) : -1;
    for (let i=0; i<3; i++) {
        ctx.globalAlpha = (i===phase) ? 1.0 : 0.25;
        ctx.fillStyle = '#88bbff';
        ctx.fillRect(x+3, y+s-5-(i*3), s-6, 2);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.moveTo(x+s/2,y+1); ctx.lineTo(x+s/2-4,y+7); ctx.lineTo(x+s/2+4,y+7); ctx.closePath(); ctx.fill();
};

Base.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    // Neutralise acid → water + salt
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx, ny=this.y+dy;
        if (nx<0||nx>=gridWidth||ny<0||ny>=gridHeight) continue;
        const n=grid[nx][ny];
        if (n instanceof Acid && Math.random()<.08) {
            const bx=this.x,by=this.y,ax=n.x,ay=n.y;
            this.destroy(); n.destroy();
            const w=new Water(bx,by); particles.push(w); grid[bx][by]=w;
            const s=new Salt(ax,ay);  particles.push(s); grid[ax][ay]=s;
            return;
        }
        if (n instanceof Superacid && Math.random()<.04) {
            const bx=this.x,by=this.y,ax=n.x,ay=n.y;
            this.destroy(); n.destroy();
            const w=new Water(bx,by); particles.push(w); grid[bx][by]=w;
            const tg=new ToxicGas(ax,ay); particles.push(tg); grid[ax][ay]=tg;
            return;
        }
    }
    if (isNextTo(this,Water)&&Math.random()<.001) {
        const cx=this.x,cy=this.y; this.destroy();
        const w=new Water(cx,cy); particles.push(w); grid[cx][cy]=w; return;
    }
    liquidFlow(this);
};
Base.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

Proton.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    // Proton + Electron → annihilate into energy (fire burst)
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx<0||nx>=gridWidth||ny<0||ny>=gridHeight) continue;
        if (grid[nx][ny] instanceof Electron) {
            const bx=this.x,by=this.y; this.destroy(); grid[nx][ny].destroy();
            for (let fx=bx-2;fx<=bx+2;fx++) for (let fy=by-2;fy<=by+2;fy++) {
                if (fx>=0&&fx<gridWidth&&fy>=0&&fy<gridHeight&&!grid[fx][fy]) {
                    const f=new Fire(fx,fy); particles.push(f); grid[fx][fy]=f;
                }
            }
            return;
        }
    }
    this.life--;
    if (this.life<=0) { this.destroy(); return; }
    powderFall(this);
};
Proton.prototype.draw = function() {
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.fillStyle='rgba(255,100,100,0.4)';
    ctx.fillRect(this.x*cellSize+1,this.y*cellSize+1,cellSize-2,cellSize-2);
};

Electron.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Plasma)||isNextTo(this,Void)) { this.destroy(); return; }
    // Electrons power adjacent wire cells
    for (let [dx,dy] of DIRS) {
        let nx=this.x+dx,ny=this.y+dy;
        if (nx>=0&&nx<gridWidth&&ny>=0&&ny<gridHeight&&grid[nx][ny] instanceof Wire) grid[nx][ny].powered=true;
    }
    this.life--;
    if (this.life<=0) { this.destroy(); return; }
    powderFall(this);
};
Electron.prototype.draw = function() {
    ctx.fillStyle=this.finalColor;
    ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize);
    ctx.fillStyle='rgba(100,180,255,0.35)';
    ctx.fillRect(this.x*cellSize+1,this.y*cellSize+1,cellSize-2,cellSize-2);
};

Human.prototype.update = function() {
    const hY = this.y - 1;   // head row
    const ib  = (x,y) => x>=0&&x<gridWidth&&y>=0&&y<gridHeight;
    const at  = (x,y) => ib(x,y) ? grid[x][y] : null;

    // ── classify cells ──────────────────────────────────────
    const isFluid   = p => p instanceof Water||p instanceof Saltwater||
                           p instanceof Alcohol||p instanceof Blood||p instanceof Slime||
                           p instanceof Honey||p instanceof Mercury||p instanceof Oil;
    const isGas     = p => p instanceof Steam||p instanceof Smoke||p instanceof ToxicGas||
                           p instanceof Methane||p instanceof Hydrogen||p instanceof Oxygen||
                           p instanceof Nitrogen||p instanceof Propane||p instanceof Fog||
                           p instanceof AntiGas||p instanceof Electron||p instanceof Proton;
    const isPassable= p => !p || isFluid(p) || isGas(p);
    const isSolid   = p => p && !isFluid(p) && !isGas(p) && !(p instanceof Human);

    // ── DEATH: fire / lava ───────────────────────────────────
    const fireDirs = [];
    for(const [dx,dy] of DIRS){
        let n=at(this.x+dx,this.y+dy); if(n instanceof Fire||n instanceof Lava||n instanceof Ember) fireDirs.push(true);
        if(hY>=0){n=at(this.x+dx,hY+dy); if(n instanceof Fire||n instanceof Lava||n instanceof Ember) fireDirs.push(true);}
    }
    if(fireDirs.length){
        const bx=this.x,by=this.y; this.destroy();
        if(ib(bx,by)&&!grid[bx][by]){const f=new Fire(bx,by);particles.push(f);grid[bx][by]=f;}
        if(ib(bx,hY)&&!grid[bx][hY]){const f=new Fire(bx,hY);particles.push(f);grid[bx][hY]=f;}
        return;
    }

    // ── DEATH: chemicals / special ──────────────────────────
    const deadly = p => p instanceof Acid||p instanceof Superacid||p instanceof Plasma||
                        p instanceof Void||p instanceof Destroyer||p instanceof Antimatter||
                        p instanceof ToxicGas||p instanceof Lightning||p instanceof Virus;
    for(const [dx,dy] of DIRS){
        if(deadly(at(this.x+dx,this.y+dy))||deadly(at(this.x+dx,hY+dy))){ this.destroy(); return; }
    }

    // ── DROWNING ─────────────────────────────────────────────
    const bodyCell = at(this.x, this.y);
    const headCell = at(this.x, hY);
    const submerged = isFluid(bodyCell) || isFluid(headCell);
    if(submerged){ this.drownTimer=(this.drownTimer||0)+1; }
    else          { this.drownTimer=0; }
    if(this.drownTimer > 90){ this.destroy(); return; }   // ~1.5s underwater

    // ── MOVEMENT TICK ────────────────────────────────────────
    this.moveTimer++;
    if(this.moveTimer < 5) return;
    this.moveTimer = 0;

    // ── GRAVITY ──────────────────────────────────────────────
    const belowBody = at(this.x, this.y+1);
    if(this.y+1 < gridHeight && isPassable(belowBody) && !(belowBody instanceof Human)){
        grid[this.x][this.y]=null; this.y++; grid[this.x][this.y]=this; return;
    }

    // ── RANDOM TURN ──────────────────────────────────────────
    if(Math.random() < 0.06) this.vx *= -1;

    // ── HORIZONTAL WALK ──────────────────────────────────────
    const nx = this.x + this.vx;
    if(ib(nx, this.y) && ib(nx, hY)){
        const bodyFwd = at(nx, this.y);
        const headFwd = at(nx, hY);
        if(isPassable(bodyFwd) && isPassable(headFwd)){
            // Need solid floor ahead (or at bottom)
            if(isSolid(at(nx, this.y+1)) || this.y+1>=gridHeight){
                grid[this.x][this.y]=null; this.x=nx; grid[this.x][this.y]=this;
            } else { this.vx *= -1; }   // ledge — turn
        } else if(isSolid(bodyFwd) && isPassable(at(this.x,hY-1)) && isPassable(at(nx,hY-1))){
            // Climb 1 step — step up then forward
            grid[this.x][this.y]=null; this.y--; this.x=nx; grid[this.x][this.y]=this;
        } else { this.vx *= -1; }
    } else { this.vx *= -1; }

    // ── THROW STUFF ───────────────────────────────────────────
    this.throwTimer++;
    let rizz = getRandomInt(10);
    if(this.throwTimer > 1 && Math.random() < 0.25){
        this.throwTimer = 0;
        // Arc: 2 cells ahead, 1 cell above head
        const tx = this.x + this.vx * 2;
        const ty = hY - 1;
        if(ib(tx,ty) && !grid[tx][ty]){
            if (rizz === 0) {const s=new Sand(tx,ty); particles.push(s); grid[tx][ty]=s;}
            if (rizz === 2) {const s=new Sand(tx,ty); particles.push(s); grid[tx][ty]=s;}
            if (rizz === 3) {const s=new Sand(tx,ty); particles.push(s); grid[tx][ty]=s;}
            else if (rizz === 1) {const d=new Dirt(tx,ty); particles.push(d); grid[tx][ty]=d;}
            else if (rizz === 4) {const d=new Dirt(tx,ty); particles.push(d); grid[tx][ty]=d;}
            else if (rizz === 5) {const d=new Dirt(tx,ty); particles.push(d); grid[tx][ty]=d;}
            else if (rizz === 8) {const h=new Human(tx,ty); particles.push(h); grid[tx][ty]=h;}
            else if (rizz === 9) {const h=new Human(tx,ty); particles.push(h); grid[tx][ty]=h;}
        } else {
            // Fallback: drop at feet
            const fx=this.x, fy=this.y+1;
            if(ib(fx,fy)&&!grid[fx][fy]){const s=new Sand(fx,fy);particles.push(s);grid[fx][fy]=s;}
        }
    }
};

Human.prototype.draw = function() {
    const s  = cellSize;
    const bx = this.x * s;        // body pixel x
    const by = this.y * s;        // body pixel y  (lower/feet cell)
    const hy = (this.y - 1) * s;  // head pixel y  (upper cell)

    // ── Body — green shirt ───────────────────────────────────
    ctx.fillStyle = '#336633';
    ctx.fillRect(bx+1, by+1, s-2, s-2);
    // shirt collar detail
    ctx.fillStyle = '#2a5a2a';
    ctx.fillRect(bx+3, by+1, s-6, 2);

    // ── Arms (animate with walk) ─────────────────────────────
    const armSwing = Math.floor(frameCount / 5) % 2;
    ctx.fillStyle = '#ffcc88';
    if(armSwing){ ctx.fillRect(bx,    by+2, 2, 5); ctx.fillRect(bx+s-2, by+4, 2, 5); }
    else        { ctx.fillRect(bx,    by+4, 2, 5); ctx.fillRect(bx+s-2, by+2, 2, 5); }

    // ── Legs (animate opposite to arms) ─────────────────────
    const legSwing = armSwing;
    ctx.fillStyle = '#223366';
    if(legSwing){ ctx.fillRect(bx+2,  by+s-4, 3, 4); ctx.fillRect(bx+s-5,by+s-3, 3, 3); }
    else        { ctx.fillRect(bx+2,  by+s-3, 3, 3); ctx.fillRect(bx+s-5,by+s-4, 3, 4); }

    // ── Head — tan skin ──────────────────────────────────────
    ctx.fillStyle = '#ffcc88';
    ctx.fillRect(bx+2, hy+1, s-4, s-2);

    // ── Hair ─────────────────────────────────────────────────
    ctx.fillStyle = '#4a2800';
    ctx.fillRect(bx+2, hy+1, s-4, 3);

    // ── Eyes (direction-aware) ───────────────────────────────
    ctx.fillStyle = '#111';
    if(this.vx > 0){
        ctx.fillRect(bx+s-5, hy+4, 2, 2);
        ctx.fillRect(bx+s-3, hy+4, 1, 2);
    } else {
        ctx.fillRect(bx+2,   hy+4, 2, 2);
        ctx.fillRect(bx+4,   hy+4, 1, 2);
    }

    // ── Mouth (tiny line) ────────────────────────────────────
    ctx.fillStyle = '#cc8855';
    ctx.fillRect(bx+4, hy+s-4, s-8, 1);

    // ── Drown blue tint overlay ──────────────────────────────
    if(this.drownTimer > 30){
        ctx.globalAlpha = Math.min(0.65, (this.drownTimer-30)/60 * 0.65);
        ctx.fillStyle = '#2266ff';
        ctx.fillRect(bx+1, by+1, s-2, s-2);
        ctx.fillRect(bx+2, hy+1, s-4, s-2);
        ctx.globalAlpha = 1;
    }
};
Poop.prototype.update = function() {
    if (isNextTo(this,Destroyer)||isNextTo(this,Acid)||isNextTo(this,Plasma)||isNextTo(this,Superacid)||isNextTo(this,Void)) { this.destroy(); return; }
    if (isNextTo(this,Fire)||isNextTo(this,Lava)||isNextTo(this,Ember)||isNextTo(this,Lightning)||isNextTo(this,Human)||isNextTo(this,Lava)) {
        let bx=this.x,by=this.y; this.destroy(); explode(bx,by,40);
        return;
    }
    powderFall(this);
};
Poop.prototype.draw = function() { ctx.fillStyle=this.finalColor; ctx.fillRect(this.x*cellSize,this.y*cellSize,cellSize,cellSize); };

// ============================================================
// SAVE / LOAD
// ============================================================
function saveToJSON() {
    const data = {
        version: "1.7.0",
        gridWidth, gridHeight, cellSize,
        particles: particles.filter(p=>!p.isDead).map(p => {
            const obj = { type: p.constructor.name };
            for (let k in p) {
                if (Object.prototype.hasOwnProperty.call(p,k) && typeof p[k] !== 'function' && k!=='isDead') {
                    obj[k] = p[k];
                }
            }
            return obj;
        })
    };
    const blob = new Blob([JSON.stringify(data,null,0)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const defaultName = `sandbox_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}`;
    const rawName = prompt('💾  Save File\n\nEnter a file name (without extension):', defaultName);
    if (rawName === null) return;
    a.download = (rawName.trim() || defaultName) + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
}

function loadFromJSON(inputElement) {
    const file = inputElement.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            particles = [];
            grid = Array.from({length:gridWidth}, ()=>Array(gridHeight).fill(null));
            (data.particles||[]).forEach(obj => {
                const Ctor = TYPE_MAP[obj.type];
                if (!Ctor) return;
                const p = new Ctor(obj.x||0, obj.y||0);
                Object.keys(obj).forEach(k => { if (k!=='type') p[k]=obj[k]; });
                if (p.x>=0&&p.x<gridWidth&&p.y>=0&&p.y<gridHeight&&!grid[p.x][p.y]) {
                    particles.push(p); grid[p.x][p.y]=p;
                }
            });
            inputElement.value='';
        } catch(err) {
            alert('Failed to load save file:\n'+err.message);
        }
    };
    reader.readAsText(file);
}

// ============================================================
// ERASE
// ============================================================
function erase(x, y) { eraseArea(x, y); }

// ============================================================
// SPAWN
// ============================================================
function spawnParticle(x, y, Ctor) { spawnArea(x, y, Ctor); }
// Original spawns
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
// v1.7 spawns
function spawnCharcoal(x,y){spawnParticle(x,y,Charcoal);}
function spawnSulfur(x,y){spawnParticle(x,y,Sulfur);}
function spawnCoal(x,y){spawnParticle(x,y,Coal);}
function spawnChalk(x,y){spawnParticle(x,y,Chalk);}
function spawnGravel(x,y){spawnParticle(x,y,Gravel);}
function spawnSteel(x,y){spawnParticle(x,y,Steel);}
function spawnDiamond(x,y){spawnParticle(x,y,Diamond);}
function spawnWax(x,y){spawnParticle(x,y,Wax);}
function spawnCeramic(x,y){spawnParticle(x,y,Ceramic);}
function spawnBrick(x,y){spawnParticle(x,y,Brick);}
function spawnAlcohol(x,y){spawnParticle(x,y,Alcohol);}
function spawnMercury(x,y){spawnParticle(x,y,Mercury);}
function spawnHoney(x,y){spawnParticle(x,y,Honey);}
function spawnTar(x,y){spawnParticle(x,y,Tar);}
function spawnSlime(x,y){spawnParticle(x,y,Slime);}
function spawnHydrogen(x,y){spawnParticle(x,y,Hydrogen);}
function spawnOxygen(x,y){spawnParticle(x,y,Oxygen);}
function spawnNitrogen(x,y){spawnParticle(x,y,Nitrogen);}
function spawnPropane(x,y){spawnParticle(x,y,Propane);}
function spawnFog(x,y){spawnParticle(x,y,Fog);}
function spawnLightning(x,y){spawnParticle(x,y,Lightning);}
function spawnAntimatter(x,y){spawnParticle(x,y,Antimatter);}
function spawnEmber(x,y){spawnParticle(x,y,Ember);}
function spawnGel(x,y){spawnParticle(x,y,Gel);}
function spawnVoid(x,y){spawnParticle(x,y,Void);}
function spawnCrystal(x,y){spawnParticle(x,y,Crystal);}
function spawnRust(x,y){spawnParticle(x,y,Rust);}
function spawnBlood(x,y){spawnParticle(x,y,Blood);}
function spawnNitroGel(x,y){spawnParticle(x,y,NitroGel);}
function spawnSuperacid(x,y){spawnParticle(x,y,Superacid);}

// v1.8 spawns
function spawnWire(x,y){spawnArea(x,y,Wire);}
function spawnBattery(x,y){spawnArea(x,y,Battery);}
function spawnPump(x,y){spawnArea(x,y,Pump);}
function spawnBase(x,y){spawnArea(x,y,Base);}
function spawnProton(x,y){spawnArea(x,y,Proton);}
function spawnElectron(x,y){spawnArea(x,y,Electron);}
function spawnPoop(x,y){spawnArea(x,y,Poop);}
function spawnHuman(x,y){
    const cx=Math.floor(x/cellSize), cy=Math.floor(y/cellSize);
    for(let dx=-brushSize+1;dx<brushSize;dx++){
        const bx=cx+dx;
        if(bx<0||bx>=gridWidth||cy<0||cy>=gridHeight||cy-1<0) continue;
        if(!grid[bx][cy]&&!grid[bx][cy-1]){
            const h=new Human(bx,cy); particles.push(h); grid[bx][cy]=h;
        }
    }
}
// ============================================================
// SELECTION
// ============================================================
function setSelected(n) { selected=n; document.body.style.cursor=n==="erase"?"not-allowed":"crosshair"; }
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
// v1.7
function charcoalSelected(){setSelected("charcoal");}
function sulfurSelected(){setSelected("sulfur");}
function coalSelected(){setSelected("coal");}
function chalkSelected(){setSelected("chalk");}
function gravelSelected(){setSelected("gravel");}
function steelSelected(){setSelected("steel");}
function diamondSelected(){setSelected("diamond");}
function waxSelected(){setSelected("wax");}
function ceramicSelected(){setSelected("ceramic");}
function brickSelected(){setSelected("brick");}
function alcoholSelected(){setSelected("alcohol");}
function mercurySelected(){setSelected("mercury");}
function honeySelected(){setSelected("honey");}
function tarSelected(){setSelected("tar");}
function slimeSelected(){setSelected("slime");}
function hydrogenSelected(){setSelected("hydrogen");}
function oxygenSelected(){setSelected("oxygen");}
function nitrogenSelected(){setSelected("nitrogen");}
function propaneSelected(){setSelected("propane");}
function fogSelected(){setSelected("fog");}
function lightningSelected(){setSelected("lightning");}
function antimatterSelected(){setSelected("antimatter");}
function emberSelected(){setSelected("ember");}
function gelSelected(){setSelected("gel");}
function voidSelected(){setSelected("void");}
function crystalSelected(){setSelected("crystal");}
function rustSelected(){setSelected("rust");}
function bloodSelected(){setSelected("blood");}
function nitrogelSelected(){setSelected("nitrogel");}
function superacidSelected(){setSelected("superacid");}
function poopSelected(){setSelected("poop");}

// v1.8
function wireSelected(){setSelected("wire");}
function batterySelected(){setSelected("battery");}
function pumpSelected(){setSelected("pump");}
function baseSelected(){setSelected("base");}
function protonSelected(){setSelected("proton");}
function electronSelected(){setSelected("electron");}
function humanSelected(){setSelected("human");}
function mixSelected(){setSelected("mix");}
// ============================================================
// MOUSE
// ============================================================
let isMouseDown=false, mouseX=0, mouseY=0;
canvas.addEventListener('mousedown',(e)=>{isMouseDown=true;updateMousePos(e);});
window.addEventListener('mouseup',()=>isMouseDown=false);
canvas.addEventListener('mousemove',(e)=>updateMousePos(e));
function updateMousePos(e){const r=canvas.getBoundingClientRect();mouseX=e.clientX-r.left;mouseY=e.clientY-r.top;}

// Spawn map for cleaner dispatch
const SPAWN_MAP = {
    dirt:spawnDirt, sand:spawnSand, ash:spawnAsh, stone:spawnStone, destroyer:spawnDestroyer,
    wood:spawnWood, water:spawnWater, steam:spawnSteam, antiliquid:spawnAntiLiquid,
    antigas:spawnAntiGas, fire:spawnFire, heater:spawnHeater, bomb:spawnBomb,
    antipowder:spawnAntiPowder, cloner:spawnCloner, oil:spawnOil, acid:spawnAcid,
    snow:spawnSnow, ice:spawnIce, lava:spawnLava, obsidian:spawnObsidian, glass:spawnGlass,
    gunpowder:spawnGunpowder, fuse:spawnFuse, tnt:spawnTNT, rubber:spawnRubber,
    sponge:spawnSponge, smoke:spawnSmoke, toxicgas:spawnToxicGas, virus:spawnVirus,
    salt:spawnSalt, saltwater:spawnSaltwater, concrete:spawnConcrete, cooler:spawnCooler,
    methane:spawnMethane, mud:spawnMud, plasma:spawnPlasma,
    charcoal:spawnCharcoal, sulfur:spawnSulfur, coal:spawnCoal, chalk:spawnChalk, gravel:spawnGravel,
    steel:spawnSteel, diamond:spawnDiamond, wax:spawnWax, ceramic:spawnCeramic, brick:spawnBrick,
    alcohol:spawnAlcohol, mercury:spawnMercury, honey:spawnHoney, tar:spawnTar, slime:spawnSlime,
    hydrogen:spawnHydrogen, oxygen:spawnOxygen, nitrogen:spawnNitrogen, propane:spawnPropane, fog:spawnFog,
    lightning:spawnLightning, antimatter:spawnAntimatter, ember:spawnEmber, gel:spawnGel, void:spawnVoid,
    crystal:spawnCrystal, rust:spawnRust, blood:spawnBlood, nitrogel:spawnNitroGel, superacid:spawnSuperacid,
    wire:spawnWire, battery:spawnBattery, pump:spawnPump, base:spawnBase,
    proton:spawnProton, electron:spawnElectron, human:spawnHuman, poop:spawnPoop
};

// ============================================================
// MAIN LOOP
// ============================================================
function update() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if (!paused) {
        frameCount++;
        propagateElectricity();
        for (let i=particles.length-1;i>=0;i--) { if (!particles[i].isDead) particles[i].update(); }
        particles=particles.filter(p=>!p.isDead);
    }
    for (let i=0;i<particles.length;i++) { if (!particles[i].isDead) particles[i].draw(); }
    if (isMouseDown) {
        if (selected==="erase") eraseArea(mouseX,mouseY);
        else if (selected==="mix") mixArea(mouseX,mouseY);
        else if (SPAWN_MAP[selected]) SPAWN_MAP[selected](mouseX,mouseY);
    }
    drawBrushCursor();
    requestAnimationFrame(update);
}
update();

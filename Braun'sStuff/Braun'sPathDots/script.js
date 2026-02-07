const gameMap = document.getElementById("map");
const ctx = gameMap.getContext("2d");
const scoreElement = document.getElementById("score");

const difficulty = prompt("Difficulty? (Gets very hard after 4)");

let score = 0;
let missed = 0;

let rickRoll = new Audio("nevergonnagiveyouup.mp3");
let audioStarted = false;

function Dot(x, y, color, type, length) {
    this.x = x;
    this.y = y;
    this.color = (color === 1) ? "red" : (color === 2) ? "blue" : (color === 3) ? "green" : (color === 4) ? "yellow" : "purple";
    this.speed = Math.floor(difficulty * 3);
    this.active = true;
    this.type = type;
    this.height = length;
    this.isBeingHeld = false;
    this.hasStarted = false;
    this.missed = false; 
}

Dot.prototype.draw = function() {
    if (!this.active) return;

    const hitLine = 500;
    
    if (this.y !== hitLine || this.type === 1) {
        this.y += this.speed;
    }

    ctx.fillStyle = this.color;
    if (this.type === 1) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.fillRect(this.x - 20, this.y - this.height, 40, this.height);
    }

    if (this.y - this.height > 700) this.active = false;
}

const keysPressed = { 
    Digit1: false, 
    Digit2: false, 
    Digit3: false, 
    Digit4: false, 
    Digit5: false 
};

document.addEventListener('keydown', (e) => { 
    if(keysPressed.hasOwnProperty(e.code)) keysPressed[e.code] = true;

    if (Number(difficulty) === 6 && !audioStarted) {
        rickRoll.play().catch(error => console.log("Interaction required:", error));
        score = 67;
        audioStarted = true;
    }
});

document.addEventListener('keyup', (e) => { if(keysPressed.hasOwnProperty(e.code)) keysPressed[e.code] = false; });

function checkHit(dot, keyCode) {
    if (!dot.active || dot.missed) return;

    const hitLine = 500;
    const isPressing = keysPressed[keyCode];

    if (dot.type === 2) {
        if (!dot.hasStarted && dot.y >= 450 && dot.y <= 550 && isPressing) {
            dot.hasStarted = true;
        }

        if (dot.hasStarted) {
            if (isPressing && dot.y >= hitLine && (dot.y - dot.height) <= hitLine) {
                dot.isBeingHeld = true;
                dot.y = hitLine;
                dot.height -= dot.speed;
                score += 1;
            } else {
                dot.isBeingHeld = false;
                if (!isPressing && dot.height > 0) {
                    dot.active = false; 
                }
            }
        }
        if (dot.height <= 0) dot.active = false;

    } else {
        if (dot.y <= 550 && dot.y >= 440 && isPressing && !dot.processed) {
            dot.active = false;
            score += 10;
        }
        
        if (isPressing) {
            dot.processed = true;
        } else {
            dot.processed = false;
        }
    }
}

let dots = [];

function spawnDot() {
    const lanes = [400, 480, 560, 640, 720];
    const activeLanesCount = Math.max(2, Math.min(5, Number(difficulty)));
    const activeLanes = lanes.slice(0, activeLanesCount);
    
    const randomLaneIndex = Math.floor(Math.random() * activeLanes.length);
    const x = activeLanes[randomLaneIndex];
    
    const type = Math.random() > 0.8 ? 2 : 1;
    const length = type === 2 ? 150 : 1;
    const color = randomLaneIndex + 1;
    
    dots.push(new Dot(x, -50, color, type, length));
}

function animate() {
    ctx.clearRect(0, 0, gameMap.width, gameMap.height);

    const activeLanesCount = Math.max(2, Math.min(5, Number(difficulty)));
    const laneXPositions = [400, 480, 560, 640, 720];

    ctx.strokeStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    for (let i = 0; i < activeLanesCount; i++) {
        const x = laneXPositions[i];
        ctx.strokeRect(x - 20, 480, 40, 40);
        ctx.fillStyle = "black";
        ctx.fillText(i + 1, x, 507); 
    }

    if (Math.random() < 0.02 * (difficulty / 2)) {
        spawnDot();
    }

    dots.forEach((d, index) => {
        const laneIndex = laneXPositions.indexOf(d.x);
        const laneKey = `Digit${laneIndex + 1}`;

        checkHit(d, laneKey);
        d.draw();

        if (d.active && !d.missed && d.y > 550) {
            score = Math.max(0, score - 5);
            missed++;
            d.missed = true;
            d.color = "gray";
        }

        if (!d.active) {
            dots.splice(index, 1);
        }
    });
    if (score < 1000) {
        scoreElement.textContent = "Score: " + score + "| Missed: " + missed;
    } else {
        scoreElement.textContent = "You win! :O"
    }
    requestAnimationFrame(animate);
}

animate();
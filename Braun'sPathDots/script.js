const gameMap = document.getElementById("map");
const ctx = gameMap.getContext("2d");
const scoreElement = document.getElementById("score");

const song = prompt("Song?");

let score = 0;
let missed = 0;

let national_anthem = new Audio("national_anthem.mp3");
let audioStarted = false;

function Dot(x, y, color, type, length) {
    this.x = x;
    this.y = y;
    this.color = (color === 1) ? "red" : (color === 2) ? "blue" : (color === 3) ? "green" : (color === 4) ? "yellow" : "purple";
    this.speed = 10;
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

let levelMap = [
    // --- INTRO: "Oh, say can you see" ---
    { time: 800, lane: 0, type: 1 },    // Oh
    { time: 1200, lane: 2, type: 1 },   // say
    { time: 1800, lane: 1, type: 2, length: 400 }, // can 
    { time: 2300, lane: 3, type: 1 },   // you
    { time: 2800, lane: 4, type: 2, length: 800 }, // see

    // --- "By the dawn's early light" (Syncopated) ---
    { time: 4200, lane: 0, type: 1 }, 
    { time: 4400, lane: 1, type: 1 }, 
    { time: 4600, lane: 2, type: 1 }, 
    { time: 5200, lane: 3, type: 1 }, 
    { time: 5800, lane: 2, type: 1 }, 
    { time: 6400, lane: 1, type: 2, length: 1000 },

    // --- "What so proudly we hailed" (Chords) ---
    { time: 9200, lane: 0, type: 1 }, 
    { time: 9200, lane: 4, type: 1 }, // Double hit
    { time: 10000, lane: 2, type: 1 }, 
    { time: 10800, lane: 1, type: 2, length: 600 },

    // --- "At the twilight's last gleaming" ---
    { time: 12800, lane: 4, type: 1 },
    { time: 13200, lane: 3, type: 1 },
    { time: 13600, lane: 2, type: 1 },
    { time: 14000, lane: 1, type: 1 },
    { time: 14800, lane: 0, type: 2, length: 1200 },

    // --- "Whose broad stripes and bright stars" (Fast run) ---
    { time: 17800, lane: 0, type: 1 },
    { time: 18200, lane: 1, type: 1 },
    { time: 18600, lane: 2, type: 1 },
    { time: 19400, lane: 3, type: 2, length: 400 },
    { time: 20200, lane: 2, type: 1 },
    { time: 20800, lane: 1, type: 1 },
    { time: 21400, lane: 0, type: 1 },

    // --- "Through the perilous fight" ---
    { time: 23800, lane: 0, type: 1 },
    { time: 23800, lane: 2, type: 1 }, // Chord
    { time: 24500, lane: 1, type: 1 },
    { time: 25200, lane: 4, type: 2, length: 1200 },

    // --- "O'er the ramparts we watched" ---
    { time: 28000, lane: 4, type: 1 },
    { time: 28800, lane: 3, type: 1 },
    { time: 29600, lane: 2, type: 2, length: 500 },

    // --- "Were so gallantly streaming" (Melody Walk) ---
    { time: 32000, lane: 0, type: 1 },
    { time: 32400, lane: 1, type: 1 },
    { time: 32800, lane: 2, type: 1 },
    { time: 33200, lane: 3, type: 1 },
    { time: 34000, lane: 4, type: 2, length: 1500 },

    // --- "And the rocket's red glare" (Intensity Increase) ---
    { time: 38000, lane: 0, type: 1 },
    { time: 38300, lane: 0, type: 1 },
    { time: 38600, lane: 0, type: 1 }, // Triple tap
    { time: 39500, lane: 2, type: 2, length: 800 },
    { time: 41000, lane: 4, type: 1 },

    // --- "The bombs bursting in air" (Drum pattern) ---
    { time: 42800, lane: 1, type: 1 },
    { time: 42800, lane: 3, type: 1 }, // Chord
    { time: 43200, lane: 1, type: 1 },
    { time: 43200, lane: 3, type: 1 }, // Chord
    { time: 44000, lane: 2, type: 2, length: 1000 },

    // --- "Gave proof through the night" ---
    { time: 47500, lane: 4, type: 1 },
    { time: 48000, lane: 3, type: 1 },
    { time: 48500, lane: 2, type: 1 },
    { time: 49000, lane: 1, type: 1 },
    { time: 50000, lane: 0, type: 2, length: 1500 },

    // --- "That our flag was still there" ---
    { time: 53500, lane: 2, type: 1 },
    { time: 53500, lane: 4, type: 1 }, 
    { time: 55000, lane: 3, type: 2, length: 2000 },

    // --- "Oh, say does that star-spangled" (Rapid Fire) ---
    { time: 59000, lane: 0, type: 1 },
    { time: 59500, lane: 1, type: 1 },
    { time: 60000, lane: 2, type: 1 },
    { time: 60500, lane: 3, type: 1 },
    { time: 61000, lane: 4, type: 1 },

    // --- "Banner yet wave" ---
    { time: 63500, lane: 2, type: 2, length: 1500 },
    { time: 65500, lane: 0, type: 1 },
    { time: 65500, lane: 4, type: 1 },
    { time: 67000, lane: 2, type: 2, length: 1000 },

    // --- "O'er the land of the free" (Big Crescendo) ---
    { time: 71000, lane: 0, type: 1 },
    { time: 71500, lane: 1, type: 1 },
    { time: 72000, lane: 2, type: 1 },
    { time: 73000, lane: 0, type: 1 },
    { time: 73000, lane: 4, type: 1 }, // Power chord
    { time: 74500, lane: 2, type: 2, length: 3500 }, // Hold for "FREE"

    // --- "And the home of the brave" (Final Stabs) ---
    { time: 79500, lane: 4, type: 1 },
    { time: 80000, lane: 3, type: 1 },
    { time: 80500, lane: 2, type: 1 },
    { time: 81000, lane: 1, type: 1 },
    { time: 81500, lane: 0, type: 2, length: 5000 } // Final hold
];

const keysPressed = { 
    Digit1: false, 
    Digit2: false, 
    Digit3: false, 
    Digit4: false, 
    Digit5: false 
};

document.addEventListener('keydown', (e) => { 
    if(keysPressed.hasOwnProperty(e.code)) keysPressed[e.code] = true;

    if (Number(song) === 6 && !audioStarted) {
        national_anthem.play().catch(error => console.log("Interaction required:", error));
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

function spawnDot(laneIndex, type = 1, length = 1) {
    const lanes = [400, 480, 560, 640, 720];
    const x = lanes[laneIndex];
    const color = laneIndex + 1;
    
    dots.push(new Dot(x, -50, color, type, length));
}

let startTime = null;

function animate(currentTime) {
    if (!startTime) startTime = currentTime;
    
    const elapsed = currentTime - startTime;

    ctx.clearRect(0, 0, gameMap.width, gameMap.height);

    if (score < 1990) {
        if (levelMap.length > 0 && elapsed >= levelMap[0].time) {
            const note = levelMap.shift();
            spawnDot(note.lane, note.type, note.length || 1);
        }
    }

    const activeLanesCount = Math.max(2, Math.min(5, Number(song)));
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

    if (Number(song) === 6) {
        if (score < 1990) {
            scoreElement.textContent = "Score: " + score + " | Missed: " + missed;
        } else {
            scoreElement.textContent = "You win! :O";
        }
    }

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
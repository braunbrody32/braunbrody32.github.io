const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const cellSize = 10; // Size of one block
const gridWidth = Math.floor(canvas.width / cellSize);
const gridHeight = Math.floor(canvas.height / cellSize);

// Create a 2D grid
let grid = Array.from({ length: gridWidth }, () => Array(gridHeight).fill(null));
let particles = [];
let selected = "none";

let frameCount = 0;

function getRandomInt(max) {
    return Math.floor(Math.random() * max); 
}

function Dirt(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;
    
    const color1 = "#732A19";
    const color2 = "#662516";
    
    // Math.random() returns 0 to 0.99; multiply by 2 and floor for 0 or 1
    this.finalColor = Math.random() < 0.5 ? color1 : color2;
}

function Sand(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;
    
    const color1 = "#E8CB87";
    const color2 = "#E0C37E";
    
    // Math.random() returns 0 to 0.99; multiply by 2 and floor for 0 or 1
    this.finalColor = Math.random() < 0.5 ? color1 : color2;
}

function Ash(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;
    
    const color1 = "#828282";
    const color2 = "#919090";
    
    // Math.random() returns 0 to 0.99; multiply by 2 and floor for 0 or 1
    this.finalColor = Math.random() < 0.5 ? color1 : color2;
}

function AntiPowder(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;
    
    const color1 = "#FF00FF";
    const color2 = "#E802E8";
    
    // Math.random() returns 0 to 0.99; multiply by 2 and floor for 0 or 1
    this.finalColor = Math.random() < 0.5 ? color1 : color2;
}

function AntiLiquid(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;
    this.direction = Math.random() < 0.5 ? 1 : -1;
    
    const color1 = "#A128BF";
    const color2 = "#AD25CF";
    
    // Math.random() returns 0 to 0.99; multiply by 2 and floor for 0 or 1
    this.finalColor = Math.random() < 0.5 ? color1 : color2;
}

function AntiGas(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;

    const color1 = "#c767de"; 
    const color2 = "#b876c9";
    this.finalColor = Math.random() < 0.5 ? color1 : color2;
    this.direction = Math.random() > 0.5 ? 1 : -1; 
    this.frameDelay = 3; 
    this.life = 250 + Math.random() * 100; 
}

function Destroyer(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;
    
    const color1 = "#404040";
    const color2 = "#333333";
    
    // Math.random() returns 0 to 0.99; multiply by 2 and floor for 0 or 1
    this.finalColor = Math.random() < 0.5 ? color1 : color2;
}

function Bomb(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;
    
    const color1 = "#1d612c";
    const color2 = "#246d1c";
    
    // Math.random() returns 0 to 0.99; multiply by 2 and floor for 0 or 1
    this.finalColor = Math.random() < 0.5 ? color1 : color2;
}

function Stone(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;
    
    const color1 = "#8F8F8F";
    const color2 = "#7D7C7C";
    
    // Math.random() returns 0 to 0.99; multiply by 2 and floor for 0 or 1
    this.finalColor = Math.random() < 0.5 ? color1 : color2;
}

function Wood(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;
    
    const color1 = "#6B510E";
    const color2 = "#5C450C";

    this.temp = 20;
    
    // Math.random() returns 0 to 0.99; multiply by 2 and floor for 0 or 1
    this.finalColor = Math.random() < 0.5 ? color1 : color2;
}

function Cloner(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;
    
    const color1 = "#A9AB65";
    const color2 = "#9A9C5C";
    
    // Math.random() returns 0 to 0.99; multiply by 2 and floor for 0 or 1
    this.finalColor = Math.random() < 0.5 ? color1 : color2;
}

function Acid(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;
    this.direction = Math.random() < 0.5 ? 1 : -1;
    
    const color1 = "#00FF04";
    const color2 = "#02EB06";
    this.finalColor = Math.random() < 0.5 ? color1 : color2;
}

function Water(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;

    this.temp = 17;

    this.color = "blue";
    // 1 for right, -1 for left.
    this.direction = Math.random() > 0.5 ? 1 : -1; 
}

function Oil(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;

    this.temp = 20;

    this.color = "#404040";
    // 1 for right, -1 for left.
    this.direction = Math.random() > 0.5 ? 1 : -1; 
}

function Fire(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;
    
    const color1 = "#FF4900"; 
    const color2 = "#F04602";
    this.finalColor = Math.random() < 0.5 ? color1 : color2;
    this.direction = Math.random() > 0.5 ? 1 : -1; 
    this.frameDelay = 3; 
    this.life = getRandomInt(50); 
}

function Heater(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;
    
    const color1 = "#736251";
    const color2 = "#665747";
    
    // Math.random() returns 0 to 0.99; multiply by 2 and floor for 0 or 1
    this.finalColor = Math.random() < 0.5 ? color1 : color2;
}

function Steam(gridX, gridY) {
    this.x = gridX;
    this.y = gridY;

    const color1 = "#d1d1d1"; 
    const color2 = "#e8e8e8";
    this.finalColor = Math.random() < 0.5 ? color1 : color2;
    this.direction = Math.random() > 0.5 ? 1 : -1; 
    this.frameDelay = 3; 
    this.life = 250 + Math.random() * 100; 
}

function removeParticle(p) {
    if (grid[p.x] && grid[p.x][p.y] === p) {
        grid[p.x][p.y] = null;
    }
    
    p.isDead = true; 
}


Dirt.prototype.destroy = function() { removeParticle(this); };
Water.prototype.destroy = function() { removeParticle(this); };
Ash.prototype.destroy = function() { removeParticle(this); };
Steam.prototype.destroy = function() { removeParticle(this); };
Oil.prototype.destroy = function() { removeParticle(this); };
Fire.prototype.destroy = function() { removeParticle(this); };
Sand.prototype.destroy = function() { removeParticle(this); };
Wood.prototype.destroy = function() { removeParticle(this); };
Heater.prototype.destroy = function() { removeParticle(this); };
Cloner.prototype.destroy = function() { removeParticle(this); };
Acid.prototype.destroy = function() { removeParticle(this); };
AntiPowder.prototype.destroy = function() { removeParticle(this); };
AntiLiquid.prototype.destroy = function() { removeParticle(this); };
AntiGas.prototype.destroy = function() { removeParticle(this); };
Bomb.prototype.destroy = function() { removeParticle(this); };

Dirt.prototype.update = function() {
    let nextY = this.y + 1;

    let isTouchingDestroyer = false;
    const neighbors = [
        [0, 1],  // Down
        [0, -1], // Up
        [1, 0],  // Right
        [-1, 0]  // Left
    ];

    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        // Bounds check
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Destroyer || neighbor instanceof Acid) {
                isTouchingDestroyer = true;
                break;
            }
        }
    }

    if (isTouchingDestroyer) {
        const currentX = this.x;
        const currentY = this.y;
        this.destroy();
    }

    if (nextY < gridHeight) {
        let target = grid[this.x][nextY];

        // 1. FALL THROUGH EMPTY SPACE OR SINK THROUGH WATER
        if (target === null || target instanceof Water || target instanceof Oil) {
            let below = target;
            
            // Clear current spot
            grid[this.x][this.y] = null;

            if (below instanceof Water || below instanceof Oil) {
                below.y = this.y;
                grid[this.x][below.y] = below;
            }

            this.y = nextY;
            grid[this.x][this.y] = this;
        } 
        // 2. SLUMP LOGIC (If blocked by solid dirt)
        else {
            let directions = [this.x - 1, this.x + 1];
            if (Math.random() > 0.5) directions.reverse();

            for (let nextX of directions) {
                if (nextX >= 0 && nextX < gridWidth) {
                    let sideTarget = grid[nextX][nextY];
                    // Can also slump diagonally through water
                    if (sideTarget === null || sideTarget instanceof Water) {
                        grid[this.x][this.y] = null;
                        
                        if (sideTarget instanceof Water) {
                            sideTarget.x = this.x;
                            sideTarget.y = this.y;
                            grid[this.x][this.y] = sideTarget;
                        }

                        this.x = nextX;
                        this.y = nextY;
                        grid[this.x][this.y] = this;
                        break;
                    }
                }
            }
        }
    }
};

Dirt.prototype.draw = function() {
    ctx.fillStyle = this.finalColor;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};

AntiPowder.prototype.update = function() {
    const neighbors = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Destroyer || neighbor instanceof Acid) {
                this.destroy();
                return;
            }
        }
    }

    let nextY = this.y - 1;

    if (nextY >= 0) {
        let target = grid[this.x][nextY];

        if (target === null || target instanceof Water || target instanceof Oil || target instanceof AntiLiquid) {
            grid[this.x][this.y] = target;
            if (target) {
                target.y = this.y;
            }

            this.y = nextY;
            grid[this.x][this.y] = this;
        } 
        else {
            let directions = [this.x - 1, this.x + 1];
            if (Math.random() > 0.5) directions.reverse();

            for (let nextX of directions) {
                if (nextX >= 0 && nextX < gridWidth) {
                    let sideTarget = grid[nextX][nextY];
                    
                    if (sideTarget === null || sideTarget instanceof Water || sideTarget instanceof Oil) {
                        grid[this.x][this.y] = sideTarget;
                        if (sideTarget) {
                            sideTarget.x = this.x;
                            sideTarget.y = this.y;
                        }

                        this.x = nextX;
                        this.y = nextY;
                        grid[this.x][this.y] = this;
                        break;
                    }
                }
            }
        }
    }
};

AntiPowder.prototype.draw = function() {
    ctx.fillStyle = this.finalColor;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};

Ash.prototype.update = function() {
    let nextY = this.y + 1;

    let isTouchingDestroyer = false;
    const neighbors = [
        [0, 1],  // Down
        [0, -1], // Up
        [1, 0],  // Right
        [-1, 0]  // Left
    ];

    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        // Bounds check
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Destroyer || neighbor instanceof Acid) {
                isTouchingDestroyer = true;
                break;
            }
        }
    }

    if (isTouchingDestroyer) {
        const currentX = this.x;
        const currentY = this.y;
        this.destroy();
    }

    if (nextY < gridHeight) {
        let target = grid[this.x][nextY];

        if (target === null || target instanceof Water || target instanceof Oil) {
            let below = target;
            
            // Clear current spot
            grid[this.x][this.y] = null;

            if (below instanceof Water || below instanceof Oil) {
                below.y = this.y;
                grid[this.x][below.y] = below;
            }

            this.y = nextY;
            grid[this.x][this.y] = this;
        } 

        else {
            let directions = [this.x - 1, this.x + 1];
            if (Math.random() > 0.5) directions.reverse();

            for (let nextX of directions) {
                if (nextX >= 0 && nextX < gridWidth) {
                    let sideTarget = grid[nextX][nextY];
                    // Can also slump diagonally through water
                    if (sideTarget === null || sideTarget instanceof Water) {
                        grid[this.x][this.y] = null;
                        
                        if (sideTarget instanceof Water) {
                            sideTarget.x = this.x;
                            sideTarget.y = this.y;
                            grid[this.x][this.y] = sideTarget;
                        }

                        this.x = nextX;
                        this.y = nextY;
                        grid[this.x][this.y] = this;
                        break;
                    }
                }
            }
        }
    }
};

Ash.prototype.draw = function() {
    ctx.fillStyle = this.finalColor;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};

Stone.prototype.update = function() {
    let target = grid[this.x][this.y];

    let isTouchingDestroyer = false;
    const neighbors = [
        [0, 1],  // Down
        [0, -1], // Up
        [1, 0],  // Right
        [-1, 0]  // Left
    ];

    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        // Bounds check
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Destroyer) {
                isTouchingDestroyer = true;
                break;
            }
        }
    }

    if (isTouchingDestroyer) {
        const currentX = this.x;
        const currentY = this.y;
        this.destroy();
    }

    if (target === null) {
            let below = target;
            
            // Clear current spot
            grid[this.x][this.y] = null;
        } 
};

Stone.prototype.draw = function() {
    ctx.fillStyle = this.finalColor;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};

Bomb.prototype.update = function() {
    let target = grid[this.x][this.y];

    let isTouchingDestroyer = false;
    const neighbors = [
        [0, 1],  // Down
        [0, -1], // Up
        [1, 0],  // Right
        [-1, 0]  // Left
    ];

    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        // Bounds check
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Destroyer) {
                isTouchingDestroyer = true;
                break;
            }
        }
    }

    if (isTouchingDestroyer) {
        const currentX = this.x;
        const currentY = this.y;
        this.destroy();
    }

    let isTouchingIgniter = false

    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        // Bounds check
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Fire || neighbor instanceof Heater) {
                isTouchingIgniter = true;
                break;
            }
        }
    }

    let nextY = this.y + 1;

    if (nextY < gridHeight) {
        let target = grid[this.x][nextY];

        if (target === null) {
            let below = target;
            
            grid[this.x][this.y] = null;

            this.y = nextY;
            grid[this.x][this.y] = this;
        }
    }

    let kaboom = false;
    let boomSize = 5;

    if (isTouchingIgniter && kaboom === false) {
        this.destroy();
        for (let i = -boomSize; i <= boomSize; i++) {
            for (let j = -boomSize; j <= boomSize; j++) {
                let nx = this.x + i, ny = this.y + j;
                if (grid[nx]?.[ny]) {
                    particles = particles.filter(p => p !== grid[nx][ny]);
                }
                let f = new Fire(nx, ny);
                particles.push(f);
                grid[nx][ny] = f;
            }
        }
        kaboom = true;
    }
};

Bomb.prototype.draw = function() {
    ctx.fillStyle = this.finalColor;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};

Destroyer.prototype.update = function() {
    let target = grid[this.x][this.y];

    if (target === null) {
        let below = target;
            
        // Clear current spot
        grid[this.x][this.y] = null;
    } 
};

Destroyer.prototype.draw = function() {
    ctx.fillStyle = this.finalColor;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};

Wood.prototype.update = function() {
    let target = grid[this.x][this.y];

    let isTouchingDestroyer = false;
    const neighboors = [
        [0, 1],  // Down
        [0, -1], // Up
        [1, 0],  // Right
        [-1, 0]  // Left
    ];

    for (let [dx, dy] of neighboors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        // Bounds check
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Destroyer || neighbor instanceof Acid) {
                isTouchingDestroyer = true;
                break;
            }
        }
    }

    if (isTouchingDestroyer) {
        const currentX = this.x;
        const currentY = this.y;
        this.destroy();
    }

    // 1. ALL-DIRECTION HEATER CHECK
    let isTouchingHeater = false;
    const neighbors = [
        [0, 1],  // Down
        [0, -1], // Up
        [1, 0],  // Right
        [-1, 0]  // Left
    ];

    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        // Bounds check
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Fire||neighbor instanceof Heater) {
                isTouchingHeater = true;
                break;
            }
        }
    }

    // 2. TEMPERATURE LOGIC
    if (isTouchingHeater) {
        this.temp += 12;
    } else if (this.temp > 20) {
        this.temp -= 0.5;
    }    

    // 3. EVAPORATION LOGIC
    if (this.temp >= 100) {
        const currentX = this.x;
        const currentY = this.y;
        this.destroy();

        let fre = new Fire(currentX, currentY);
        particles.push(fre);
        grid[currentX][currentY] = fre;
        let ash = new Ash(currentX, currentY);
        particles.push(ash);
        grid[currentX][currentY] = ash;
        return;
    }

    if (target === null) {
            let below = target;
            
            // Clear current spot
            grid[this.x][this.y] = null;
        } 
};

Wood.prototype.draw = function() {
    ctx.fillStyle = this.finalColor;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};

Heater.prototype.update = function() {
    let target = grid[this.x][this.y];

    let isTouchingDestroyer = false;
    const neighbors = [
        [0, 1],  // Down
        [0, -1], // Up
        [1, 0],  // Right
        [-1, 0]  // Left
    ];

    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        // Bounds check
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Destroyer) {
                isTouchingDestroyer = true;
                break;
            }
        }
    }

    if (isTouchingDestroyer) {
        const currentX = this.x;
        const currentY = this.y;
        this.destroy();
    }

    if (target === null) {
            let below = target;
            
            // Clear current spot
            grid[this.x][this.y] = null;
        } 
};

Heater.prototype.draw = function() {
    ctx.fillStyle = this.finalColor;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};

Sand.prototype.update = function() {
    let nextY = this.y + 1;

    let isTouchingDestroyer = false;
    const neighbors = [
        [0, 1],  // Down
        [0, -1], // Up
        [1, 0],  // Right
        [-1, 0]  // Left
    ];

    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        // Bounds check
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Destroyer || neighbor instanceof Acid) {
                isTouchingDestroyer = true;
                break;
            }
        }
    }

    if (isTouchingDestroyer) {
        const currentX = this.x;
        const currentY = this.y;
        this.destroy();
    }

    if (!this.isWet) {
        const neighbors = [
            [0, 1], [0, -1], [1, 0], [-1, 0] // Down, Up, Right, Left
        ];
        
        for (let [dx, dy] of neighbors) {
            let nx = this.x + dx;
            let ny = this.y + dy;
            
            if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
                if (grid[nx][ny] instanceof Water) {
                    this.moisture++;
                    if (this.moisture > 30) { // Changes after ~0.5 seconds of contact
                        this.isWet = true;
                        this.finalColor = this.wetColor;
                    }
                    break; 
                }
            }
        }
    }


    if (nextY < gridHeight) {
        let target = grid[this.x][nextY];

        if (target === null || target instanceof Water || target instanceof Oil) {
            let below = target;
            
            // Clear current spot
            grid[this.x][this.y] = null;

            if (below instanceof Water || below instanceof Oil) {
                below.y = this.y;
                grid[this.x][below.y] = below;
            }

            this.y = nextY;
            grid[this.x][this.y] = this;
        } 
        else {
            let directions = [this.x - 1, this.x + 1];
            if (Math.random() > 0.5) directions.reverse();

            for (let nextX of directions) {
                if (nextX >= 0 && nextX < gridWidth) {
                    let sideTarget = grid[nextX][nextY];
                    if (sideTarget === null || sideTarget instanceof Water) {
                        grid[this.x][this.y] = null;
                        
                        if (sideTarget instanceof Water) {
                            sideTarget.x = this.x;
                            sideTarget.y = this.y;
                            grid[this.x][this.y] = sideTarget;
                        }

                        this.x = nextX;
                        this.y = nextY;
                        grid[this.x][this.y] = this;
                        break;
                    }
                }
            }
        }
    }
};

Sand.prototype.draw = function() {
    ctx.fillStyle = this.finalColor;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};
                                 
Water.prototype.update = function() {   
    let nextY = this.y + 1;

    let isTouchingDestroyer = false;
    const neighboors = [
        [0, 1],  // Down
        [0, -1], // Up
        [1, 0],  // Right
        [-1, 0]  // Left
    ];

    for (let [dx, dy] of neighboors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        // Bounds check
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Destroyer || neighbor instanceof Acid) {
                isTouchingDestroyer = true;
                break;
            }
        }
    }

    if (isTouchingDestroyer) {
        const currentX = this.x;
        const currentY = this.y;
        this.destroy();
    }
    
    // 1. ALL-DIRECTION HEATER CHECK
    let isTouchingHeater = false;
    const neighbors = [
        [0, 1],  // Down
        [0, -1], // Up
        [1, 0],  // Right
        [-1, 0]  // Left
    ];

    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        // Bounds check
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Fire || neighbor instanceof Heater) {
                isTouchingHeater = true;
                break;
            }
        }
    }

    // 2. TEMPERATURE LOGIC
    if (isTouchingHeater) {
        this.temp += 10;
    } else if (this.temp > 17) {
        this.temp -= 0.5;
    }    

    // 3. EVAPORATION LOGIC
    if (this.temp >= 100) {
        const currentX = this.x;
        const currentY = this.y;
        this.destroy();

        let ws = new Steam(currentX, currentY);
        particles.push(ws);
        grid[currentX][currentY] = ws;
        return;
    }
     // 1. FALLING LOGIC: If space below is empty, fall down
    if (nextY < gridHeight && grid[this.x][nextY] === null) {
        grid[this.x][this.y] = null;
        this.y = nextY;
        grid[this.x][this.y] = this;
    } 
    // 2. FLAT SURFACE LOGIC: If on ground, move sideways
    else {
        let nextX = this.x + this.direction;

        // Check if the side space is within bounds and empty
        if (nextX >= 0 && nextX < gridWidth && grid[nextX][this.y] === null) {
            grid[this.x][this.y] = null;
            this.x = nextX;
            grid[this.x][this.y] = this;
        } else {
            // If it hits a wall or another particle, reverse direction
            this.direction *= -1;
        }
    }
};

Water.prototype.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};
AntiLiquid.prototype.update = function() {   
    const neighbors = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Destroyer || neighbor instanceof Acid) {
                this.destroy(); 
                return;
            }
        }
    }

    let nextY = this.y - 1;
    if (nextY >= 0 && grid[this.x][nextY] === null) {
        grid[this.x][this.y] = null;
        this.y = nextY;
        grid[this.x][this.y] = this;
    } 
    else {
        let nextX = this.x + this.direction;
        if (nextX >= 0 && nextX < gridWidth && grid[nextX][this.y] === null) {
            grid[this.x][this.y] = null;
            this.x = nextX;
            grid[this.x][this.y] = this;
        } else {
            this.direction *= -1;
        }
    }
};

AntiLiquid.prototype.draw = function() {
    ctx.fillStyle = this.finalColor;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};

Acid.prototype.update = function() { 
    let nextY = this.y + 1; 
    // 1. Destroyer Check
    const neighbors = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            if (grid[nx][ny] instanceof Destroyer) {
                this.destroy();
                return;
            }
        }
    }

     // 1. FALLING LOGIC: If space below is empty, fall down
    if (nextY < gridHeight && grid[this.x][nextY] === null) {
        grid[this.x][this.y] = null;
        this.y = nextY;
        grid[this.x][this.y] = this;
    } 
    // 2. FLAT SURFACE LOGIC: If on ground, move sideways
    else {
        let nextX = this.x + this.direction;

        // Check if the side space is within bounds and empty
        if (nextX >= 0 && nextX < gridWidth && grid[nextX][this.y] === null) {
            grid[this.x][this.y] = null;
            this.x = nextX;
            grid[this.x][this.y] = this;
        } else {
            // If it hits a wall or another particle, reverse direction
            this.direction *= -1;
        }
    }
};

Acid.prototype.draw = function() {
    ctx.fillStyle = this.finalColor;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};
                                 
Oil.prototype.update = function() {   
    let nextY = this.y + 1;

    let isTouchingDestroyer = false;
    const neighboors = [
        [0, 1],  // Down
        [0, -1], // Up
        [1, 0],  // Right
        [-1, 0]  // Left
    ];

    for (let [dx, dy] of neighboors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        // Bounds check
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Destroyer || neighbor instanceof Acid) {
                isTouchingDestroyer = true;
                break;
            }
        }
    }

    if (isTouchingDestroyer) {
        const currentX = this.x;
        const currentY = this.y;
        this.destroy();
    }
    
    // 1. ALL-DIRECTION HEATER CHECK
    let isTouchingHeater = false;
    const neighbors = [
        [0, 1],  // Down
        [0, -1], // Up
        [1, 0],  // Right
        [-1, 0]  // Left
    ];

    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        // Bounds check
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Fire || neighbor instanceof Heater) {
                isTouchingHeater = true;
                break;
            }
        }
    }

    // 2. TEMPERATURE LOGIC
    if (isTouchingHeater) {
        this.temp += 10;
    } else if (this.temp > 20) {
        this.temp -= 0.5;
    }    

    // 3. EVAPORATION LOGIC
    if (this.temp >= 200) {
        const currentX = this.x;
        const currentY = this.y;

        let fie = new Fire(currentX, currentY);
        particles.push(fie);
        grid[currentX][currentY] = fie;
        this.destroy();
        return;
    }
    let target = grid[this.x][nextY];

    // 1. FALL THROUGH EMPTY SPACE OR SINK THROUGH WATER
    if (target === null || target instanceof Water) {
        let below = target;

        // Clear current spot
        grid[this.x][this.y] = null;

        if (below instanceof Water) {
            below.y = this.y;
            grid[this.x][below.y] = below;
        }

        this.y = nextY;
        grid[this.x][this.y] = this;
    } 
    // 2. FLAT SURFACE LOGIC: If on ground, move sideways
    else {
        let nextX = this.x + this.direction;

        // Check if the side space is within bounds and empty
        if (nextX >= 0 && nextX < gridWidth && grid[nextX][this.y] === null) {
            grid[this.x][this.y] = null;
            this.x = nextX;
            grid[this.x][this.y] = this;
        } else {
            // If it hits a wall or another particle, reverse direction
            this.direction *= -1;
        }
    }
};

Oil.prototype.draw = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};

Steam.prototype.update = function() {

    let isTouchingDestroyer = false;
    const neighbors = [
        [0, 1],  // Down
        [0, -1], // Up
        [1, 0],  // Right
        [-1, 0]  // Left
    ];

    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        // Bounds check
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Destroyer) {
                isTouchingDestroyer = true;
                break;
            }
        }
    }

    if (isTouchingDestroyer) {
        const currentX = this.x;
        const currentY = this.y;
        this.destroy();
    }

    this.life--;
    if (this.life <= 0) {
        this.destroy();
        return;
    }
    // Only run physics if the current frame count is a multiple of our delay
    if (frameCount % this.frameDelay !== 0) return;

    let nextY = this.y - 1;

    // 1. ASCEND
    if (nextY >= 0) {
        let target = grid[this.x][nextY];
        if (target === null || target instanceof Water || target instanceof Oil) {
            grid[this.x][this.y] = null;
            if (target instanceof Water || target instanceof Oil) {
                target.y = this.y;
                grid[this.x][target.y] = target;
            }
            this.y = nextY;
            grid[this.x][this.y] = this;
            return; 
        }
    }

    // 2. CEILING FLOW
    let nextX = this.x + this.direction;
    if (nextX >= 0 && nextX < gridWidth && grid[nextX][this.y] === null) {
        grid[this.x][this.y] = null;
        this.x = nextX;
        grid[this.x][this.y] = this;
    } else {
        this.direction *= -1;
    }
};

Steam.prototype.draw = function() {
    ctx.fillStyle = this.finalColor;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};

AntiGas.prototype.update = function() {

    let isTouchingDestroyer = false;
    const neighbors = [
        [0, 1],  // Down
        [0, -1], // Up
        [1, 0],  // Right
        [-1, 0]  // Left
    ];

    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        // Bounds check
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Destroyer) {
                isTouchingDestroyer = true;
                break;
            }
        }
    }

    if (isTouchingDestroyer) {
        const currentX = this.x;
        const currentY = this.y;
        this.destroy();
    }

    this.life--;
    if (this.life <= 0) {
        this.destroy();
        return;
    }
    // Only run physics if the current frame count is a multiple of our delay
    if (frameCount % this.frameDelay !== 0) return;

    let nextY = this.y + 1;

    // 1. DECEND
    if (nextY <= 600) {
        let target = grid[this.x][nextY];
        if (target === null || target instanceof Water || target instanceof Oil) {
            grid[this.x][this.y] = null;
            if (target instanceof Water || target instanceof Oil) {
                target.y = this.y;
                grid[this.x][target.y] = target;
            }
            this.y = nextY;
            grid[this.x][this.y] = this;
            return; 
        }
    }

    // 2. CEILING FLOW
    let nextX = this.x + this.direction;
    if (nextX >= 0 && nextX < gridWidth && grid[nextX][this.y] === null) {
        grid[this.x][this.y] = null;
        this.x = nextX;
        grid[this.x][this.y] = this;
    } else {
        this.direction *= -1;
    }
};

AntiGas.prototype.draw = function() {
    ctx.fillStyle = this.finalColor;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};

Fire.prototype.update = function() {

    let isTouchingDestroyer = false;
    const neighbors = [
        [0, 1],  // Down
        [0, -1], // Up
        [1, 0],  // Right
        [-1, 0]  // Left
    ];

    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        // Bounds check
        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Destroyer) {
                isTouchingDestroyer = true;
                break;
            }
        }
    }

    if (isTouchingDestroyer) {
        const currentX = this.x;
        const currentY = this.y;
        this.destroy();
    }

    this.life--;
    if (this.life <= 0) {
        this.destroy();
        return;
    }
    // Only run physics if the current frame count is a multiple of our delay
    if (frameCount % this.frameDelay !== 0) return;

    let nextY = this.y - 1;

    if (nextY >= 0) {
        let target = grid[this.x][nextY];
        if (target === null || target instanceof Water || target instanceof Oil) {
            grid[this.x][this.y] = null;
            if (target instanceof Water || target instanceof Oil) {
                target.y = this.y;
                grid[this.x][target.y] = target;
            }
            this.y = nextY;
            grid[this.x][this.y] = this;
            return; 
        }
    }

    let nextX = this.x + this.direction;
    if (nextX >= 0 && nextX < gridWidth && grid[nextX][this.y] === null) {
        grid[this.x][this.y] = null;
        this.x = nextX;
        grid[this.x][this.y] = this;
    } else {
        this.direction *= -1;
    }
};

Fire.prototype.draw = function() {
    ctx.fillStyle = this.finalColor;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};

Cloner.prototype.update = function() {

    let isTouchingDestroyer = false;
    const neighboors = [
        [0, 1],  // Down
        [0, -1], // Up
        [1, 0],  // Right
        [-1, 0]  // Left
    ];

    for (let [dx, dy] of neighboors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor instanceof Destroyer) {
                isTouchingDestroyer = true;
                break;
            }
        }
    }

    if (isTouchingDestroyer) {
        const currentX = this.x;
        const currentY = this.y;
        this.destroy();
    }

    const neighbors = [
        [0, 1], [0, -1], [1, 0], [-1, 0]
    ];

    let sourceParticle = null;

    for (let [dx, dy] of neighbors) {
        let nx = this.x + dx;
        let ny = this.y + dy;

        if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            let neighbor = grid[nx][ny];
            if (neighbor !== null && !(neighbor instanceof Cloner) && !(neighbor instanceof Stone) && !(neighbor instanceof Wood)) {
                sourceParticle = neighbor;
                break; 
            }
        }
    }

    if (sourceParticle) {
        let spawnX = this.x;
        let spawnY = this.y - 1;

        if (spawnY >= 0 && grid[spawnX][spawnY] === null) {
            let clone = new sourceParticle.constructor(spawnX, spawnY);
            
            particles.push(clone);
            grid[spawnX][spawnY] = clone;
        }

        spawnX = this.x;
        spawnY = this.y + 1;

        if (spawnY >= 0 && grid[spawnX][spawnY] === null) {
            let clone = new sourceParticle.constructor(spawnX, spawnY);
            
            particles.push(clone);
            grid[spawnX][spawnY] = clone;
        }
    }
};

Cloner.prototype.draw = function() {
    ctx.fillStyle = this.finalColor;
    ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
};


function erase(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);

    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        const target = grid[gridX][gridY];
        if (target !== null) {
            const index = particles.indexOf(target);
            if (index > -1) {
                particles.splice(index, 1);
            }
            grid[gridX][gridY] = null;
        }
    }
}

function eraseSelected() {
    selected = "erase";
    console.log("Erase selected!");
    document.body.style.cursor = "not-allowed";   
}
function dirtSelected() {
    selected = "dirt";
    console.log("Dirt selected!");
    document.body.style.cursor = "pointer"; 
}
function stoneSelected() {
    selected = "stone";
    console.log("Stone selected!");
    document.body.style.cursor = "pointer"; 
}
function ashSelected() {
    selected = "ash";
    console.log("Ash selected!");
    document.body.style.cursor = "pointer"; 
}
function bombSelected() {
    selected = "bomb";
    console.log("Bomb selected!");
    document.body.style.cursor = "pointer"; 
}
function oilSelected() {
    selected = "oil";
    console.log("Oil selected!");
    document.body.style.cursor = "pointer"; 
}
function destroyerSelected() {
    selected = "destroyer";
    console.log("Destroyer selected!");
    document.body.style.cursor = "pointer"; 
}
function woodSelected() {
    selected = "wood";
    console.log("Wood selected!");
    document.body.style.cursor = "pointer"; 
}
function clonerSelected() {
    selected = "cloner";
    console.log("Cloner selected!");
    document.body.style.cursor = "pointer"; 
}
function heaterSelected() {
    selected = "heater";
    console.log("Heater selected!");
    document.body.style.cursor = "pointer"; 
}
function sandSelected() {
    selected = "sand";
    console.log("Sand selected!");
    document.body.style.cursor = "pointer"; 
}
function waterSelected() {
    selected = "water";
    console.log("Water selected!");
    document.body.style.cursor = "pointer"; 
}
function acidSelected() {
    selected = "acid";
    console.log("Acid selected!");
    document.body.style.cursor = "pointer"; 
}
function antipowderSelected() {
    selected = "antipowder";
    console.log("Anti-Powder selected!");
    document.body.style.cursor = "pointer"; 
}
function antiliquidSelected() {
    selected = "antiliquid";
    console.log("Anti-Liquid selected!");
    document.body.style.cursor = "pointer"; 
}
function antigasSelected() {
    selected = "antigas";
    console.log("Anti-Gas selected!");
    document.body.style.cursor = "pointer"; 
}
function steamSelected() {
    selected = "steam";
    console.log("Steam selected!");
    document.body.style.cursor = "pointer"; 
}
function fireSelected() {
    selected = "fire";
    console.log("Fire selected!");
    document.body.style.cursor = "pointer"; 
}

let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    updateMousePos(e);
    document.body.style.cursor = "grab";
});
window.addEventListener('mouseup', () => isMouseDown = false);
canvas.addEventListener('mousemove', (e) => updateMousePos(e));

function updateMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
}

function spawnDirt(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let dir = new Dirt(gridX, gridY);
            particles.push(dir);
            grid[gridX][gridY] = dir;
        }
    }
}
function spawnAntiPowder(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let atp = new AntiPowder(gridX, gridY);
            particles.push(atp);
            grid[gridX][gridY] = atp;
        }
    }
}
function spawnAntiLiquid(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let atl = new AntiLiquid(gridX, gridY);
            particles.push(atl);
            grid[gridX][gridY] = atl;
        }
    }
}
function spawnAntiGas(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let atg = new AntiGas(gridX, gridY);
            particles.push(atg);
            grid[gridX][gridY] = atg;
        }
    }
}
function spawnDestroyer(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let dst = new Destroyer(gridX, gridY);
            particles.push(dst);
            grid[gridX][gridY] = dst;
        }
    }
}
function spawnStone(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let sto = new Stone(gridX, gridY);
            particles.push(sto);
            grid[gridX][gridY] = sto;
        }
    }
}
function spawnWood(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let wod = new Wood(gridX, gridY);
            particles.push(wod);
            grid[gridX][gridY] = wod;
        }
    }
}
function spawnBomb(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let bmb = new Bomb(gridX, gridY);
            particles.push(bmb);
            grid[gridX][gridY] = bmb;
        }
    }
}
function spawnHeater(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let htr = new Heater(gridX, gridY);
            particles.push(htr);
            grid[gridX][gridY] = htr;
        }
    }
}
function spawnSand(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let san = new Sand(gridX, gridY);
            particles.push(san);
            grid[gridX][gridY] = san;
        }
    }
}
function spawnAsh(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let ash = new Ash(gridX, gridY);
            particles.push(ash);
            grid[gridX][gridY] = ash;
        }
    }
}
function spawnWater(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let wat = new Water(gridX, gridY);
            particles.push(wat);
            grid[gridX][gridY] = wat;
        }
    }
}
function spawnAcid(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let acd = new Acid(gridX, gridY);
            particles.push(acd);
            grid[gridX][gridY] = acd;
        }
    }
}
function spawnOil(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let oil = new Oil(gridX, gridY);
            particles.push(oil);
            grid[gridX][gridY] = oil;
        }
    }
}
function spawnSteam(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let ste = new Steam(gridX, gridY);
            particles.push(ste);
            grid[gridX][gridY] = ste;
        }
    }
}
function spawnFire(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let fir = new Fire(gridX, gridY);
            particles.push(fir);
            grid[gridX][gridY] = fir;
        }
    }
}
function spawnCloner(x, y) {
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);
    if (gridX >= 0 && gridX < gridWidth && gridY >= 0 && gridY < gridHeight) {
        if (grid[gridX][gridY] === null) {
            let clo = new Cloner(gridX, gridY);
            particles.push(clo);
            grid[gridX][gridY] = clo;
        }
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    frameCount++;

    // Continuous Action Logic
    if (isMouseDown) {
        if (selected === "dirt") spawnDirt(mouseX, mouseY);
        if (selected === "sand") spawnSand(mouseX, mouseY);
        if (selected === "ash") spawnAsh(mouseX, mouseY);
        if (selected === "stone") spawnStone(mouseX, mouseY);
        if (selected === "destroyer") spawnDestroyer(mouseX, mouseY);
        if (selected === "wood") spawnWood(mouseX, mouseY);
        if (selected === "water") spawnWater(mouseX, mouseY);
        if (selected === "steam") spawnSteam(mouseX, mouseY);
        if (selected === "antiliquid") spawnAntiLiquid(mouseX, mouseY);
        if (selected === "antigas") spawnAntiGas(mouseX, mouseY);
        if (selected === "fire") spawnFire(mouseX, mouseY);
        if (selected === "heater") spawnHeater(mouseX, mouseY);
        if (selected === "bomb") spawnBomb(mouseX, mouseY);
        if (selected === "antipowder") spawnAntiPowder(mouseX, mouseY);
        if (selected === "cloner") spawnCloner(mouseX, mouseY);
        if (selected === "oil") spawnOil(mouseX, mouseY);
        if (selected === "acid") spawnAcid(mouseX, mouseY);
        if (selected === "erase") erase(mouseX, mouseY);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
    }
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
    }

    particles = particles.filter(p => !p.isDead);
    
    requestAnimationFrame(update);
}
update();
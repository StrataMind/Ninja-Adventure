export class Level {
    constructor(game) {
        this.game = game;
        this.TILE_SIZE = 32;
        this.TILES = {
            AIR: 0,
            GROUND: 1,
            BRICK: 2,
            COIN: 3,
            FLAG: 4,
            SPIKE: 5,
            POWERUP_SPEED: 6,
            POWERUP_JUMP: 7,
            POWERUP_INVINCIBLE: 8
        };
        this.levels = [
            {
                width: 100,
                tiles: [],
                enemies: []
            }
        ];

        // Create a longer, more interesting level
        this.createExtendedLevel();
    }

    createExtendedLevel() {
        const level = {
            width: 100,
            tiles: [],
            enemies: []
        };

        // Initialize empty level
        for (let row = 0; row < 14; row++) {
            level.tiles[row] = [];
            for (let col = 0; col < 100; col++) {
                level.tiles[row][col] = 0; // Air
            }
        }

        // Add ground
        for (let col = 0; col < 100; col++) {
            level.tiles[13][col] = this.TILES.GROUND;
        }

        // Add platforms and obstacles
        // Platform 1
        for (let col = 5; col < 10; col++) {
            level.tiles[10][col] = this.TILES.BRICK;
        }
        level.tiles[9][7] = this.TILES.COIN;

        // Platform 2
        for (let col = 12; col < 16; col++) {
            level.tiles[8][col] = this.TILES.BRICK;
        }
        level.tiles[7][14] = this.TILES.COIN;

        // Platform 3
        for (let col = 18; col < 22; col++) {
            level.tiles[6][col] = this.TILES.BRICK;
        }
        level.tiles[5][20] = this.TILES.COIN;
        level.tiles[5][19] = this.TILES.POWERUP_SPEED; // Speed powerup

        // Platform 4
        for (let col = 25; col < 30; col++) {
            level.tiles[8][col] = this.TILES.BRICK;
        }
        level.tiles[7][27] = this.TILES.COIN;

        // Platform 5 with spikes
        for (let col = 32; col < 38; col++) {
            level.tiles[10][col] = this.TILES.BRICK;
        }
        level.tiles[9][33] = this.TILES.SPIKE;
        level.tiles[9][36] = this.TILES.SPIKE;
        level.tiles[9][34] = this.TILES.COIN;

        // Platform 6
        for (let col = 40; col < 45; col++) {
            level.tiles[7][col] = this.TILES.BRICK;
        }
        level.tiles[6][42] = this.TILES.COIN;
        level.tiles[6][44] = this.TILES.POWERUP_JUMP; // Jump powerup

        // Platform 7
        for (let col = 48; col < 52; col++) {
            level.tiles[9][col] = this.TILES.BRICK;
        }
        level.tiles[8][50] = this.TILES.COIN;

        // Platform 8
        for (let col = 55; col < 60; col++) {
            level.tiles[11][col] = this.TILES.BRICK;
        }
        level.tiles[10][57] = this.TILES.COIN;

        // Platform 9
        for (let col = 62; col < 68; col++) {
            level.tiles[8][col] = this.TILES.BRICK;
        }
        level.tiles[7][65] = this.TILES.COIN;
        level.tiles[7][63] = this.TILES.POWERUP_INVINCIBLE; // Invincibility powerup

        // Platform 10
        for (let col = 70; col < 75; col++) {
            level.tiles[6][col] = this.TILES.BRICK;
        }
        level.tiles[5][72] = this.TILES.COIN;

        // Platform 11
        for (let col = 78; col < 82; col++) {
            level.tiles[8][col] = this.TILES.BRICK;
        }
        level.tiles[7][80] = this.TILES.COIN;

        // Platform 12
        for (let col = 85; col < 90; col++) {
            level.tiles[10][col] = this.TILES.BRICK;
        }
        level.tiles[9][87] = this.TILES.COIN;

        // Final platform with flag
        for (let col = 92; col < 100; col++) {
            level.tiles[5][col] = this.TILES.BRICK;
        }
        level.tiles[4][98] = this.TILES.FLAG;

        // Add some ground obstacles
        level.tiles[12][15] = this.TILES.SPIKE;
        level.tiles[12][16] = this.TILES.SPIKE;
        level.tiles[12][40] = this.TILES.SPIKE;
        level.tiles[12][41] = this.TILES.SPIKE;
        level.tiles[12][70] = this.TILES.SPIKE;
        level.tiles[12][71] = this.TILES.SPIKE;

        // Add enemies
        level.enemies = [
            {x: 300, y: 350, type: 'walker'},
            {x: 500, y: 350, type: 'walker'},
            {x: 700, y: 350, type: 'walker'},
            {x: 900, y: 350, type: 'walker'},
            {x: 1100, y: 350, type: 'walker'},
            {x: 1500, y: 350, type: 'walker'},
            {x: 1800, y: 350, type: 'walker'},
            {x: 2100, y: 350, type: 'walker'},
            {x: 2400, y: 350, type: 'walker'},
            {x: 2700, y: 350, type: 'walker'}
        ];

        // Replace the first level with our extended level
        this.levels[0] = level;
    }

    loadLevel(levelNum) {
        const levelData = this.levels[levelNum - 1];
        this.width = levelData.width;
        this.tiles = levelData.tiles;
        this.enemies = levelData.enemies;
    }

    draw() {
        const ctx = this.game.ctx;
        
        for (let row = 0; row < this.tiles.length; row++) {
            for (let col = 0; col < this.tiles[row].length; col++) {
                const tile = this.tiles[row][col];
                const x = col * this.TILE_SIZE - this.game.camera.x;
                const y = row * this.TILE_SIZE - this.game.camera.y;

                // Skip drawing if tile is outside the visible area
                if (x < -this.TILE_SIZE || x > this.game.canvas.width || 
                    y < -this.TILE_SIZE || y > this.game.canvas.height) {
                    continue;
                }

                switch (tile) {
                    case this.TILES.GROUND:
                        if (this.game.assets.images.ground) {
                            ctx.drawImage(this.game.assets.images.ground, x, y, this.TILE_SIZE, this.TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#8B4513';
                            ctx.fillRect(x, y, this.TILE_SIZE, this.TILE_SIZE);
                            ctx.strokeStyle = '#654321';
                            ctx.strokeRect(x, y, this.TILE_SIZE, this.TILE_SIZE);
                        }
                        break;
                    case this.TILES.BRICK:
                        if (this.game.assets.images.brick) {
                            ctx.drawImage(this.game.assets.images.brick, x, y, this.TILE_SIZE, this.TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#DC143C';
                            ctx.fillRect(x, y, this.TILE_SIZE, this.TILE_SIZE);
                            ctx.strokeStyle = '#8B0000';
                            ctx.strokeRect(x, y, this.TILE_SIZE, this.TILE_SIZE);
                        }
                        break;
                    case this.TILES.COIN:
                        if (this.game.assets.images.coin) {
                            ctx.drawImage(this.game.assets.images.coin, x, y, this.TILE_SIZE, this.TILE_SIZE);
                        } else {
                            this.drawCoin(ctx, x, y);
                        }
                        break;
                    case this.TILES.FLAG:
                        if (this.game.assets.images.flag) {
                            ctx.drawImage(this.game.assets.images.flag, x, y, this.TILE_SIZE, this.TILE_SIZE);
                        } else {
                            this.drawFlag(ctx, x, y);
                        }
                        break;
                    case this.TILES.SPIKE:
                        if (this.game.assets.images.spike) {
                            ctx.drawImage(this.game.assets.images.spike, x, y, this.TILE_SIZE, this.TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#666';
                            ctx.beginPath();
                            ctx.moveTo(x, y + this.TILE_SIZE);
                            ctx.lineTo(x + this.TILE_SIZE/2, y);
                            ctx.lineTo(x + this.TILE_SIZE, y + this.TILE_SIZE);
                            ctx.closePath();
                            ctx.fill();
                        }
                        break;
                    case this.TILES.POWERUP_SPEED:
                        if (this.game.assets.images.powerupSpeed) {
                            ctx.drawImage(this.game.assets.images.powerupSpeed, x, y, this.TILE_SIZE, this.TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#FF0000';
                            ctx.beginPath();
                            ctx.arc(x + this.TILE_SIZE/2, y + this.TILE_SIZE/2, 10, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        break;
                    case this.TILES.POWERUP_JUMP:
                        if (this.game.assets.images.powerupJump) {
                            ctx.drawImage(this.game.assets.images.powerupJump, x, y, this.TILE_SIZE, this.TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#00FF00';
                            ctx.beginPath();
                            ctx.arc(x + this.TILE_SIZE/2, y + this.TILE_SIZE/2, 10, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        break;
                    case this.TILES.POWERUP_INVINCIBLE:
                        if (this.game.assets.images.powerupInvincible) {
                            ctx.drawImage(this.game.assets.images.powerupInvincible, x, y, this.TILE_SIZE, this.TILE_SIZE);
                        } else {
                            ctx.fillStyle = '#FFFF00';
                            ctx.beginPath();
                            ctx.arc(x + this.TILE_SIZE/2, y + this.TILE_SIZE/2, 10, 0, Math.PI * 2);
                            ctx.fill();
                        }
                        break;
                }
            }
        }
    }

    drawCoin(ctx, x, y) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x + this.TILE_SIZE/2, y + this.TILE_SIZE/2, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawFlag(ctx, x, y) {
        ctx.fillStyle = '#32CD32';
        ctx.fillRect(x + 24, y, 8, this.TILE_SIZE);
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(x, y, 24, 16);
    }

    // Method to load level from JSON file (for future use)
    async loadLevelFromFile(levelNum) {
        try {
            const response = await fetch(`levels/level${levelNum}.json`);
            const levelData = await response.json();
            this.width = levelData.width;
            this.tiles = levelData.tiles;
            this.enemies = levelData.enemies;
        } catch (error) {
            console.error('Error loading level:', error);
            // Fallback to built-in level
            this.loadLevel(1);
        }
    }
}
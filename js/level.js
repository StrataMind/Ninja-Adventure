import { TILES, THEMES, LEVEL_BACKGROUNDS, LEVEL_TILES } from './constants.js';

export class Level {
    constructor(game) {
        this.game = game;
        this.TILE_SIZE = 32;
        this.TILES = TILES;
        this.levels = [
            {
                theme: THEMES.GRASSLAND,
                width: 100,
                tiles: [],
                enemies: []
            },
            {
                theme: THEMES.FOREST,
                width: 120,
                tiles: [],
                enemies: []
            },
            {
                theme: THEMES.DESERT,
                width: 140,
                tiles: [],
                enemies: []
            }
        ];

        // Create levels
        this.createLevel1();
        this.createLevel2();
        this.createLevel3();
    }

    createLevel1() {
        const level = this.levels[0];
        
        // Initialize empty level
        for (let row = 0; row < 14; row++) {
            level.tiles[row] = [];
            for (let col = 0; col < level.width; col++) {
                level.tiles[row][col] = 0; // Air
            }
        }

        // Add ground
        for (let col = 0; col < level.width; col++) {
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
    }

    createLevel2() {
        const level = this.levels[1];
        
        // Initialize empty level
        for (let row = 0; row < 14; row++) {
            level.tiles[row] = [];
            for (let col = 0; col < level.width; col++) {
                level.tiles[row][col] = 0; // Air
            }
        }

        // Add ground with gaps
        for (let col = 0; col < level.width; col++) {
            // Create gaps in the ground
            if ((col > 15 && col < 18) || 
                (col > 40 && col < 44) || 
                (col > 70 && col < 75) || 
                (col > 90 && col < 95)) {
                continue;
            }
            level.tiles[13][col] = this.TILES.GROUND;
        }

        // Add water/lava pits (using spikes)
        for (let col = 16; col < 18; col++) {
            level.tiles[13][col] = this.TILES.SPIKE;
        }
        for (let col = 41; col < 44; col++) {
            level.tiles[13][col] = this.TILES.SPIKE;
        }
        for (let col = 71; col < 75; col++) {
            level.tiles[13][col] = this.TILES.SPIKE;
        }
        for (let col = 91; col < 95; col++) {
            level.tiles[13][col] = this.TILES.SPIKE;
        }

        // Vertical platforms section
        for (let row = 8; row < 13; row++) {
            level.tiles[row][20] = this.TILES.BRICK;
            level.tiles[row][25] = this.TILES.BRICK;
        }
        // Horizontal platform connecting vertical ones
        for (let col = 20; col <= 25; col++) {
            level.tiles[8][col] = this.TILES.BRICK;
        }
        level.tiles[7][22] = this.TILES.COIN;
        level.tiles[7][23] = this.TILES.COIN;

        // Moving platforms section (represented as normal platforms)
        for (let col = 30; col < 34; col++) {
            level.tiles[10][col] = this.TILES.BRICK;
        }
        for (let col = 36; col < 40; col++) {
            level.tiles[8][col] = this.TILES.BRICK;
        }
        for (let col = 45; col < 49; col++) {
            level.tiles[6][col] = this.TILES.BRICK;
        }
        level.tiles[5][47] = this.TILES.COIN;
        level.tiles[9][38] = this.TILES.COIN;
        level.tiles[7][46] = this.TILES.POWERUP_SPEED;

        // Stair-like section
        for (let i = 0; i < 5; i++) {
            for (let col = 52 + (i * 3); col < 55 + (i * 3); col++) {
                level.tiles[12 - i][col] = this.TILES.BRICK;
            }
            level.tiles[11 - i][53 + (i * 3)] = this.TILES.COIN;
        }

        // Spike section with platforms
        for (let col = 70; col < 90; col += 4) {
            level.tiles[12][col] = this.TILES.SPIKE;
        }
        for (let col = 68; col < 72; col++) {
            level.tiles[10][col] = this.TILES.BRICK;
        }
        for (let col = 76; col < 80; col++) {
            level.tiles[8][col] = this.TILES.BRICK;
        }
        for (let col = 84; col < 88; col++) {
            level.tiles[6][col] = this.TILES.BRICK;
        }
        level.tiles[5][86] = this.TILES.POWERUP_JUMP;
        level.tiles[7][78] = this.TILES.POWERUP_INVINCIBLE;

        // Final section
        for (let col = 100; col < 110; col++) {
            level.tiles[10][col] = this.TILES.BRICK;
        }
        for (let col = 112; col < 120; col++) {
            level.tiles[5][col] = this.TILES.BRICK;
        }
        level.tiles[4][118] = this.TILES.FLAG;

        // Add coins throughout the level
        level.tiles[9][32] = this.TILES.COIN;
        level.tiles[7][38] = this.TILES.COIN;
        level.tiles[5][47] = this.TILES.COIN;
        level.tiles[9][70] = this.TILES.COIN;
        level.tiles[7][78] = this.TILES.COIN;
        level.tiles[5][86] = this.TILES.COIN;
        level.tiles[9][105] = this.TILES.COIN;
        level.tiles[9][107] = this.TILES.COIN;
        level.tiles[4][115] = this.TILES.COIN;
        level.tiles[4][117] = this.TILES.COIN;

        // Add more enemies for level 2
        level.enemies = [
            {x: 300, y: 350, type: 'walker'},
            {x: 600, y: 350, type: 'walker'},
            {x: 900, y: 350, type: 'walker'},
            {x: 1200, y: 350, type: 'walker'},
            {x: 1500, y: 350, type: 'walker'},
            {x: 1800, y: 350, type: 'walker'},
            {x: 2100, y: 350, type: 'walker'},
            {x: 2400, y: 350, type: 'walker'},
            {x: 2700, y: 350, type: 'walker'},
            {x: 3000, y: 350, type: 'walker'},
            {x: 3300, y: 350, type: 'walker'},
            {x: 3600, y: 350, type: 'walker'}
        ];
    }

    createLevel3() {
        const level = this.levels[2];
        
        // Initialize empty level
        for (let row = 0; row < 14; row++) {
            level.tiles[row] = [];
            for (let col = 0; col < level.width; col++) {
                level.tiles[row][col] = 0; // Air
            }
        }

        // Add ground with gaps and quicksand
        for (let col = 0; col < level.width; col++) {
            // Create gaps in the ground
            if ((col > 25 && col < 30) || 
                (col > 60 && col < 65) || 
                (col > 100 && col < 105)) {
                continue;
            }
            
            // Add quicksand patches
            if ((col > 15 && col < 20) || 
                (col > 45 && col < 55) || 
                (col > 80 && col < 90)) {
                level.tiles[13][col] = this.TILES.QUICKSAND;
            } else {
                level.tiles[13][col] = this.TILES.GROUND;
            }
        }

        // Oasis Section (tiles 20-35)
        for (let col = 26; col < 29; col++) {
            level.tiles[13][col] = this.TILES.WATER;
        }
        
        // Platforms over water
        for (let col = 25; col < 30; col++) {
            if (col % 2 === 0) {
                level.tiles[11][col] = this.TILES.BRICK;
                level.tiles[10][col] = this.TILES.COIN;
            }
        }
        
        // Healing spring (checkpoint)
        level.tiles[10][28] = this.TILES.CHECKPOINT;

        // Sandstorm Zone (tiles 50-70)
        // Add elevated platforms with coins
        for (let col = 50; col < 70; col += 5) {
            const height = 10 - Math.floor(Math.random() * 3); // Random height platforms
            level.tiles[height][col] = this.TILES.BRICK;
            level.tiles[height][col+1] = this.TILES.BRICK;
            level.tiles[height-1][col] = this.TILES.COIN;
        }

        // Cactus Maze (tiles 80-100)
        // Add cactus barriers
        for (let col = 80; col < 100; col += 3) {
            if (col % 2 === 0) {
                level.tiles[12][col] = this.TILES.CACTUS;
            } else {
                level.tiles[11][col] = this.TILES.CACTUS;
            }
        }
        
        // Add platforms to navigate through cactus maze
        for (let col = 82; col < 98; col += 4) {
            level.tiles[9][col] = this.TILES.BRICK;
            level.tiles[8][col] = this.TILES.COIN;
        }

        // Canyon Climb (tiles 110-135)
        // Create vertical ascent with platforms
        for (let i = 0; i < 8; i++) {
            const row = 12 - i;
            const col = 110 + (i * 3);
            
            level.tiles[row][col] = this.TILES.BRICK;
            level.tiles[row][col+1] = this.TILES.BRICK;
            level.tiles[row][col+2] = this.TILES.BRICK;
            
            // Add coins on alternate platforms
            if (i % 2 === 0) {
                level.tiles[row-1][col+1] = this.TILES.COIN;
            }
            
            // Add powerups
            if (i === 3) {
                level.tiles[row-1][col] = this.TILES.POWERUP_SPEED;
            } else if (i === 6) {
                level.tiles[row-1][col+2] = this.TILES.POWERUP_JUMP;
            }
        }

        // Final platform with flag
        for (let col = 132; col < 140; col++) {
            level.tiles[4][col] = this.TILES.BRICK;
        }
        level.tiles[3][138] = this.TILES.FLAG;

        // Add more enemies for level 3 (desert themed)
        level.enemies = [
            {x: 200, y: 350, type: 'walker'},
            {x: 400, y: 350, type: 'walker'},
            {x: 600, y: 350, type: 'walker'},
            {x: 800, y: 350, type: 'walker'},
            {x: 1000, y: 350, type: 'walker'},
            {x: 1200, y: 350, type: 'walker'},
            {x: 1400, y: 350, type: 'walker'},
            {x: 1600, y: 350, type: 'walker'},
            {x: 1800, y: 350, type: 'walker'},
            {x: 2000, y: 350, type: 'walker'},
            {x: 2200, y: 350, type: 'walker'},
            {x: 2400, y: 350, type: 'walker'},
            {x: 2600, y: 350, type: 'walker'},
            {x: 2800, y: 350, type: 'walker'}
        ];
    }

    loadLevel(levelNum) {
        if (levelNum > this.levels.length) {
            // If we've completed all levels, loop back to level 1
            levelNum = 1;
        }
        
        const levelData = this.levels[levelNum - 1];
        this.width = levelData.width;
        this.tiles = levelData.tiles;
        this.enemies = levelData.enemies;
        this.theme = levelData.theme;
    }

    draw() {
        const ctx = this.game.ctx;
        const theme = this.theme || THEMES.GRASSLAND;
        const tileset = LEVEL_TILES[theme];
        
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
                        if (tileset && tileset.ground) {
                            const img = this.game.assets.images[`ground_${theme}`];
                            if (img) {
                                ctx.drawImage(img, x, y, this.TILE_SIZE, this.TILE_SIZE);
                            } else {
                                this.drawDefaultTile(ctx, x, y, '#8B4513');
                            }
                        } else {
                            this.drawDefaultTile(ctx, x, y, '#8B4513');
                        }
                        break;
                    case this.TILES.BRICK:
                        if (tileset && tileset.brick) {
                            const img = this.game.assets.images[`brick_${theme}`];
                            if (img) {
                                ctx.drawImage(img, x, y, this.TILE_SIZE, this.TILE_SIZE);
                            } else {
                                this.drawDefaultTile(ctx, x, y, '#DC143C');
                            }
                        } else {
                            this.drawDefaultTile(ctx, x, y, '#DC143C');
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
                        if (tileset && tileset.spike) {
                            const img = this.game.assets.images[`spike_${theme}`];
                            if (img) {
                                ctx.drawImage(img, x, y, this.TILE_SIZE, this.TILE_SIZE);
                            } else {
                                this.drawSpike(ctx, x, y);
                            }
                        } else {
                            this.drawSpike(ctx, x, y);
                        }
                        break;
                    case this.TILES.POWERUP_SPEED:
                        if (this.game.assets.images.powerupSpeed) {
                            ctx.drawImage(this.game.assets.images.powerupSpeed, x, y, this.TILE_SIZE, this.TILE_SIZE);
                        } else {
                            this.drawPowerup(ctx, x, y, '#FF0000');
                        }
                        break;
                    case this.TILES.POWERUP_JUMP:
                        if (this.game.assets.images.powerupJump) {
                            ctx.drawImage(this.game.assets.images.powerupJump, x, y, this.TILE_SIZE, this.TILE_SIZE);
                        } else {
                            this.drawPowerup(ctx, x, y, '#00FF00');
                        }
                        break;
                    case this.TILES.POWERUP_INVINCIBLE:
                        if (this.game.assets.images.powerupInvincible) {
                            ctx.drawImage(this.game.assets.images.powerupInvincible, x, y, this.TILE_SIZE, this.TILE_SIZE);
                        } else {
                            this.drawPowerup(ctx, x, y, '#FFFF00');
                        }
                        break;
                    case this.TILES.QUICKSAND:
                        if (tileset && tileset.quicksand) {
                            const img = this.game.assets.images.quicksand;
                            if (img) {
                                ctx.drawImage(img, x, y, this.TILE_SIZE, this.TILE_SIZE);
                            } else {
                                this.drawDefaultTile(ctx, x, y, '#D2B48C');
                            }
                        } else {
                            this.drawDefaultTile(ctx, x, y, '#D2B48C');
                        }
                        break;
                    case this.TILES.CACTUS:
                        if (tileset && tileset.cactus) {
                            const img = this.game.assets.images.cactus;
                            if (img) {
                                ctx.drawImage(img, x, y, this.TILE_SIZE, this.TILE_SIZE);
                            } else {
                                this.drawCactus(ctx, x, y);
                            }
                        } else {
                            this.drawCactus(ctx, x, y);
                        }
                        break;
                    case this.TILES.WATER:
                        ctx.fillStyle = '#4169E1';
                        ctx.fillRect(x, y, this.TILE_SIZE, this.TILE_SIZE);
                        // Add wave effect
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                        ctx.beginPath();
                        ctx.moveTo(x, y + 5);
                        ctx.quadraticCurveTo(x + this.TILE_SIZE/4, y, x + this.TILE_SIZE/2, y + 5);
                        ctx.quadraticCurveTo(x + 3*this.TILE_SIZE/4, y + 10, x + this.TILE_SIZE, y + 5);
                        ctx.lineTo(x + this.TILE_SIZE, y + this.TILE_SIZE);
                        ctx.lineTo(x, y + this.TILE_SIZE);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case this.TILES.CHECKPOINT:
                        ctx.fillStyle = '#32CD32';
                        ctx.fillRect(x + 24, y, 8, this.TILE_SIZE);
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(x, y, 24, 16);
                        break;
                }
            }
        }
    }

    drawDefaultTile(ctx, x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, this.TILE_SIZE, this.TILE_SIZE);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.strokeRect(x, y, this.TILE_SIZE, this.TILE_SIZE);
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

    drawSpike(ctx, x, y) {
        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.moveTo(x, y + this.TILE_SIZE);
        ctx.lineTo(x + this.TILE_SIZE/2, y);
        ctx.lineTo(x + this.TILE_SIZE, y + this.TILE_SIZE);
        ctx.closePath();
        ctx.fill();
    }

    drawPowerup(ctx, x, y, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x + this.TILE_SIZE/2, y + this.TILE_SIZE/2, 10, 0, Math.PI * 2);
        ctx.fill();
    }

    drawCactus(ctx, x, y) {
        ctx.fillStyle = '#2E8B57';
        // Main body
        ctx.fillRect(x + 12, y, 8, this.TILE_SIZE);
        // Arms
        ctx.fillRect(x + 4, y + 10, 8, 6);
        ctx.fillRect(x + 20, y + 18, 8, 6);
        // Spikes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 14, y + 5, 4, 1);
        ctx.fillRect(x + 14, y + 15, 4, 1);
        ctx.fillRect(x + 14, y + 25, 4, 1);
        ctx.fillRect(x + 8, y + 10, 1, 4);
        ctx.fillRect(x + 24, y + 18, 1, 4);
    }
}
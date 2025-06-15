import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { Level } from './level.js';
import { Utils } from './utils.js';
import { AssetLoader } from './assetLoader.js';
import { THEMES, LEVEL_BACKGROUNDS, LEVEL_TILES } from './constants.js';

export class Game {
    constructor(uiManager) {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'loading'; // loading, playing, paused, gameOver, menu
        this.score = 0;
        this.lives = 3;
        this.currentLevel = 1;
        this.camera = { x: 0, y: 0 };
        this.keys = {};
        this.assets = new AssetLoader();
        this.uiManager = uiManager;
        this.difficulty = 'normal';
        this.gameTime = 0;
        this.coinsCollected = 0;
        this.totalCoins = 0;
        this.powerup = null;
        this.setupEventListeners();
    }

    init() {
        // Load assets
        this.loadAssets();
        
        // Set completion callback
        this.assets.setCompletionCallback(() => {
            this.gameState = 'playing';
            this.level = new Level(this);
            this.level.loadLevel(this.currentLevel);
            this.player = new Player(this, 50, 300);
            this.initEnemies();
            this.countTotalCoins();
            this.updateUI();
            this.loadHighScore();
            this.gameTime = 0;
            this.coinsCollected = 0;
            
            // Apply difficulty settings
            this.setDifficulty(this.uiManager.options.difficulty);
            
            // Start background music
            this.playMusic();
        });
        
        // Start game loop
        this.gameLoop();
    }

    loadAssets() {
        // Load images
        this.assets.loadImage('player', 'assets/images/png 2/Idle__000.png');
        this.assets.loadImage('playerRun', 'assets/images/png 2/Run__000.png');
        this.assets.loadImage('playerJump', 'assets/images/png 2/Jump__000.png');
        
        // Load backgrounds
        for (let i = 0; i < LEVEL_BACKGROUNDS.length; i++) {
            if (LEVEL_BACKGROUNDS[i]) {
                this.assets.loadImage(`background_${i}`, LEVEL_BACKGROUNDS[i]);
            }
        }
        
        // Load tileset images for each theme
        for (let theme = 0; theme < LEVEL_TILES.length; theme++) {
            const tileset = LEVEL_TILES[theme];
            if (tileset) {
                if (tileset.ground) this.assets.loadImage(`ground_${theme}`, tileset.ground);
                if (tileset.brick) this.assets.loadImage(`brick_${theme}`, tileset.brick);
                if (tileset.spike) this.assets.loadImage(`spike_${theme}`, tileset.spike);
                if (tileset.quicksand) this.assets.loadImage('quicksand', tileset.quicksand);
                if (tileset.cactus) this.assets.loadImage('cactus', tileset.cactus);
                if (tileset.ice) this.assets.loadImage('ice', tileset.ice);
            }
        }
        
        // Load common images
        this.assets.loadImage('coin', 'assets/images/freetileset/png/Tiles/17.png');
        this.assets.loadImage('flag', 'assets/images/freetileset/png/Object/Sign_1.png');
        this.assets.loadImage('enemy', 'assets/images/freetileset/png/Object/Mushroom_1.png');
        this.assets.loadImage('powerupSpeed', 'assets/images/freetileset/png/Object/Bush (1).png');
        this.assets.loadImage('powerupJump', 'assets/images/freetileset/png/Object/Bush (2).png');
        this.assets.loadImage('powerupInvincible', 'assets/images/freetileset/png/Object/Bush (3).png');

        // Load sounds
        this.assets.loadSound('jump', 'assets/sounds/mixkit-player-jumping-in-a-video-game-2043.wav');
        this.assets.loadSound('coin', 'assets/sounds/mixkit-video-game-treasure-2066.wav');
        this.assets.loadSound('hurt', 'assets/sounds/mixkit-game-blood-pop-slide-2363.wav');
        this.assets.loadSound('stomp', 'assets/sounds/mixkit-game-ball-tap-2073.wav');
        this.assets.loadSound('levelComplete', 'assets/sounds/mixkit-game-level-completed-2059.wav');
        this.assets.loadSound('powerup', 'assets/sounds/mixkit-bonus-earned-in-video-game-2058.wav');
        this.assets.loadSound('gameOver', 'assets/sounds/mixkit-player-losing-or-failing-2042.wav');
        this.assets.loadSound('music', 'assets/sounds/mixkit-medieval-show-fanfare-announcement-226.wav');
    }

    setupEventListeners() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ') e.preventDefault();
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Mobile controls
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        const jumpBtn = document.getElementById('jumpBtn');

        leftBtn.addEventListener('touchstart', () => this.keys['ArrowLeft'] = true);
        leftBtn.addEventListener('touchend', () => this.keys['ArrowLeft'] = false);
        rightBtn.addEventListener('touchstart', () => this.keys['ArrowRight'] = true);
        rightBtn.addEventListener('touchend', () => this.keys['ArrowRight'] = false);
        jumpBtn.addEventListener('touchstart', () => this.keys[' '] = true);
        jumpBtn.addEventListener('touchend', () => this.keys[' '] = false);
    }

    initEnemies() {
        this.enemies = [];
        this.level.enemies.forEach(enemyData => {
            this.enemies.push(new Enemy(this, enemyData.x, enemyData.y, enemyData.type));
        });
    }

    gameLoop(timestamp) {
        // Count frame for FPS calculation
        if (this.uiManager) {
            this.uiManager.countFrame();
        }
        
        if (this.gameState === 'playing') {
            // Update game time
            this.gameTime++;
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw background based on theme
            const theme = this.level.theme || THEMES.GRASSLAND;
            const backgroundImg = this.assets.images[`background_${theme}`];
            if (backgroundImg) {
                this.ctx.drawImage(backgroundImg, 0, 0, this.canvas.width, this.canvas.height);
            } else if (this.assets.images.background_0) {
                this.ctx.drawImage(this.assets.images.background_0, 0, 0, this.canvas.width, this.canvas.height);
            }

            // Update
            this.player.update();
            this.enemies.forEach(enemy => enemy.update());
            
            // Update powerup
            this.updatePowerup();

            // Draw
            this.level.draw();
            this.player.draw();
            this.enemies.forEach(enemy => enemy.draw());
            
            // Draw special effects based on level theme
            this.drawLevelEffects();
        } else if (this.gameState === 'loading') {
            // Draw loading screen
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Loading...', this.canvas.width / 2, this.canvas.height / 2);
        }

        requestAnimationFrame(() => this.gameLoop());
    }
    
    drawLevelEffects() {
        if (!this.level) return;
        
        const theme = this.level.theme;
        
        // Desert sandstorm effect
        if (theme === THEMES.DESERT && this.gameTime % 180 < 90) {
            this.ctx.fillStyle = 'rgba(244, 164, 96, 0.2)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw sand particles
            this.ctx.fillStyle = 'rgba(244, 164, 96, 0.5)';
            for (let i = 0; i < 20; i++) {
                const x = (Math.sin(this.gameTime * 0.05 + i) * 100 + this.gameTime * 2 + i * 50) % this.canvas.width;
                const y = (Math.cos(this.gameTime * 0.05 + i) * 50 + i * 20) % this.canvas.height;
                this.ctx.fillRect(x, y, 2, 2);
            }
        }
        
        // Ice cave effect
        if (theme === THEMES.ICE) {
            // Draw falling snowflakes
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            for (let i = 0; i < 30; i++) {
                const x = (Math.sin(this.gameTime * 0.01 + i) * 200 + i * 30) % this.canvas.width;
                const y = (this.gameTime + i * 20) % this.canvas.height;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 1, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        // Volcano effect
        if (theme === THEMES.VOLCANO) {
            // Draw smoke particles
            this.ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
            for (let i = 0; i < 15; i++) {
                const x = (Math.sin(this.gameTime * 0.02 + i) * 150 + i * 40) % this.canvas.width;
                const y = (this.canvas.height - this.gameTime % 200 - i * 10);
                const size = Math.sin(this.gameTime * 0.01 + i) * 5 + 5;
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    updateUI() {
        if (this.uiManager) {
            this.uiManager.updateUI(this.score, this.lives, this.currentLevel);
        }
    }

    gameOver() {
        this.gameState = 'gameOver';
        this.playSound('gameOver');
        
        // Update high score
        const highScore = parseInt(localStorage.getItem('platformerHighScore') || '0');
        if (this.score > highScore) {
            localStorage.setItem('platformerHighScore', this.score.toString());
        }
        
        if (this.uiManager) {
            this.uiManager.showGameOver(this.score, Math.max(highScore, this.score));
        }
    }

    levelCompleted() {
        this.gameState = 'levelComplete';
        this.playSound('levelComplete');
        
        // Calculate score multiplier based on level
        let multiplier = 1;
        if (this.currentLevel >= 3 && this.currentLevel <= 4) {
            multiplier = 1.5;
        } else if (this.currentLevel >= 5) {
            multiplier = 2;
        }
        
        // Apply multiplier to score
        const levelScore = Math.round(this.score * multiplier);
        
        if (this.uiManager) {
            this.uiManager.showLevelComplete(
                levelScore, 
                this.coinsCollected, 
                this.totalCoins, 
                Math.floor(this.gameTime / 60)
            );
        }
    }

    nextLevel() {
        this.currentLevel++;
        this.level.loadLevel(this.currentLevel);
        this.player = new Player(this, 50, 300);
        this.initEnemies();
        this.countTotalCoins();
        this.gameTime = 0;
        this.coinsCollected = 0;
        this.powerup = null;
        this.gameState = 'playing';
        
        // Apply difficulty settings again for the new level
        this.setDifficulty(this.difficulty);
    }

    restartGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.currentLevel = 1;
        this.camera = { x: 0, y: 0 };
        this.gameTime = 0;
        this.coinsCollected = 0;
        this.powerup = null;
        
        this.level.loadLevel(this.currentLevel);
        this.player = new Player(this, 50, 300);
        this.initEnemies();
        this.countTotalCoins();
        
        // Apply difficulty settings
        this.setDifficulty(this.difficulty);
        
        this.updateUI();
    }

    loadHighScore() {
        const savedHighScore = localStorage.getItem('platformerHighScore') || '0';
        return parseInt(savedHighScore);
    }

    playSound(name) {
        if (this.assets.sounds[name]) {
            const volume = this.uiManager ? this.uiManager.options.soundVolume : 0.5;
            this.assets.playSound(name, volume);
        }
    }

    playMusic() {
        if (this.assets.sounds.music) {
            const volume = this.uiManager ? this.uiManager.options.musicVolume : 0.3;
            this.assets.playSound('music', volume, true);
        }
    }

    setSoundVolume(volume) {
        this.assets.setSoundVolume(volume);
    }

    setMusicVolume(volume) {
        this.assets.setMusicVolume(volume);
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        
        // Adjust game parameters based on difficulty
        switch (difficulty) {
            case 'easy':
                this.lives = 5;
                this.player.speed = 5;
                this.player.jumpPower = 16;
                this.enemies.forEach(enemy => {
                    enemy.vx *= 0.7;
                });
                break;
            case 'normal':
                this.lives = 3;
                this.player.speed = 5;
                this.player.jumpPower = 15;
                break;
            case 'hard':
                this.lives = 2;
                this.player.speed = 4.5;
                this.player.jumpPower = 14;
                this.enemies.forEach(enemy => {
                    enemy.vx *= 1.3;
                });
                break;
        }
        
        this.updateUI();
    }

    countTotalCoins() {
        this.totalCoins = 0;
        for (let row = 0; row < this.level.tiles.length; row++) {
            for (let col = 0; col < this.level.tiles[row].length; col++) {
                if (this.level.tiles[row][col] === this.level.TILES.COIN) {
                    this.totalCoins++;
                }
            }
        }
    }

    collectCoin() {
        this.coinsCollected++;
        
        // Apply score multiplier based on level
        let multiplier = 1;
        if (this.currentLevel >= 3 && this.currentLevel <= 4) {
            multiplier = 1.5;
        } else if (this.currentLevel >= 5) {
            multiplier = 2;
        }
        
        this.score += Math.round(100 * multiplier);
        this.updateUI();
        this.playSound('coin');
    }

    activatePowerup(type, duration) {
        this.powerup = {
            type: type,
            duration: duration,
            timeLeft: duration
        };
        
        // Apply powerup effect
        switch (type) {
            case 'speed':
                this.player.speed *= 1.5;
                break;
            case 'jump':
                this.player.jumpPower *= 1.3;
                break;
            case 'invincible':
                this.player.invulnerable = true;
                break;
        }
        
        this.playSound('powerup');
        
        if (this.uiManager) {
            this.uiManager.showPowerup(type, duration);
        }
    }

    updatePowerup() {
        if (this.powerup) {
            this.powerup.timeLeft--;
            
            if (this.uiManager) {
                this.uiManager.updatePowerupTimer(this.powerup.timeLeft);
            }
            
            if (this.powerup.timeLeft <= 0) {
                // Remove powerup effect
                switch (this.powerup.type) {
                    case 'speed':
                        this.player.speed /= 1.5;
                        break;
                    case 'jump':
                        this.player.jumpPower /= 1.3;
                        break;
                    case 'invincible':
                        this.player.invulnerable = false;
                        break;
                }
                
                this.powerup = null;
                
                if (this.uiManager) {
                    this.uiManager.hidePowerup();
                }
            }
        }
    }
}
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { Level } from './level.js';
import { Utils } from './utils.js';
import { AssetLoader } from './assetLoader.js';

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
        this.assets.loadImage('background', 'assets/images/freetileset/png/BG/BG.png');
        this.assets.loadImage('ground', 'assets/images/freetileset/png/Tiles/2.png');
        this.assets.loadImage('brick', 'assets/images/freetileset/png/Tiles/14.png');
        this.assets.loadImage('coin', 'assets/images/freetileset/png/Tiles/17.png');
        this.assets.loadImage('flag', 'assets/images/freetileset/png/Object/Sign_1.png');
        this.assets.loadImage('spike', 'assets/images/freetileset/png/Tiles/16.png');
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

            // Draw background
            if (this.assets.images.background) {
                this.ctx.drawImage(this.assets.images.background, 0, 0, this.canvas.width, this.canvas.height);
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
        
        if (this.uiManager) {
            this.uiManager.showLevelComplete(
                this.score, 
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
        this.gameState = 'playing';
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
        this.score += 100;
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
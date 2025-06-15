export class UIManager {
    constructor() {
        this.screens = {
            mainMenu: document.getElementById('mainMenu'),
            optionsMenu: document.getElementById('optionsMenu'),
            howToPlayMenu: document.getElementById('howToPlayMenu'),
            pauseMenu: document.getElementById('pauseMenu'),
            game: document.getElementById('gameContainer'),
            mobileControls: document.getElementById('mobileControls')
        };
        
        this.gameUI = {
            score: document.getElementById('score'),
            lives: document.getElementById('lives'),
            level: document.getElementById('level'),
            fps: document.getElementById('fps'),
            gameOver: document.getElementById('gameOver'),
            finalScore: document.getElementById('finalScore'),
            highScore: document.getElementById('highScore'),
            levelComplete: document.getElementById('levelComplete'),
            levelScore: document.getElementById('levelScore'),
            coinsCollected: document.getElementById('coinsCollected'),
            totalCoins: document.getElementById('totalCoins'),
            levelTime: document.getElementById('levelTime'),
            powerupIndicator: document.getElementById('powerupIndicator'),
            powerupTimer: document.getElementById('powerupTimer')
        };
        
        this.options = {
            soundVolume: 0.5,
            musicVolume: 0.3,
            showFPS: true,
            difficulty: 'normal'
        };
        
        this.isMobile = window.innerWidth < 850;
        this.fpsUpdateInterval = null;
        this.lastFrameTime = 0;
        this.frameCount = 0;
    }
    
    init(game) {
        this.game = game;
        this.setupEventListeners();
        this.loadOptions();
        this.showScreen('mainMenu');
        
        // Show mobile controls on small screens
        if (this.isMobile) {
            this.screens.mobileControls.classList.remove('hidden');
        }
        
        // Start FPS counter
        this.startFPSCounter();
    }
    
    setupEventListeners() {
        // Main Menu
        document.getElementById('optionsBtn').addEventListener('click', () => this.showScreen('optionsMenu'));
        document.getElementById('howToPlayBtn').addEventListener('click', () => this.showScreen('howToPlayMenu'));
        
        // Options Menu
        document.getElementById('backFromOptionsBtn').addEventListener('click', () => this.showScreen('mainMenu'));
        document.getElementById('soundVolume').addEventListener('input', (e) => this.updateSoundVolume(e.target.value));
        document.getElementById('musicVolume').addEventListener('input', (e) => this.updateMusicVolume(e.target.value));
        document.getElementById('showFPS').addEventListener('change', (e) => this.toggleFPS(e.target.checked));
        document.getElementById('easyBtn').addEventListener('click', () => this.setDifficulty('easy'));
        document.getElementById('normalBtn').addEventListener('click', () => this.setDifficulty('normal'));
        document.getElementById('hardBtn').addEventListener('click', () => this.setDifficulty('hard'));
        
        // How to Play Menu
        document.getElementById('backFromHowToBtn').addEventListener('click', () => this.showScreen('mainMenu'));
        
        // Pause Menu
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseGame());
        document.getElementById('mobilePauseBtn').addEventListener('click', () => this.pauseGame());
        document.getElementById('resumeBtn').addEventListener('click', () => this.resumeGame());
        document.getElementById('restartFromPauseBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('optionsFromPauseBtn').addEventListener('click', () => this.showScreen('optionsMenu'));
        document.getElementById('quitBtn').addEventListener('click', () => this.quitToMenu());
        
        // Game Over
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('menuFromGameOverBtn').addEventListener('click', () => this.quitToMenu());
        
        // Level Complete
        document.getElementById('nextLevelBtn').addEventListener('click', () => this.nextLevel());
        document.getElementById('menuFromLevelCompleteBtn').addEventListener('click', () => this.quitToMenu());
        
        // Keyboard shortcuts
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.game && this.game.gameState === 'playing') {
                this.pauseGame();
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 850;
            if (this.isMobile) {
                this.screens.mobileControls.classList.remove('hidden');
            } else {
                this.screens.mobileControls.classList.add('hidden');
            }
        });
    }
    
    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            if (screen) screen.classList.add('hidden');
        });
        
        // Show the requested screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.remove('hidden');
            
            // Show mobile controls if on mobile and in game
            if (screenName === 'game' && this.isMobile) {
                this.screens.mobileControls.classList.remove('hidden');
            }
        }
        
        // Special handling for pause menu
        if (screenName === 'pauseMenu' && this.game) {
            this.game.gameState = 'paused';
        }
    }
    
    updateUI(score, lives, level) {
        this.gameUI.score.textContent = score;
        this.gameUI.lives.textContent = lives;
        this.gameUI.level.textContent = level;
    }
    
    showGameOver(score, highScore) {
        this.gameUI.finalScore.textContent = score;
        this.gameUI.highScore.textContent = highScore;
        this.gameUI.gameOver.classList.remove('hidden');
    }
    
    hideGameOver() {
        this.gameUI.gameOver.classList.add('hidden');
    }
    
    showLevelComplete(score, coinsCollected, totalCoins, time) {
        this.gameUI.levelScore.textContent = score;
        this.gameUI.coinsCollected.textContent = coinsCollected;
        this.gameUI.totalCoins.textContent = totalCoins;
        this.gameUI.levelTime.textContent = this.formatTime(time);
        this.gameUI.levelComplete.classList.remove('hidden');
    }
    
    hideLevelComplete() {
        this.gameUI.levelComplete.classList.add('hidden');
    }
    
    showPowerup(type, duration) {
        this.gameUI.powerupIndicator.classList.remove('hidden');
        this.gameUI.powerupTimer.textContent = Math.ceil(duration / 60);
        
        // Update the icon based on powerup type
        const iconElement = this.gameUI.powerupIndicator.querySelector('i');
        if (iconElement) {
            iconElement.className = 'fas';
            switch (type) {
                case 'speed':
                    iconElement.classList.add('fa-running');
                    break;
                case 'jump':
                    iconElement.classList.add('fa-arrow-up');
                    break;
                case 'invincible':
                    iconElement.classList.add('fa-star');
                    break;
                default:
                    iconElement.classList.add('fa-bolt');
            }
        }
    }
    
    updatePowerupTimer(timeLeft) {
        this.gameUI.powerupTimer.textContent = Math.ceil(timeLeft / 60);
    }
    
    hidePowerup() {
        this.gameUI.powerupIndicator.classList.add('hidden');
    }
    
    pauseGame() {
        if (this.game && this.game.gameState === 'playing') {
            this.showScreen('pauseMenu');
            this.game.gameState = 'paused';
        }
    }
    
    resumeGame() {
        if (this.game && this.game.gameState === 'paused') {
            this.showScreen('game');
            this.game.gameState = 'playing';
        }
    }
    
    restartGame() {
        this.hideGameOver();
        this.hideLevelComplete();
        this.showScreen('game');
        if (this.game) {
            this.game.restartGame();
        }
    }
    
    nextLevel() {
        this.hideLevelComplete();
        if (this.game) {
            this.game.nextLevel();
        }
    }
    
    quitToMenu() {
        this.hideGameOver();
        this.hideLevelComplete();
        this.showScreen('mainMenu');
        if (this.game) {
            this.game.gameState = 'menu';
        }
    }
    
    updateSoundVolume(value) {
        const volumeValue = value / 100;
        document.getElementById('soundVolumeValue').textContent = value + '%';
        this.options.soundVolume = volumeValue;
        if (this.game) {
            this.game.setSoundVolume(volumeValue);
        }
        this.saveOptions();
    }
    
    updateMusicVolume(value) {
        const volumeValue = value / 100;
        document.getElementById('musicVolumeValue').textContent = value + '%';
        this.options.musicVolume = volumeValue;
        if (this.game) {
            this.game.setMusicVolume(volumeValue);
        }
        this.saveOptions();
    }
    
    toggleFPS(show) {
        this.options.showFPS = show;
        if (show) {
            this.gameUI.fps.parentElement.classList.remove('hidden');
        } else {
            this.gameUI.fps.parentElement.classList.add('hidden');
        }
        this.saveOptions();
    }
    
    setDifficulty(difficulty) {
        this.options.difficulty = difficulty;
        
        // Update UI
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        document.getElementById(difficulty + 'Btn').classList.add('selected');
        
        // Update game difficulty
        if (this.game) {
            this.game.setDifficulty(difficulty);
        }
        
        this.saveOptions();
    }
    
    startFPSCounter() {
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        
        if (this.fpsUpdateInterval) {
            clearInterval(this.fpsUpdateInterval);
        }
        
        this.fpsUpdateInterval = setInterval(() => {
            const now = performance.now();
            const elapsed = now - this.lastFrameTime;
            const fps = Math.round((this.frameCount * 1000) / elapsed);
            
            this.gameUI.fps.textContent = fps;
            
            this.lastFrameTime = now;
            this.frameCount = 0;
        }, 1000);
    }
    
    countFrame() {
        this.frameCount++;
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    saveOptions() {
        localStorage.setItem('platformerOptions', JSON.stringify(this.options));
    }
    
    loadOptions() {
        const savedOptions = localStorage.getItem('platformerOptions');
        if (savedOptions) {
            try {
                const options = JSON.parse(savedOptions);
                this.options = { ...this.options, ...options };
                
                // Apply loaded options to UI
                document.getElementById('soundVolume').value = this.options.soundVolume * 100;
                document.getElementById('soundVolumeValue').textContent = Math.round(this.options.soundVolume * 100) + '%';
                
                document.getElementById('musicVolume').value = this.options.musicVolume * 100;
                document.getElementById('musicVolumeValue').textContent = Math.round(this.options.musicVolume * 100) + '%';
                
                document.getElementById('showFPS').checked = this.options.showFPS;
                this.toggleFPS(this.options.showFPS);
                
                this.setDifficulty(this.options.difficulty);
            } catch (e) {
                console.error('Error loading options:', e);
            }
        }
    }
}
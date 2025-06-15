import { Game } from './game.js';
import { UIManager } from './uiManager.js';

// Wait for DOM to load before initializing the game
window.addEventListener('load', () => {
    const uiManager = new UIManager();
    const game = new Game(uiManager);
    
    // Initialize UI first
    uiManager.init(game);
    
    // Initialize game when play button is clicked
    document.getElementById('playBtn').addEventListener('click', () => {
        uiManager.showScreen('game');
        game.init();
    });
});
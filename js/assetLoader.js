export class AssetLoader {
    constructor() {
        this.images = {};
        this.sounds = {};
        this.music = null;
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.onComplete = null;
        this.soundVolume = 0.5;
        this.musicVolume = 0.3;
    }

    loadImage(name, src) {
        this.totalAssets++;
        const img = new Image();
        img.onload = () => this.assetLoaded();
        img.onerror = () => this.assetError(src);
        img.src = src;
        this.images[name] = img;
    }

    loadSound(name, src) {
        this.totalAssets++;
        const sound = new Audio();
        sound.oncanplaythrough = () => this.assetLoaded();
        sound.onerror = () => this.assetError(src);
        sound.src = src;
        sound.preload = 'auto';
        this.sounds[name] = sound;
    }

    assetLoaded() {
        this.loadedAssets++;
        if (this.loadedAssets === this.totalAssets && this.onComplete) {
            this.onComplete();
        }
    }

    assetError(src) {
        console.warn(`Failed to load asset: ${src}`);
        this.assetLoaded(); // Count as loaded to avoid blocking the game
    }

    getImage(name) {
        return this.images[name];
    }

    playSound(name, volume = this.soundVolume, loop = false) {
        if (this.sounds[name]) {
            // For music, we want to loop and not create new instances
            if (name === 'music') {
                if (this.music) {
                    this.music.pause();
                }
                
                this.music = this.sounds[name];
                this.music.volume = volume;
                this.music.loop = true;
                this.music.currentTime = 0;
                this.music.play().catch(e => console.log('Music play error:', e));
                return;
            }
            
            // For sound effects, clone the audio to allow overlapping sounds
            const sound = this.sounds[name].cloneNode();
            sound.volume = volume;
            sound.loop = loop;
            sound.play().catch(e => console.log('Sound play error:', e));
        }
    }

    setSoundVolume(volume) {
        this.soundVolume = volume;
    }

    setMusicVolume(volume) {
        this.musicVolume = volume;
        if (this.music) {
            this.music.volume = volume;
        }
    }

    setCompletionCallback(callback) {
        this.onComplete = callback;
    }
}
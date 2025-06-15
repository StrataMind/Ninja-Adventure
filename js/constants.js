export const TILES = {
    AIR: 0,
    GROUND: 1,
    BRICK: 2,
    COIN: 3,
    FLAG: 4,
    SPIKE: 5,
    POWERUP_SPEED: 6,
    POWERUP_JUMP: 7,
    POWERUP_INVINCIBLE: 8,
    QUICKSAND: 9,
    CACTUS: 10,
    WATER: 11,
    ICE: 12,
    LAVA: 13,
    BREAKABLE: 14,
    CHECKPOINT: 15
};

export const THEMES = {
    GRASSLAND: 0,
    FOREST: 1,
    DESERT: 2,
    ICE: 3,
    VOLCANO: 4,
    SPACE: 5
};

export const LEVEL_BACKGROUNDS = [
    'assets/images/freetileset/png/BG/BG.png', // Grassland
    'assets/images/freetileset/png/BG/BG.png', // Forest
    'assets/images/freetileset/png/BG/BG.png', // Desert - replace with desert background
    'assets/images/freetileset/png/BG/BG.png', // Ice - replace with ice background
    'assets/images/freetileset/png/BG/BG.png', // Volcano - replace with volcano background
    'assets/images/freetileset/png/BG/BG.png'  // Space - replace with space background
];

export const LEVEL_TILES = [
    { // Grassland
        ground: 'assets/images/freetileset/png/Tiles/2.png',
        brick: 'assets/images/freetileset/png/Tiles/14.png',
        spike: 'assets/images/freetileset/png/Tiles/16.png'
    },
    { // Forest
        ground: 'assets/images/freetileset/png/Tiles/2.png',
        brick: 'assets/images/freetileset/png/Tiles/14.png',
        spike: 'assets/images/freetileset/png/Tiles/16.png'
    },
    { // Desert
        ground: 'assets/images/freetileset/png/Tiles/3.png',
        brick: 'assets/images/freetileset/png/Tiles/5.png',
        spike: 'assets/images/freetileset/png/Tiles/16.png',
        quicksand: 'assets/images/freetileset/png/Tiles/4.png',
        cactus: 'assets/images/freetileset/png/Tiles/7.png'
    },
    { // Ice
        ground: 'assets/images/freetileset/png/Tiles/1.png',
        brick: 'assets/images/freetileset/png/Tiles/11.png',
        spike: 'assets/images/freetileset/png/Tiles/16.png',
        ice: 'assets/images/freetileset/png/Tiles/12.png'
    },
    { // Volcano
        ground: 'assets/images/freetileset/png/Tiles/13.png',
        brick: 'assets/images/freetileset/png/Tiles/15.png',
        spike: 'assets/images/freetileset/png/Tiles/16.png',
        lava: 'assets/images/freetileset/png/Tiles/18.png'
    }
];
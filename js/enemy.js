export class Enemy {
    constructor(game, x, y, type) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.type = type;
        this.vx = type === 'walker' ? 1 : 0;
        this.vy = 0;
        this.direction = 1;
        this.defeated = false;
    }

    update() {
        if (this.defeated) return;
        
        if (this.type === 'walker') {
            this.x += this.vx;
            
            // Simple AI - turn around at edges or walls
            const tileBelow = this.getTileAt(this.x + this.width/2, this.y + this.height + 1);
            const tileAhead = this.getTileAt(this.x + (this.direction > 0 ? this.width : 0), this.y + this.height/2);
            
            if (tileBelow === this.game.level.TILES.AIR || 
                tileAhead === this.game.level.TILES.GROUND || 
                tileAhead === this.game.level.TILES.BRICK) {
                this.direction *= -1;
                this.vx *= -1;
            }
        }

        // Apply gravity
        this.vy += 0.5;
        this.y += this.vy;

        // Ground collision (simplified)
        const groundY = 13 * this.game.level.TILE_SIZE - this.height;
        if (this.y >= groundY) {
            this.y = groundY;
            this.vy = 0;
        }

        // Check collision with player
        if (!this.game.player.invulnerable &&
            this.game.player.x < this.x + this.width &&
            this.game.player.x + this.game.player.width > this.x &&
            this.game.player.y < this.y + this.height &&
            this.game.player.y + this.game.player.height > this.y) {
            
            // Check if player is jumping on enemy
            if (this.game.player.vy > 0 && this.game.player.y < this.y) {
                // Enemy defeated
                this.game.score += 200;
                this.game.player.vy = -8; // Bounce
                this.defeated = true;
                this.game.updateUI();
                this.game.playSound('stomp');
            } else {
                // Player takes damage
                this.game.player.takeDamage();
            }
        }
    }

    getTileAt(x, y) {
        const col = Math.floor(x / this.game.level.TILE_SIZE);
        const row = Math.floor(y / this.game.level.TILE_SIZE);
        if (row >= 0 && row < this.game.level.tiles.length && 
            col >= 0 && col < this.game.level.tiles[row].length) {
            return this.game.level.tiles[row][col];
        }
        return this.game.level.TILES.AIR;
    }

    draw() {
        if (this.defeated) return;
        
        const ctx = this.game.ctx;
        
        if (this.game.assets.images.enemy) {
            // Draw sprite with correct direction
            ctx.save();
            if (this.direction === -1) {
                ctx.translate(this.x - this.game.camera.x + this.width, this.y - this.game.camera.y);
                ctx.scale(-1, 1);
                ctx.drawImage(this.game.assets.images.enemy, 0, 0, this.width, this.height);
            } else {
                ctx.drawImage(
                    this.game.assets.images.enemy,
                    this.x - this.game.camera.x,
                    this.y - this.game.camera.y,
                    this.width,
                    this.height
                );
            }
            ctx.restore();
        } else {
            // Fallback to rectangle
            ctx.fillStyle = '#44FF44';
            ctx.fillRect(this.x - this.game.camera.x, this.y - this.game.camera.y, this.width, this.height);
            
            // Simple face
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x - this.game.camera.x + 4, this.y - this.game.camera.y + 6, 3, 3);
            ctx.fillRect(this.x - this.game.camera.x + 17, this.y - this.game.camera.y + 6, 3, 3);
        }
    }
}
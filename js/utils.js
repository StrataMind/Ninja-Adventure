export class Utils {
    // Collision detection between two rectangles
    static checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    // Random number between min and max (inclusive)
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Clamp a value between min and max
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    // Calculate distance between two points
    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Lerp (linear interpolation) between two values
    static lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }

    // Debounce function to limit how often a function can be called
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}
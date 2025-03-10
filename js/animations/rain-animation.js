class RainEffect {
    constructor() {
        this.isActive = true;
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'rain-canvas';
        this.ctx = this.canvas.getContext('2d');
        
        this.drops = [];
        this.dropCount = 100;
        
        this.resize();
        this.createDrops();
        this.addToDOM();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        
        // Show status icon on initialization
        const rainStatus = document.querySelector('.rain-status');
        if (rainStatus) {
            rainStatus.classList.remove('hidden');
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createDrops() {
        for (let i = 0; i < this.dropCount; i++) {
            this.drops.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 10 + 5,
                thickness: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        if (!this.isActive) {
            requestAnimationFrame(() => this.animate());
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Get current theme color
        const color = getComputedStyle(document.body).getPropertyValue('--text-color').trim();
        this.ctx.strokeStyle = color;
        this.ctx.lineCap = 'round';

        this.drops.forEach(drop => {
            this.ctx.beginPath();
            this.ctx.lineWidth = drop.thickness;
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x, drop.y + drop.length);
            this.ctx.stroke();

            drop.y += drop.speed;
            if (drop.y > this.canvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * this.canvas.width;
            }
        });

        requestAnimationFrame(() => this.animate());
    }

    addToDOM() {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && !heroSection.contains(this.canvas)) {
            heroSection.appendChild(this.canvas);
        }
    }

    removeFromDOM() {
        if (this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }

    toggle() {
        this.isActive = !this.isActive;
        if (this.isActive) {
            this.addToDOM();
            this.canvas.style.opacity = '0.3';
        } else {
            this.canvas.style.opacity = '0';
            setTimeout(() => this.removeFromDOM(), 300); // Wait for fade out
        }
        
        // Update status icon
        const rainStatus = document.querySelector('.rain-status');
        if (rainStatus) {
            rainStatus.classList.toggle('hidden', !this.isActive);
        }
    }
} 
class PixelCanvas {
    constructor(canvasId, width = 400, height = 400) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        this.imageData = this.ctx.createImageData(width, height);
    }
    
    // Set pixel individual
    setPixel(x, y, r, g, b, a = 255) {
        const index = (y * this.canvas.width + x) * 4;
        this.imageData.data[index] = r;     // Red
        this.imageData.data[index + 1] = g; // Green
        this.imageData.data[index + 2] = b; // Blue
        this.imageData.data[index + 3] = a; // Alpha
    }
    
    // Get pixel value
    getPixel(x, y) {
        const index = (y * this.canvas.width + x) * 4;
        return {
            r: this.imageData.data[index],
            g: this.imageData.data[index + 1],
            b: this.imageData.data[index + 2],
            a: this.imageData.data[index + 3]
        };
    }
    
    // Update canvas dengan imageData
    updateCanvas() {
        this.ctx.putImageData(this.imageData, 0, 0);
    }
    
    // Clear canvas
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    }
    
    // Gambar gradient
    drawGradient() {
        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                const red = Math.floor((x / this.canvas.width) * 255);
                const green = Math.floor((y / this.canvas.height) * 255);
                const blue = 128;
                this.setPixel(x, y, red, green, blue);
            }
        }
        this.updateCanvas();
    }
    
    // Gambar pattern
    drawCheckPattern() {
        const blockSize = 20;
        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                const blockX = Math.floor(x / blockSize);
                const blockY = Math.floor(y / blockSize);
                const isBlack = (blockX + blockY) % 2 === 0;
                const color = isBlack ? 0 : 255;
                this.setPixel(x, y, color, color, color);
            }
        }
        this.updateCanvas();
    }
    
    // Demo manipulasi pixel
    drawCircle(centerX, centerY, radius, r, g, b) {
        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                const distance = Math.sqrt((x - centerX)**2 + (y - centerY)**2);
                if (distance <= radius) {
                    this.setPixel(x, y, r, g, b);
                }
            }
        }
        this.updateCanvas();
    }
}

// Perbandingan Pixel vs Vector
class PixelVsVectorDemo {
    constructor() {
        this.createDemoElements();
        this.initializeCanvases();
    }
    
    createDemoElements() {
        const container = document.createElement('div');
        container.innerHTML = `
            <h3>Pixel vs Vector Comparison</h3>
            <div style="display: flex; gap: 20px;">
                <div>
                    <h4>Pixel Graphics (Canvas)</h4>
                    <canvas id="pixel-canvas" style="border: 1px solid #ccc;"></canvas>
                    <div>
                        <button onclick="pixelDemo.drawPixelCircle()">Draw Circle</button>
                        <button onclick="pixelDemo.scaleUp()">Scale Up</button>
                    </div>
                </div>
                <div>
                    <h4>Vector Graphics (SVG)</h4>
                    <div id="vector-container"></div>
                    <div>
                        <button onclick="vectorDemo.drawVectorCircle()">Draw Circle</button>
                        <button onclick="vectorDemo.scaleUp()">Scale Up</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(container);
    }
    
    initializeCanvases() {
        // Pixel canvas
        window.pixelDemo = {
            canvas: new PixelCanvas('pixel-canvas', 200, 200),
            scale: 1,
            
            drawPixelCircle() {
                this.canvas.clear();
                this.canvas.drawCircle(100, 100, 50, 255, 0, 0);
            },
            
            scaleUp() {
                this.scale += 0.5;
                const canvas = document.getElementById('pixel-canvas');
                canvas.style.transform = `scale(${this.scale})`;
                canvas.style.transformOrigin = 'top left';
            }
        };
        
        // Vector SVG
        window.vectorDemo = {
            vg: new VectorGraphics('vector-container', 200, 200),
            scale: 1,
            
            drawVectorCircle() {
                this.vg.clear();
                this.vg.drawCircle(100, 100, 50, 'red');
            },
            
            scaleUp() {
                this.scale += 0.5;
                this.vg.svg.style.transform = `scale(${this.scale})`;
                this.vg.svg.style.transformOrigin = 'top left';
            }
        };
    }
}

// Initialize demo when page loads
document.addEventListener('DOMContentLoaded', function() {
    new PixelVsVectorDemo();
});

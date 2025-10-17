// Membuat SVG element secara dinamis
class VectorGraphics {
    constructor(containerId, width = 400, height = 400) {
        this.container = document.getElementById(containerId);
        this.svg = this.createSVG(width, height);
        this.container.appendChild(this.svg);
    }
    
    // Membuat SVG container
    createSVG(width, height) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.style.border = '1px solid #ccc';
        return svg;
    }
    
    // Menggambar lingkaran
    drawCircle(cx, cy, r, fill = 'blue', stroke = 'black', strokeWidth = 2) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', fill);
        circle.setAttribute('stroke', stroke);
        circle.setAttribute('stroke-width', strokeWidth);
        this.svg.appendChild(circle);
        return circle;
    }
    
    // Menggambar persegi panjang
    drawRect(x, y, width, height, fill = 'red', stroke = 'black', strokeWidth = 2) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        rect.setAttribute('fill', fill);
        rect.setAttribute('stroke', stroke);
        rect.setAttribute('stroke-width', strokeWidth);
        this.svg.appendChild(rect);
        return rect;
    }
    
    // Menggambar garis
    drawLine(x1, y1, x2, y2, stroke = 'black', strokeWidth = 2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', stroke);
        line.setAttribute('stroke-width', strokeWidth);
        this.svg.appendChild(line);
        return line;
    }
    
    // Menggambar path (bentuk kompleks)
    drawPath(pathData, fill = 'none', stroke = 'black', strokeWidth = 2) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', fill);
        path.setAttribute('stroke', stroke);
        path.setAttribute('stroke-width', strokeWidth);
        this.svg.appendChild(path);
        return path;
    }
    
    // Menggambar text
    drawText(x, y, text, fontSize = 16, fill = 'black', fontFamily = 'Arial') {
        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElement.setAttribute('x', x);
        textElement.setAttribute('y', y);
        textElement.setAttribute('font-size', fontSize);
        textElement.setAttribute('fill', fill);
        textElement.setAttribute('font-family', fontFamily);
        textElement.textContent = text;
        this.svg.appendChild(textElement);
        return textElement;
    }
    
    // Membersihkan canvas
    clear() {
        while (this.svg.firstChild) {
            this.svg.removeChild(this.svg.firstChild);
        }
    }
    
    // Demo berbagai bentuk
    demo() {
        this.clear();
        
        // Gambar grid koordinat
        this.drawGrid();
        
        // Bentuk-bentuk dasar
        this.drawCircle(100, 100, 30, 'lightblue', 'blue', 2);
        this.drawRect(200, 50, 80, 60, 'lightcoral', 'red', 2);
        this.drawLine(50, 200, 150, 250, 'green', 3);
        
        // Path untuk bentuk segitiga
        const trianglePath = 'M 250 200 L 300 250 L 200 250 Z';
        this.drawPath(trianglePath, 'lightyellow', 'orange', 2);
        
        // Text
        this.drawText(50, 300, 'Vector Graphics Demo', 18, 'purple');
    }
    
    // Menggambar grid koordinat
    drawGrid() {
        const width = parseInt(this.svg.getAttribute('width'));
        const height = parseInt(this.svg.getAttribute('height'));
        const step = 20;
        
        // Grid vertikal
        for (let x = 0; x <= width; x += step) {
            this.drawLine(x, 0, x, height, '#ddd', 0.5);
        }
        
        // Grid horizontal
        for (let y = 0; y <= height; y += step) {
            this.drawLine(0, y, width, y, '#ddd', 0.5);
        }
        
        // Sumbu utama
        this.drawLine(0, height/2, width, height/2, '#888', 1);
        this.drawLine(width/2, 0, width/2, height, '#888', 1);
    }
}
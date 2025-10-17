// Transformasi 2D
class Transform2D {
    constructor(vg) {
        this.vg = vg;
        this.coordSys = new CoordinateSystem(vg);
    }
    
    // Matriks transformasi
    static translationMatrix(tx, ty) {
        return [
            [1, 0, tx],
            [0, 1, ty],
            [0, 0, 1]
        ];
    }
    
    static scalingMatrix(sx, sy) {
        return [
            [sx, 0, 0],
            [0, sy, 0],
            [0, 0, 1]
        ];
    }
    
    static rotationMatrix(angleDeg) {
        const angleRad = angleDeg * Math.PI / 180;
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);
        return [
            [cos, -sin, 0],
            [sin, cos, 0],
            [0, 0, 1]
        ];
    }
    
    // Multiply matrices
    static multiplyMatrix(m1, m2) {
        const result = [];
        for (let i = 0; i < 3; i++) {
            result[i] = [];
            for (let j = 0; j < 3; j++) {
                result[i][j] = 0;
                for (let k = 0; k < 3; k++) {
                    result[i][j] += m1[i][k] * m2[k][j];
                }
            }
        }
        return result;
    }
    
    // Terapkan transformasi ke titik
    static applyTransform(matrix, point) {
        const x = matrix * point.x + matrix * point.y + matrix;
        const y = matrix * point.x + matrix * point.y + matrix;
        return {x: x, y: y};
    }
    
    // Gambar bentuk dan transformasinya
    drawShape(points, color = 'black', strokeWidth = 2) {
        if (points.length < 2) return;
        
        let pathData = `M ${points.x} ${points.y}`;
        for (let i = 1; i < points.length; i++) {
            pathData += ` L ${points[i].x} ${points[i].y}`;
        }
        pathData += ' Z'; // Close path
        
        return this.vg.drawPath(pathData, 'none', color, strokeWidth);
    }
    
    // Demo transformasi
    demoTransformations() {
        this.vg.clear();
        this.vg.drawGrid();
        
        // Bentuk original (segitiga)
        const originalPoints = [
            {x: 20, y: 10},
            {x: 40, y: 10},
            {x: 30, y: 30}
        ];
        
        // Konversi ke koordinat SVG
        const svgOriginal = originalPoints.map(p => this.coordSys.cartesianToSVG(p.x, p.y));
        this.drawShape(svgOriginal, 'blue', 2);
        
        // Translation
        const translationMatrix = Transform2D.translationMatrix(-50, 20);
        const translatedPoints = originalPoints.map(p => Transform2D.applyTransform(translationMatrix, p));
        const svgTranslated = translatedPoints.map(p => this.coordSys.cartesianToSVG(p.x, p.y));
        this.drawShape(svgTranslated, 'red', 2);
        
        // Scaling
        const scalingMatrix = Transform2D.scalingMatrix(1.5, 0.5);
        const scaledPoints = originalPoints.map(p => Transform2D.applyTransform(scalingMatrix, p));
        const svgScaled = scaledPoints.map(p => this.coordSys.cartesianToSVG(p.x, p.y));
        this.drawShape(svgScaled, 'green', 2);
        
        // Rotation
        const rotationMatrix = Transform2D.rotationMatrix(45);
        const rotatedPoints = originalPoints.map(p => Transform2D.applyTransform(rotationMatrix, p));
        const svgRotated = rotatedPoints.map(p => this.coordSys.cartesianToSVG(p.x, p.y));
        this.drawShape(svgRotated, 'purple', 2);
        
        // Legend
        this.vg.drawText(10, 380, 'Blue: Original', 12, 'blue');
        this.vg.drawText(120, 380, 'Red: Translated', 12, 'red');
        this.vg.drawText(250, 380, 'Green: Scaled', 12, 'green');
        this.vg.drawText(10, 395, 'Purple: Rotated 45°', 12, 'purple');
    }
}
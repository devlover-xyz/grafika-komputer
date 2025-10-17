// Sistem koordinat dan transformasi
class CoordinateSystem {
    constructor(vg) {
        this.vg = vg;
        this.points = [];
    }

    // Konversi koordinat Cartesian ke SVG
    cartesianToSVG(x, y) {
        const width = parseInt(this.vg.svg.getAttribute('width'));
        const height = parseInt(this.vg.svg.getAttribute('height'));

        const svgX = width / 2 + x;
        const svgY = height / 2 - y; // Flip Y axis

        return { x: svgX, y: svgY };
    }

    // Konversi SVG ke Cartesian
    svgToCartesian(svgX, svgY) {
        const width = parseInt(this.vg.svg.getAttribute('width'));
        const height = parseInt(this.vg.svg.getAttribute('height'));

        const x = svgX - width / 2;
        const y = height / 2 - svgY; // Flip Y axis

        return { x: x, y: y };
    }

    // Konversi Cartesian ke Polar
    cartesianToPolar(x, y) {
        const r = Math.sqrt(x * x + y * y);
        let theta = Math.atan2(y, x) * 180 / Math.PI;
        if (theta < 0) theta += 360;
        return { r: r, theta: theta };
    }

    // Konversi Polar ke Cartesian
    polarToCartesian(r, theta) {
        const thetaRad = theta * Math.PI / 180;
        const x = r * Math.cos(thetaRad);
        const y = r * Math.sin(thetaRad);
        return { x: x, y: y };
    }

    // Plot titik dalam sistem Cartesian
    plotPoint(x, y, label = '', color = 'red') {
        const svgCoord = this.cartesianToSVG(x, y);
        const circle = this.vg.drawCircle(svgCoord.x, svgCoord.y, 3, color);

        if (label) {
            this.vg.drawText(svgCoord.x + 5, svgCoord.y - 5,
                `${label}(${x},${y})`, 12, color);
        }

        this.points.push({ x, y, label, element: circle });
        return circle;
    }

    // Demo koordinat
    demoCoordinates() {
        this.vg.clear();
        this.vg.drawGrid();

        // Plot beberapa titik
        this.plotPoint(50, 30, 'A', 'red');
        this.plotPoint(-40, 20, 'B', 'blue');
        this.plotPoint(0, -50, 'C', 'green');
        this.plotPoint(-30, -40, 'D', 'purple');

        // Tampilkan konversi polar
        console.log('=== COORDINATE CONVERSION DEMO ===');
        this.points.forEach(point => {
            const polar = this.cartesianToPolar(point.x, point.y);
            console.log(`${point.label}: Cartesian(${point.x}, ${point.y}) = Polar(${polar.r.toFixed(2)}, ${polar.theta.toFixed(2)}°)`);
        });
    }
}
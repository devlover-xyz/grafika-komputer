/**
 * vector-image.ts
 * Implementasi representasi gambar berbasis vektor
 */

import { Color, Point2D, VectorShape, Line, Circle, Rectangle, Polygon } from './types';

export class VectorImage {
  private shapes: VectorShape[];
  private width: number;
  private height: number;

  /**
   * Constructor untuk gambar vektor
   * @param width - Lebar viewport
   * @param height - Tinggi viewport
   */
  constructor(width: number, height: number) {
    this.shapes = [];
    this.width = width;
    this.height = height;
  }

  /**
   * Tambahkan garis ke gambar
   */
  addLine(start: Point2D, end: Point2D, color: Color, thickness: number = 1): void {
    const line: Line = {
      type: 'line',
      start,
      end,
      color,
      thickness
    };
    this.shapes.push(line);
  }

  /**
   * Tambahkan lingkaran ke gambar
   */
  addCircle(center: Point2D, radius: number, color: Color, fill: boolean = false): void {
    const circle: Circle = {
      type: 'circle',
      center,
      radius,
      color,
      fill
    };
    this.shapes.push(circle);
  }

  /**
   * Tambahkan persegi panjang ke gambar
   */
  addRectangle(topLeft: Point2D, width: number, height: number, color: Color, fill: boolean = false): void {
    const rectangle: Rectangle = {
      type: 'rectangle',
      topLeft,
      width,
      height,
      color,
      fill
    };
    this.shapes.push(rectangle);
  }

  /**
   * Tambahkan polygon ke gambar
   */
  addPolygon(points: Point2D[], color: Color, fill: boolean = false): void {
    const polygon: Polygon = {
      type: 'polygon',
      points,
      color,
      fill
    };
    this.shapes.push(polygon);
  }

  /**
   * Dapatkan semua shapes
   */
  getShapes(): VectorShape[] {
    return [...this.shapes]; // Return copy
  }

  /**
   * Hapus semua shapes
   */
  clear(): void {
    this.shapes = [];
  }

  /**
   * Hapus shape berdasarkan index
   */
  removeShape(index: number): void {
    if (index >= 0 && index < this.shapes.length) {
      this.shapes.splice(index, 1);
    }
  }

  /**
   * Transformasi: Translasi (pergeseran) shape
   */
  translateShape(index: number, dx: number, dy: number): void {
    if (index < 0 || index >= this.shapes.length) return;

    const shape = this.shapes[index];

    switch (shape.type) {
      case 'line':
        shape.start.x += dx;
        shape.start.y += dy;
        shape.end.x += dx;
        shape.end.y += dy;
        break;
      case 'circle':
        shape.center.x += dx;
        shape.center.y += dy;
        break;
      case 'rectangle':
        shape.topLeft.x += dx;
        shape.topLeft.y += dy;
        break;
      case 'polygon':
        shape.points.forEach(p => {
          p.x += dx;
          p.y += dy;
        });
        break;
    }
  }

  /**
   * Transformasi: Scale shape
   */
  scaleShape(index: number, scale: number): void {
    if (index < 0 || index >= this.shapes.length) return;

    const shape = this.shapes[index];

    switch (shape.type) {
      case 'line':
        const lineCenter = {
          x: (shape.start.x + shape.end.x) / 2,
          y: (shape.start.y + shape.end.y) / 2
        };
        shape.start.x = lineCenter.x + (shape.start.x - lineCenter.x) * scale;
        shape.start.y = lineCenter.y + (shape.start.y - lineCenter.y) * scale;
        shape.end.x = lineCenter.x + (shape.end.x - lineCenter.x) * scale;
        shape.end.y = lineCenter.y + (shape.end.y - lineCenter.y) * scale;
        shape.thickness *= scale;
        break;
      case 'circle':
        shape.radius *= scale;
        break;
      case 'rectangle':
        shape.width *= scale;
        shape.height *= scale;
        break;
      case 'polygon':
        const centroid = this.getPolygonCentroid(shape.points);
        shape.points.forEach(p => {
          p.x = centroid.x + (p.x - centroid.x) * scale;
          p.y = centroid.y + (p.y - centroid.y) * scale;
        });
        break;
    }
  }

  /**
   * Transformasi: Rotasi shape terhadap titik pusat
   */
  rotateShape(index: number, angle: number): void {
    if (index < 0 || index >= this.shapes.length) return;

    const shape = this.shapes[index];
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const rotatePoint = (p: Point2D, center: Point2D): void => {
      const x = p.x - center.x;
      const y = p.y - center.y;
      p.x = center.x + x * cos - y * sin;
      p.y = center.y + x * sin + y * cos;
    };

    switch (shape.type) {
      case 'line':
        const lineCenter = {
          x: (shape.start.x + shape.end.x) / 2,
          y: (shape.start.y + shape.end.y) / 2
        };
        rotatePoint(shape.start, lineCenter);
        rotatePoint(shape.end, lineCenter);
        break;
      case 'circle':
        // Lingkaran tidak berubah saat dirotasi
        break;
      case 'rectangle':
        // Convert rectangle to polygon for rotation
        const rectCenter = {
          x: shape.topLeft.x + shape.width / 2,
          y: shape.topLeft.y + shape.height / 2
        };
        const points: Point2D[] = [
          { ...shape.topLeft },
          { x: shape.topLeft.x + shape.width, y: shape.topLeft.y },
          { x: shape.topLeft.x + shape.width, y: shape.topLeft.y + shape.height },
          { x: shape.topLeft.x, y: shape.topLeft.y + shape.height }
        ];
        points.forEach(p => rotatePoint(p, rectCenter));
        // Replace rectangle with polygon
        this.shapes[index] = {
          type: 'polygon',
          points,
          color: shape.color,
          fill: shape.fill
        };
        break;
      case 'polygon':
        const centroid = this.getPolygonCentroid(shape.points);
        shape.points.forEach(p => rotatePoint(p, centroid));
        break;
    }
  }

  /**
   * Helper: Hitung centroid polygon
   */
  private getPolygonCentroid(points: Point2D[]): Point2D {
    const sum = points.reduce(
      (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
      { x: 0, y: 0 }
    );
    return {
      x: sum.x / points.length,
      y: sum.y / points.length
    };
  }

  /**
   * Render ke canvas
   */
  renderToCanvas(ctx: CanvasRenderingContext2D): void {
    this.shapes.forEach(shape => {
      this.renderShape(ctx, shape);
    });
  }

  /**
   * Render shape individual
   */
  private renderShape(ctx: CanvasRenderingContext2D, shape: VectorShape): void {
    const colorString = `rgba(${shape.color.r}, ${shape.color.g}, ${shape.color.b}, ${shape.color.a})`;

    switch (shape.type) {
      case 'line':
        ctx.strokeStyle = colorString;
        ctx.lineWidth = shape.thickness;
        ctx.beginPath();
        ctx.moveTo(shape.start.x, shape.start.y);
        ctx.lineTo(shape.end.x, shape.end.y);
        ctx.stroke();
        break;

      case 'circle':
        ctx.beginPath();
        ctx.arc(shape.center.x, shape.center.y, shape.radius, 0, 2 * Math.PI);
        if (shape.fill) {
          ctx.fillStyle = colorString;
          ctx.fill();
        } else {
          ctx.strokeStyle = colorString;
          ctx.stroke();
        }
        break;

      case 'rectangle':
        if (shape.fill) {
          ctx.fillStyle = colorString;
          ctx.fillRect(shape.topLeft.x, shape.topLeft.y, shape.width, shape.height);
        } else {
          ctx.strokeStyle = colorString;
          ctx.strokeRect(shape.topLeft.x, shape.topLeft.y, shape.width, shape.height);
        }
        break;

      case 'polygon':
        if (shape.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.closePath();
        if (shape.fill) {
          ctx.fillStyle = colorString;
          ctx.fill();
        } else {
          ctx.strokeStyle = colorString;
          ctx.stroke();
        }
        break;
    }
  }

  /**
   * Export ke SVG string
   */
  exportToSVG(): string {
    let svg = `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">\n`;

    this.shapes.forEach(shape => {
      svg += this.shapeToSVG(shape);
    });

    svg += '</svg>';
    return svg;
  }

  /**
   * Konversi shape ke SVG element
   */
  private shapeToSVG(shape: VectorShape): string {
    const colorString = `rgb(${shape.color.r}, ${shape.color.g}, ${shape.color.b})`;
    const opacity = shape.color.a;

    switch (shape.type) {
      case 'line':
        return `  <line x1="${shape.start.x}" y1="${shape.start.y}" x2="${shape.end.x}" y2="${shape.end.y}" stroke="${colorString}" stroke-width="${shape.thickness}" opacity="${opacity}" />\n`;

      case 'circle':
        return `  <circle cx="${shape.center.x}" cy="${shape.center.y}" r="${shape.radius}" ${
          shape.fill ? `fill="${colorString}"` : `fill="none" stroke="${colorString}"`
        } opacity="${opacity}" />\n`;

      case 'rectangle':
        return `  <rect x="${shape.topLeft.x}" y="${shape.topLeft.y}" width="${shape.width}" height="${shape.height}" ${
          shape.fill ? `fill="${colorString}"` : `fill="none" stroke="${colorString}"`
        } opacity="${opacity}" />\n`;

      case 'polygon':
        const points = shape.points.map(p => `${p.x},${p.y}`).join(' ');
        return `  <polygon points="${points}" ${
          shape.fill ? `fill="${colorString}"` : `fill="none" stroke="${colorString}"`
        } opacity="${opacity}" />\n`;

      default:
        return '';
    }
  }

  /**
   * Dapatkan informasi memori (estimasi)
   */
  getMemoryUsage(): { bytes: number; shapeCount: number } {
    // Estimasi: setiap shape ~100-200 bytes
    const bytes = this.shapes.length * 150;
    return {
      bytes,
      shapeCount: this.shapes.length
    };
  }

  /**
   * Clone vector image
   */
  clone(): VectorImage {
    const cloned = new VectorImage(this.width, this.height);
    cloned.shapes = JSON.parse(JSON.stringify(this.shapes));
    return cloned;
  }
}

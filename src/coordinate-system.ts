/**
 * coordinate-system.ts
 * Implementasi sistem koordinat 2D dengan transformasi
 */

import { Point2D } from './types';

export class CoordinateSystem2D {
  private originX: number;
  private originY: number;
  private scaleX: number;
  private scaleY: number;
  private canvasWidth: number;
  private canvasHeight: number;

  /**
   * Constructor untuk sistem koordinat 2D
   * @param canvasWidth - Lebar canvas dalam pixel
   * @param canvasHeight - Tinggi canvas dalam pixel
   * @param originX - Posisi origin X (default: tengah)
   * @param originY - Posisi origin Y (default: tengah)
   */
  constructor(
    canvasWidth: number,
    canvasHeight: number,
    originX?: number,
    originY?: number
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.originX = originX ?? canvasWidth / 2;
    this.originY = originY ?? canvasHeight / 2;
    this.scaleX = 1;
    this.scaleY = 1;
  }

  /**
   * Konversi dari koordinat kartesian ke koordinat canvas (screen space)
   * Kartesian: origin di tengah, Y positif ke atas
   * Canvas: origin di kiri atas, Y positif ke bawah
   */
  cartesianToCanvas(point: Point2D): Point2D {
    return {
      x: this.originX + point.x * this.scaleX,
      y: this.originY - point.y * this.scaleY // Y dibalik
    };
  }

  /**
   * Konversi dari koordinat canvas ke koordinat kartesian
   */
  canvasToCartesian(point: Point2D): Point2D {
    return {
      x: (point.x - this.originX) / this.scaleX,
      y: (this.originY - point.y) / this.scaleY // Y dibalik
    };
  }

  /**
   * Set origin (titik pusat koordinat)
   */
  setOrigin(x: number, y: number): void {
    this.originX = x;
    this.originY = y;
  }

  /**
   * Set scale (zoom)
   */
  setScale(scaleX: number, scaleY?: number): void {
    this.scaleX = scaleX;
    this.scaleY = scaleY ?? scaleX;
  }

  /**
   * Get origin
   */
  getOrigin(): Point2D {
    return { x: this.originX, y: this.originY };
  }

  /**
   * Get scale
   */
  getScale(): { x: number; y: number } {
    return { x: this.scaleX, y: this.scaleY };
  }

  /**
   * Hitung jarak antara dua titik (Euclidean distance)
   */
  distance(p1: Point2D, p2: Point2D): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Translasi (pergeseran) titik
   */
  translate(point: Point2D, dx: number, dy: number): Point2D {
    return {
      x: point.x + dx,
      y: point.y + dy
    };
  }

  /**
   * Rotasi titik terhadap origin
   * @param point - Titik yang akan dirotasi
   * @param angle - Sudut rotasi dalam radian
   */
  rotate(point: Point2D, angle: number): Point2D {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: point.x * cos - point.y * sin,
      y: point.x * sin + point.y * cos
    };
  }

  /**
   * Scale titik terhadap origin
   */
  scale(point: Point2D, sx: number, sy?: number): Point2D {
    const scaleY = sy ?? sx;
    return {
      x: point.x * sx,
      y: point.y * scaleY
    };
  }

  /**
   * Rotasi titik terhadap titik pivot tertentu
   * @param point - Titik yang akan dirotasi
   * @param angle - Sudut rotasi dalam radian
   * @param pivot - Titik pivot (default: origin)
   */
  rotateAroundPoint(point: Point2D, angle: number, pivot: Point2D = { x: 0, y: 0 }): Point2D {
    // Translasi ke origin
    const translated = this.translate(point, -pivot.x, -pivot.y);

    // Rotasi
    const rotated = this.rotate(translated, angle);

    // Translasi kembali
    return this.translate(rotated, pivot.x, pivot.y);
  }

  /**
   * Shear (skewing) horizontal
   * @param point - Titik yang akan di-shear
   * @param shx - Faktor shear horizontal
   */
  shearX(point: Point2D, shx: number): Point2D {
    return {
      x: point.x + shx * point.y,
      y: point.y
    };
  }

  /**
   * Shear (skewing) vertical
   * @param point - Titik yang akan di-shear
   * @param shy - Faktor shear vertikal
   */
  shearY(point: Point2D, shy: number): Point2D {
    return {
      x: point.x,
      y: point.y + shy * point.x
    };
  }

  /**
   * Reflection (cermin) terhadap sumbu X
   */
  reflectX(point: Point2D): Point2D {
    return {
      x: point.x,
      y: -point.y
    };
  }

  /**
   * Reflection (cermin) terhadap sumbu Y
   */
  reflectY(point: Point2D): Point2D {
    return {
      x: -point.x,
      y: point.y
    };
  }

  /**
   * Reflection (cermin) terhadap origin
   */
  reflectOrigin(point: Point2D): Point2D {
    return {
      x: -point.x,
      y: -point.y
    };
  }

  /**
   * Reflection terhadap garis y = x
   */
  reflectDiagonal(point: Point2D): Point2D {
    return {
      x: point.y,
      y: point.x
    };
  }

  /**
   * Transformasi komposit menggunakan matriks 3x3
   * Format matriks: [a, b, c, d, e, f]
   * [a  c  e]
   * [b  d  f]
   * [0  0  1]
   */
  transformMatrix(point: Point2D, matrix: number[]): Point2D {
    if (matrix.length !== 6) {
      throw new Error('Matrix harus memiliki 6 elemen [a, b, c, d, e, f]');
    }

    const [a, b, c, d, e, f] = matrix;
    return {
      x: a * point.x + c * point.y + e,
      y: b * point.x + d * point.y + f
    };
  }

  /**
   * Buat matriks translasi
   */
  static createTranslationMatrix(dx: number, dy: number): number[] {
    return [1, 0, 0, 1, dx, dy];
  }

  /**
   * Buat matriks rotasi
   */
  static createRotationMatrix(angle: number): number[] {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [cos, sin, -sin, cos, 0, 0];
  }

  /**
   * Buat matriks scale
   */
  static createScaleMatrix(sx: number, sy?: number): number[] {
    const scaleY = sy ?? sx;
    return [sx, 0, 0, scaleY, 0, 0];
  }

  /**
   * Buat matriks shear X
   */
  static createShearXMatrix(shx: number): number[] {
    return [1, 0, shx, 1, 0, 0];
  }

  /**
   * Buat matriks shear Y
   */
  static createShearYMatrix(shy: number): number[] {
    return [1, shy, 0, 1, 0, 0];
  }

  /**
   * Kalikan dua matriks transformasi
   * Hasil: matrix1 × matrix2
   */
  static multiplyMatrices(m1: number[], m2: number[]): number[] {
    const [a1, b1, c1, d1, e1, f1] = m1;
    const [a2, b2, c2, d2, e2, f2] = m2;

    return [
      a1 * a2 + c1 * b2,
      b1 * a2 + d1 * b2,
      a1 * c2 + c1 * d2,
      b1 * c2 + d1 * d2,
      a1 * e2 + c1 * f2 + e1,
      b1 * e2 + d1 * f2 + f1
    ];
  }

  /**
   * Cek apakah titik berada dalam canvas
   */
  isInCanvas(point: Point2D): boolean {
    const canvasPoint = this.cartesianToCanvas(point);
    return (
      canvasPoint.x >= 0 &&
      canvasPoint.x < this.canvasWidth &&
      canvasPoint.y >= 0 &&
      canvasPoint.y < this.canvasHeight
    );
  }

  /**
   * Gambar grid koordinat untuk visualisasi
   */
  drawGrid(
    ctx: CanvasRenderingContext2D,
    gridSize: number = 50,
    color: string = '#e0e0e0'
  ): void {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    // Grid vertikal
    for (let x = 0; x < this.canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvasHeight);
      ctx.stroke();
    }

    // Grid horizontal
    for (let y = 0; y < this.canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvasWidth, y);
      ctx.stroke();
    }
  }

  /**
   * Gambar sumbu koordinat (X dan Y)
   */
  drawAxes(ctx: CanvasRenderingContext2D): void {
    // Sumbu X (merah)
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, this.originY);
    ctx.lineTo(this.canvasWidth, this.originY);
    ctx.stroke();

    // Sumbu Y (hijau)
    ctx.strokeStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(this.originX, 0);
    ctx.lineTo(this.originX, this.canvasHeight);
    ctx.stroke();

    // Label origin
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.fillText('(0,0)', this.originX + 5, this.originY - 5);
  }
}

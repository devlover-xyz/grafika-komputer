/**
 * pixel-image.ts
 * Implementasi representasi gambar berbasis piksel (raster/bitmap)
 */

import { Color, Dimensions, Point2D, Pixel } from './types';

export class PixelImage {
  private pixels: Uint8ClampedArray; // Array untuk menyimpan data piksel (RGBA)
  private width: number;
  private height: number;

  /**
   * Constructor untuk gambar piksel
   * @param width - Lebar gambar dalam piksel
   * @param height - Tinggi gambar dalam piksel
   * @param backgroundColor - Warna latar belakang (default: putih)
   */
  constructor(
    width: number,
    height: number,
    backgroundColor: Color = { r: 255, g: 255, b: 255, a: 1 }
  ) {
    this.width = width;
    this.height = height;

    // Setiap piksel memiliki 4 byte (RGBA)
    this.pixels = new Uint8ClampedArray(width * height * 4);

    // Inisialisasi dengan warna latar belakang
    this.fill(backgroundColor);
  }

  /**
   * Dapatkan dimensi gambar
   */
  getDimensions(): Dimensions {
    return { width: this.width, height: this.height };
  }

  /**
   * Hitung index array untuk koordinat (x, y)
   */
  private getIndex(x: number, y: number): number {
    return (y * this.width + x) * 4;
  }

  /**
   * Cek apakah koordinat valid
   */
  private isValidCoordinate(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * Set warna piksel pada koordinat tertentu
   */
  setPixel(x: number, y: number, color: Color): void {
    if (!this.isValidCoordinate(x, y)) {
      return; // Abaikan jika koordinat di luar batas
    }

    const index = this.getIndex(Math.floor(x), Math.floor(y));
    this.pixels[index] = color.r;
    this.pixels[index + 1] = color.g;
    this.pixels[index + 2] = color.b;
    this.pixels[index + 3] = color.a * 255; // Alpha: 0-1 -> 0-255
  }

  /**
   * Dapatkan warna piksel pada koordinat tertentu
   */
  getPixel(x: number, y: number): Color | null {
    if (!this.isValidCoordinate(x, y)) {
      return null;
    }

    const index = this.getIndex(Math.floor(x), Math.floor(y));
    return {
      r: this.pixels[index],
      g: this.pixels[index + 1],
      b: this.pixels[index + 2],
      a: this.pixels[index + 3] / 255
    };
  }

  /**
   * Isi seluruh gambar dengan warna tertentu
   */
  fill(color: Color): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.setPixel(x, y, color);
      }
    }
  }

  /**
   * Gambar garis menggunakan algoritma Bresenham
   */
  drawLine(x0: number, y0: number, x1: number, y1: number, color: Color): void {
    x0 = Math.floor(x0);
    y0 = Math.floor(y0);
    x1 = Math.floor(x1);
    y1 = Math.floor(y1);

    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      this.setPixel(x0, y0, color);

      if (x0 === x1 && y0 === y1) break;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  /**
   * Gambar lingkaran menggunakan algoritma Midpoint Circle
   */
  drawCircle(centerX: number, centerY: number, radius: number, color: Color, fill: boolean = false): void {
    centerX = Math.floor(centerX);
    centerY = Math.floor(centerY);
    radius = Math.floor(radius);

    if (fill) {
      // Isi lingkaran
      for (let y = -radius; y <= radius; y++) {
        for (let x = -radius; x <= radius; x++) {
          if (x * x + y * y <= radius * radius) {
            this.setPixel(centerX + x, centerY + y, color);
          }
        }
      }
    } else {
      // Gambar outline lingkaran
      let x = radius;
      let y = 0;
      let err = 0;

      while (x >= y) {
        this.setPixel(centerX + x, centerY + y, color);
        this.setPixel(centerX + y, centerY + x, color);
        this.setPixel(centerX - y, centerY + x, color);
        this.setPixel(centerX - x, centerY + y, color);
        this.setPixel(centerX - x, centerY - y, color);
        this.setPixel(centerX - y, centerY - x, color);
        this.setPixel(centerX + y, centerY - x, color);
        this.setPixel(centerX + x, centerY - y, color);

        if (err <= 0) {
          y += 1;
          err += 2 * y + 1;
        }
        if (err > 0) {
          x -= 1;
          err -= 2 * x + 1;
        }
      }
    }
  }

  /**
   * Gambar persegi panjang
   */
  drawRectangle(x: number, y: number, width: number, height: number, color: Color, fill: boolean = false): void {
    x = Math.floor(x);
    y = Math.floor(y);
    width = Math.floor(width);
    height = Math.floor(height);

    if (fill) {
      for (let py = y; py < y + height; py++) {
        for (let px = x; px < x + width; px++) {
          this.setPixel(px, py, color);
        }
      }
    } else {
      // Gambar outline
      this.drawLine(x, y, x + width, y, color); // Top
      this.drawLine(x + width, y, x + width, y + height, color); // Right
      this.drawLine(x + width, y + height, x, y + height, color); // Bottom
      this.drawLine(x, y + height, x, y, color); // Left
    }
  }

  /**
   * Dapatkan data piksel mentah (untuk rendering ke canvas)
   */
  getPixelData(): Uint8ClampedArray {
    return this.pixels;
  }

  /**
   * Render ke canvas
   */
  renderToCanvas(ctx: CanvasRenderingContext2D): void {
    const imageData = ctx.createImageData(this.width, this.height);
    imageData.data.set(this.pixels);
    ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Dapatkan informasi memori yang digunakan
   */
  getMemoryUsage(): { bytes: number; megabytes: number } {
    const bytes = this.pixels.length;
    return {
      bytes,
      megabytes: bytes / (1024 * 1024)
    };
  }

  /**
   * Clone gambar
   */
  clone(): PixelImage {
    const cloned = new PixelImage(this.width, this.height);
    cloned.pixels.set(this.pixels);
    return cloned;
  }

  /**
   * Aplikasikan filter grayscale
   */
  applyGrayscale(): void {
    for (let i = 0; i < this.pixels.length; i += 4) {
      const gray = 0.299 * this.pixels[i] + 0.587 * this.pixels[i + 1] + 0.114 * this.pixels[i + 2];
      this.pixels[i] = gray;
      this.pixels[i + 1] = gray;
      this.pixels[i + 2] = gray;
    }
  }

  /**
   * Aplikasikan filter invert
   */
  applyInvert(): void {
    for (let i = 0; i < this.pixels.length; i += 4) {
      this.pixels[i] = 255 - this.pixels[i];
      this.pixels[i + 1] = 255 - this.pixels[i + 1];
      this.pixels[i + 2] = 255 - this.pixels[i + 2];
    }
  }

  /**
   * Aplikasikan brightness adjustment
   */
  applyBrightness(adjustment: number): void {
    for (let i = 0; i < this.pixels.length; i += 4) {
      this.pixels[i] = Math.max(0, Math.min(255, this.pixels[i] + adjustment));
      this.pixels[i + 1] = Math.max(0, Math.min(255, this.pixels[i + 1] + adjustment));
      this.pixels[i + 2] = Math.max(0, Math.min(255, this.pixels[i + 2] + adjustment));
    }
  }
}

/**
 * types.ts
 * Definisi tipe-tipe data untuk grafika komputer
 */

// Tipe untuk koordinat 2D
export interface Point2D {
  x: number;
  y: number;
}

// Tipe untuk warna RGBA
export interface Color {
  r: number; // Red: 0-255
  g: number; // Green: 0-255
  b: number; // Blue: 0-255
  a: number; // Alpha: 0-1
}

// Tipe untuk pixel
export interface Pixel {
  position: Point2D;
  color: Color;
}

// Tipe untuk dimensi gambar
export interface Dimensions {
  width: number;
  height: number;
}

// Tipe untuk shape vektor
export type VectorShape = Line | Circle | Rectangle | Polygon;

export interface Line {
  type: 'line';
  start: Point2D;
  end: Point2D;
  color: Color;
  thickness: number;
}

export interface Circle {
  type: 'circle';
  center: Point2D;
  radius: number;
  color: Color;
  fill: boolean;
}

export interface Rectangle {
  type: 'rectangle';
  topLeft: Point2D;
  width: number;
  height: number;
  color: Color;
  fill: boolean;
}

export interface Polygon {
  type: 'polygon';
  points: Point2D[];
  color: Color;
  fill: boolean;
}

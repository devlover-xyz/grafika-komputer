# Tutorial Lengkap - Grafika Komputer dengan TypeScript

Tutorial step-by-step untuk memahami dan mengimplementasikan konsep-konsep grafika komputer.

## 📑 Daftar Isi

1. [Setup dan Persiapan](#1-setup-dan-persiapan)
2. [Memahami Sistem Koordinat](#2-memahami-sistem-koordinat)
3. [Bekerja dengan Gambar Piksel](#3-bekerja-dengan-gambar-piksel)
4. [Bekerja dengan Gambar Vektor](#4-bekerja-dengan-gambar-vektor)
5. [Transformasi 2D](#5-transformasi-2d)
6. [Perbandingan Piksel vs Vektor](#6-perbandingan-piksel-vs-vektor)
7. [Mini Project](#7-mini-project)

---

## 1. Setup dan Persiapan

### Langkah 1: Clone dan Install

```bash
cd grafika-komputer
npm install
```

### Langkah 2: Compile TypeScript

```bash
npm run build
```

### Langkah 3: Jalankan Web Server

```bash
npm run serve
```

Buka browser: `http://localhost:8080`

### Langkah 4: Setup Development Environment

Untuk development dengan auto-reload:

```bash
# Terminal 1: Watch TypeScript
npm run dev

# Terminal 2: Web Server
npm run serve
```

---

## 2. Memahami Sistem Koordinat

### Teori: Dua Sistem Koordinat

#### Koordinat Canvas (Screen Space)
```
(0,0) ───────────► X
  │
  │
  │
  ▼
  Y

- Origin: Kiri atas
- X: Positif ke kanan
- Y: Positif ke BAWAH
```

#### Koordinat Kartesian (Mathematical)
```
        Y
        ▲
        │
        │
        │
────────┼────────► X
        │(0,0)
        │
        │
```

### Praktik: Menggunakan CoordinateSystem2D

Buat file `latihan-1.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Latihan 1: Sistem Koordinat</title>
</head>
<body>
  <canvas id="canvas" width="600" height="600"></canvas>
  <script src="dist/demo.js"></script>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Import dari compiled JS
    // Atau gunakan TypeScript langsung dengan bundler

    // Buat sistem koordinat
    const coordSys = new CoordinateSystem2D(600, 600);

    // Gambar grid dan sumbu
    coordSys.drawGrid(ctx, 50);
    coordSys.drawAxes(ctx);

    // Plot titik dalam koordinat Kartesian
    const points = [
      { x: 0, y: 0 },      // Origin
      { x: 100, y: 100 },  // Kuadran 1
      { x: -100, y: 100 }, // Kuadran 2
      { x: -100, y: -100 },// Kuadran 3
      { x: 100, y: -100 }  // Kuadran 4
    ];

    points.forEach(p => {
      const canvasPoint = coordSys.cartesianToCanvas(p);
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(canvasPoint.x, canvasPoint.y, 5, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.fillText(`(${p.x},${p.y})`, canvasPoint.x + 10, canvasPoint.y - 10);
    });
  </script>
</body>
</html>
```

### Latihan 1.1: Konversi Koordinat

**Tugas:** Konversi koordinat berikut dari Kartesian ke Canvas Space (canvas 800×600)

1. (0, 0) → ?
2. (100, 100) → ?
3. (-200, 150) → ?
4. (300, -200) → ?

**Jawaban:**
```typescript
const coordSys = new CoordinateSystem2D(800, 600);
// Origin di (400, 300)

// 1. (0, 0) → (400, 300)
// 2. (100, 100) → (500, 200)
// 3. (-200, 150) → (200, 150)
// 4. (300, -200) → (700, 500)
```

---

## 3. Bekerja dengan Gambar Piksel

### Teori: Representasi Piksel

Setiap piksel disimpan sebagai 4 byte:
```
[R, G, B, A, R, G, B, A, R, G, B, A, ...]
 ├─Pixel 1─┤  ├─Pixel 2─┤  ├─Pixel 3─┤
```

- **R** (Red): 0-255
- **G** (Green): 0-255
- **B** (Blue): 0-255
- **A** (Alpha): 0-255 (transparansi)

### Praktik 3.1: Membuat Gambar Piksel Sederhana

```typescript
import { PixelImage } from './pixel-image';
import { Color } from './types';

// Buat gambar 400×400
const img = new PixelImage(400, 400);

// Definisikan warna
const red: Color = { r: 255, g: 0, b: 0, a: 1 };
const green: Color = { r: 0, g: 255, b: 0, a: 1 };
const blue: Color = { r: 0, g: 0, b: 255, a: 1 };

// Gambar 3 lingkaran
img.drawCircle(100, 200, 50, red, true);
img.drawCircle(200, 200, 50, green, true);
img.drawCircle(300, 200, 50, blue, true);

// Render ke canvas
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
img.renderToCanvas(ctx);
```

### Praktik 3.2: Menggambar Pola

**Tugas:** Buat pola checkerboard (papan catur)

```typescript
const img = new PixelImage(400, 400);

const black: Color = { r: 0, g: 0, b: 0, a: 1 };
const white: Color = { r: 255, g: 255, b: 255, a: 1 };

const squareSize = 50;
const rows = 8;
const cols = 8;

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    // Alternating pattern
    const isBlack = (row + col) % 2 === 0;
    const color = isBlack ? black : white;

    img.drawRectangle(
      col * squareSize,
      row * squareSize,
      squareSize,
      squareSize,
      color,
      true
    );
  }
}

img.renderToCanvas(ctx);
```

### Praktik 3.3: Algoritma Bresenham

**Memahami Algoritma Drawing Garis:**

```typescript
// Pseudocode Bresenham's Line Algorithm
function drawLine(x0, y0, x1, y1, color) {
  dx = abs(x1 - x0)
  dy = abs(y1 - y0)
  sx = x0 < x1 ? 1 : -1  // Step X
  sy = y0 < y1 ? 1 : -1  // Step Y
  err = dx - dy

  while (true) {
    setPixel(x0, y0, color)

    if (x0 === x1 && y0 === y1) break

    e2 = 2 * err
    if (e2 > -dy) {
      err -= dy
      x0 += sx
    }
    if (e2 < dx) {
      err += dx
      y0 += sy
    }
  }
}
```

**Visualisasi:**
```
Langkah algoritma untuk garis dari (0,0) ke (5,3):

Step 0: (0,0) err=2
Step 1: (1,0) err=1
Step 2: (2,1) err=0
Step 3: (3,1) err=-1
Step 4: (4,2) err=-2
Step 5: (5,3) DONE
```

**Latihan:** Gambar pola bintang dengan garis

```typescript
const img = new PixelImage(400, 400);
const yellow: Color = { r: 255, g: 255, b: 0, a: 1 };

const centerX = 200;
const centerY = 200;
const radius = 150;
const points = 5;

// Gambar bintang 5 ujung
for (let i = 0; i < points; i++) {
  const angle1 = (i * 2 * Math.PI) / points - Math.PI / 2;
  const angle2 = ((i + 2) % points * 2 * Math.PI) / points - Math.PI / 2;

  const x1 = centerX + radius * Math.cos(angle1);
  const y1 = centerY + radius * Math.sin(angle1);
  const x2 = centerX + radius * Math.cos(angle2);
  const y2 = centerY + radius * Math.sin(angle2);

  img.drawLine(x1, y1, x2, y2, yellow);
}

img.renderToCanvas(ctx);
```

### Praktik 3.4: Image Filters

```typescript
const img = new PixelImage(400, 400);

// Gambar sesuatu
img.drawCircle(200, 200, 100, { r: 255, g: 100, b: 50, a: 1 }, true);
img.renderToCanvas(ctx);

// Tunggu 1 detik, lalu aplikasikan filter
setTimeout(() => {
  img.applyGrayscale();
  img.renderToCanvas(ctx);
}, 1000);

setTimeout(() => {
  img.applyInvert();
  img.renderToCanvas(ctx);
}, 2000);

setTimeout(() => {
  img.applyBrightness(50);
  img.renderToCanvas(ctx);
}, 3000);
```

---

## 4. Bekerja dengan Gambar Vektor

### Teori: Representasi Vektor

Vektor menyimpan **rumus matematis**, bukan piksel:

```typescript
// Lingkaran
{
  type: 'circle',
  center: { x: 100, y: 100 },
  radius: 50,
  color: { r: 255, g: 0, b: 0, a: 1 }
}

// Garis
{
  type: 'line',
  start: { x: 0, y: 0 },
  end: { x: 100, y: 100 },
  color: { r: 0, g: 0, b: 255, a: 1 },
  thickness: 2
}
```

### Praktik 4.1: Membuat Gambar Vektor

```typescript
import { VectorImage } from './vector-image';

const vectorImg = new VectorImage(600, 600);

// Gambar matahari
const yellow: Color = { r: 255, g: 255, b: 0, a: 1 };
const orange: Color = { r: 255, g: 165, b: 0, a: 1 };

// Lingkaran matahari
vectorImg.addCircle({ x: 300, y: 300 }, 80, yellow, true);

// Sinar matahari (8 garis)
for (let i = 0; i < 8; i++) {
  const angle = (i * Math.PI) / 4;
  const startDist = 100;
  const endDist = 150;

  const startX = 300 + startDist * Math.cos(angle);
  const startY = 300 + startDist * Math.sin(angle);
  const endX = 300 + endDist * Math.cos(angle);
  const endY = 300 + endDist * Math.sin(angle);

  vectorImg.addLine(
    { x: startX, y: startY },
    { x: endX, y: endY },
    orange,
    5
  );
}

// Render
vectorImg.renderToCanvas(ctx);
```

### Praktik 4.2: Membuat Rumah dengan Vektor

```typescript
const house = new VectorImage(600, 600);

const brown: Color = { r: 139, g: 69, b: 19, a: 1 };
const red: Color = { r: 255, g: 0, b: 0, a: 1 };
const blue: Color = { r: 100, g: 150, b: 255, a: 1 };
const yellow: Color = { r: 255, g: 255, b: 200, a: 1 };

// Dinding rumah
house.addRectangle({ x: 200, y: 300 }, 200, 200, brown, true);

// Atap (segitiga)
house.addPolygon(
  [
    { x: 300, y: 200 }, // Puncak
    { x: 150, y: 300 }, // Kiri bawah
    { x: 450, y: 300 }  // Kanan bawah
  ],
  red,
  true
);

// Pintu
house.addRectangle({ x: 270, y: 400 }, 60, 100, brown, true);

// Jendela kiri
house.addRectangle({ x: 220, y: 350 }, 40, 40, blue, true);

// Jendela kanan
house.addRectangle({ x: 340, y: 350 }, 40, 40, blue, true);

// Matahari
house.addCircle({ x: 500, y: 100 }, 30, yellow, true);

house.renderToCanvas(ctx);
```

### Praktik 4.3: Export ke SVG

```typescript
// Setelah membuat gambar vektor
const svgString = house.exportToSVG();

// Download SVG
const blob = new Blob([svgString], { type: 'image/svg+xml' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'my-house.svg';
a.click();

// Atau tampilkan di console
console.log(svgString);
```

**Output SVG:**
```xml
<svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect x="200" y="300" width="200" height="200" fill="rgb(139, 69, 19)" opacity="1" />
  <polygon points="300,200 150,300 450,300" fill="rgb(255, 0, 0)" opacity="1" />
  ...
</svg>
```

---

## 5. Transformasi 2D

### Teori: Jenis-Jenis Transformasi

#### 1. Translasi (Translation)
Menggeser posisi objek.

```
x' = x + dx
y' = y + dy
```

#### 2. Rotasi (Rotation)
Memutar objek terhadap titik tertentu.

```
x' = x × cos(θ) - y × sin(θ)
y' = x × sin(θ) + y × cos(θ)
```

#### 3. Scale (Scaling)
Memperbesar atau memperkecil objek.

```
x' = x × sx
y' = y × sy
```

### Praktik 5.1: Transformasi Titik

```typescript
const coordSys = new CoordinateSystem2D(600, 600);

// Titik awal
const point = { x: 100, y: 50 };

// Gambar titik original
let canvasPoint = coordSys.cartesianToCanvas(point);
ctx.fillStyle = 'red';
ctx.beginPath();
ctx.arc(canvasPoint.x, canvasPoint.y, 5, 0, 2 * Math.PI);
ctx.fill();
ctx.fillText('Original', canvasPoint.x + 10, canvasPoint.y);

// Translasi
const translated = coordSys.translate(point, 50, 100);
canvasPoint = coordSys.cartesianToCanvas(translated);
ctx.fillStyle = 'blue';
ctx.beginPath();
ctx.arc(canvasPoint.x, canvasPoint.y, 5, 0, 2 * Math.PI);
ctx.fill();
ctx.fillText('Translated', canvasPoint.x + 10, canvasPoint.y);

// Rotasi 45°
const rotated = coordSys.rotate(point, Math.PI / 4);
canvasPoint = coordSys.cartesianToCanvas(rotated);
ctx.fillStyle = 'green';
ctx.beginPath();
ctx.arc(canvasPoint.x, canvasPoint.y, 5, 0, 2 * Math.PI);
ctx.fill();
ctx.fillText('Rotated 45°', canvasPoint.x + 10, canvasPoint.y);

// Scale 1.5x
const scaled = coordSys.scale(point, 1.5);
canvasPoint = coordSys.cartesianToCanvas(scaled);
ctx.fillStyle = 'purple';
ctx.beginPath();
ctx.arc(canvasPoint.x, canvasPoint.y, 5, 0, 2 * Math.PI);
ctx.fill();
ctx.fillText('Scaled 1.5x', canvasPoint.x + 10, canvasPoint.y);
```

### Praktik 5.2: Animasi Rotasi Vektor

```typescript
const vectorImg = new VectorImage(600, 600);

// Gambar persegi panjang
vectorImg.addRectangle(
  { x: 250, y: 250 },
  100,
  50,
  { r: 255, g: 0, b: 0, a: 1 },
  true
);

let angle = 0;

function animate() {
  // Clear canvas
  ctx.clearRect(0, 0, 600, 600);

  // Rotasi shape
  vectorImg.rotateShape(0, 0.02); // Rotasi 0.02 radian per frame

  // Render
  vectorImg.renderToCanvas(ctx);

  // Loop
  requestAnimationFrame(animate);
}

animate();
```

### Praktik 5.3: Transformasi Komposit

**Tugas:** Buat persegi yang berputar sambil bergerak melingkar

```typescript
const vectorImg = new VectorImage(600, 600);

// Persegi kecil
vectorImg.addRectangle(
  { x: 280, y: 280 },
  40,
  40,
  { r: 255, g: 100, b: 0, a: 1 },
  true
);

let t = 0;

function animate() {
  ctx.clearRect(0, 0, 600, 600);

  // Gambar lingkaran path (reference)
  ctx.strokeStyle = '#ccc';
  ctx.beginPath();
  ctx.arc(300, 300, 150, 0, 2 * Math.PI);
  ctx.stroke();

  // Clear dan re-add shape di posisi baru
  vectorImg.clear();

  // Hitung posisi circular
  const centerX = 300 + 150 * Math.cos(t);
  const centerY = 300 + 150 * Math.sin(t);

  // Gambar persegi di posisi baru
  vectorImg.addRectangle(
    { x: centerX - 20, y: centerY - 20 },
    40,
    40,
    { r: 255, g: 100, b: 0, a: 1 },
    true
  );

  // Rotasi shape
  vectorImg.rotateShape(0, t * 2);

  vectorImg.renderToCanvas(ctx);

  t += 0.02;
  requestAnimationFrame(animate);
}

animate();
```

---

## 6. Perbandingan Piksel vs Vektor

### Praktik 6.1: Zoom Comparison

```typescript
function compareZoom(zoom: number) {
  // PIXEL VERSION
  const pixelCanvas = document.getElementById('pixelCanvas') as HTMLCanvasElement;
  const pixelCtx = pixelCanvas.getContext('2d')!;

  const pixelImg = new PixelImage(200, 200);
  pixelImg.drawCircle(100, 100, 50, { r: 255, g: 0, b: 0, a: 1 }, true);

  pixelCtx.clearRect(0, 0, 400, 400);
  pixelCtx.save();
  pixelCtx.scale(zoom, zoom);
  pixelImg.renderToCanvas(pixelCtx);
  pixelCtx.restore();

  // VECTOR VERSION
  const vectorCanvas = document.getElementById('vectorCanvas') as HTMLCanvasElement;
  const vectorCtx = vectorCanvas.getContext('2d')!;

  const vectorImg = new VectorImage(400, 400);
  vectorImg.addCircle(
    { x: 200, y: 200 },
    50 * zoom,
    { r: 255, g: 0, b: 0, a: 1 },
    true
  );

  vectorCtx.clearRect(0, 0, 400, 400);
  vectorImg.renderToCanvas(vectorCtx);
}

// Test dengan zoom berbeda
compareZoom(1);  // Normal
setTimeout(() => compareZoom(2), 1000);  // 2x
setTimeout(() => compareZoom(4), 2000);  // 4x
```

**Hasil:**
- Piksel: Terlihat pixelated/kotak-kotak saat di-zoom
- Vektor: Tetap smooth dan tajam

### Praktik 6.2: Memory Usage Comparison

```typescript
function compareMemory() {
  const size = 1000;

  // Pixel image
  const pixelImg = new PixelImage(size, size);
  const pixelMem = pixelImg.getMemoryUsage();

  // Vector image with 100 shapes
  const vectorImg = new VectorImage(size, size);
  for (let i = 0; i < 100; i++) {
    vectorImg.addCircle(
      { x: Math.random() * size, y: Math.random() * size },
      Math.random() * 50,
      { r: 255, g: 0, b: 0, a: 1 },
      true
    );
  }
  const vectorMem = vectorImg.getMemoryUsage();

  console.log('Memory Comparison:');
  console.log(`Pixel (${size}×${size}): ${pixelMem.megabytes.toFixed(2)} MB`);
  console.log(`Vector (100 shapes): ${(vectorMem.bytes / 1024 / 1024).toFixed(2)} MB`);
}

compareMemory();
```

**Output Contoh:**
```
Memory Comparison:
Pixel (1000×1000): 3.81 MB
Vector (100 shapes): 0.01 MB
```

---

## 7. Mini Project

### Project 1: Paint Application Sederhana

Buat aplikasi drawing sederhana dengan fitur:
- Pilih warna
- Gambar dengan mouse
- Clear canvas
- Undo

```typescript
class SimplePaint {
  private pixelImg: PixelImage;
  private isDrawing: boolean = false;
  private lastX: number = 0;
  private lastY: number = 0;
  private currentColor: Color = { r: 0, g: 0, b: 0, a: 1 };

  constructor(private canvas: HTMLCanvasElement) {
    this.pixelImg = new PixelImage(canvas.width, canvas.height);
    this.setupEvents();
  }

  private setupEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDrawing = true;
      this.lastX = e.offsetX;
      this.lastY = e.offsetY;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.isDrawing) return;

      const x = e.offsetX;
      const y = e.offsetY;

      this.pixelImg.drawLine(this.lastX, this.lastY, x, y, this.currentColor);
      this.render();

      this.lastX = x;
      this.lastY = y;
    });

    this.canvas.addEventListener('mouseup', () => {
      this.isDrawing = false;
    });
  }

  setColor(color: Color) {
    this.currentColor = color;
  }

  clear() {
    this.pixelImg = new PixelImage(this.canvas.width, this.canvas.height);
    this.render();
  }

  private render() {
    const ctx = this.canvas.getContext('2d')!;
    this.pixelImg.renderToCanvas(ctx);
  }
}

// Usage
const canvas = document.getElementById('paintCanvas') as HTMLCanvasElement;
const paint = new SimplePaint(canvas);

document.getElementById('redBtn')!.addEventListener('click', () => {
  paint.setColor({ r: 255, g: 0, b: 0, a: 1 });
});

document.getElementById('clearBtn')!.addEventListener('click', () => {
  paint.clear();
});
```

### Project 2: Logo Editor Vektor

Buat editor untuk membuat logo sederhana:

```typescript
class LogoEditor {
  private vectorImg: VectorImage;
  private selectedShapeIndex: number = -1;

  constructor(private canvas: HTMLCanvasElement) {
    this.vectorImg = new VectorImage(canvas.width, canvas.height);
  }

  addShape(type: 'circle' | 'rectangle', color: Color) {
    if (type === 'circle') {
      this.vectorImg.addCircle(
        { x: 300, y: 300 },
        50,
        color,
        true
      );
    } else {
      this.vectorImg.addRectangle(
        { x: 250, y: 250 },
        100,
        100,
        color,
        true
      );
    }
    this.selectedShapeIndex = this.vectorImg.getShapes().length - 1;
    this.render();
  }

  rotateSelected() {
    if (this.selectedShapeIndex >= 0) {
      this.vectorImg.rotateShape(this.selectedShapeIndex, Math.PI / 6);
      this.render();
    }
  }

  scaleSelected(scale: number) {
    if (this.selectedShapeIndex >= 0) {
      this.vectorImg.scaleShape(this.selectedShapeIndex, scale);
      this.render();
    }
  }

  export() {
    return this.vectorImg.exportToSVG();
  }

  private render() {
    const ctx = this.canvas.getContext('2d')!;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.vectorImg.renderToCanvas(ctx);
  }
}
```

### Project 3: Interactive Coordinate System

Buat visualisasi interaktif untuk sistem koordinat:

```typescript
class InteractiveCoordinate {
  private coordSys: CoordinateSystem2D;
  private points: Array<{ cart: Point2D; color: string }> = [];

  constructor(private canvas: HTMLCanvasElement) {
    this.coordSys = new CoordinateSystem2D(canvas.width, canvas.height);
    this.setupEvents();
    this.render();
  }

  private setupEvents() {
    this.canvas.addEventListener('click', (e) => {
      // Konversi canvas click ke Kartesian
      const canvasPoint = { x: e.offsetX, y: e.offsetY };
      const cartPoint = this.coordSys.canvasToCartesian(canvasPoint);

      // Simpan titik
      this.points.push({
        cart: cartPoint,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      });

      this.render();
      this.showPointInfo(cartPoint);
    });
  }

  private showPointInfo(point: Point2D) {
    const info = document.getElementById('pointInfo')!;
    info.textContent = `Clicked: (${point.x.toFixed(0)}, ${point.y.toFixed(0)})`;
  }

  private render() {
    const ctx = this.canvas.getContext('2d')!;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Gambar grid dan sumbu
    this.coordSys.drawGrid(ctx);
    this.coordSys.drawAxes(ctx);

    // Gambar semua titik
    this.points.forEach(({ cart, color }) => {
      const canvasPoint = this.coordSys.cartesianToCanvas(cart);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(canvasPoint.x, canvasPoint.y, 5, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = 'black';
      ctx.font = '10px Arial';
      ctx.fillText(
        `(${cart.x.toFixed(0)},${cart.y.toFixed(0)})`,
        canvasPoint.x + 7,
        canvasPoint.y - 7
      );
    });
  }

  clear() {
    this.points = [];
    this.render();
  }
}
```

---

## 🎯 Checklist Pembelajaran

Pastikan Anda sudah memahami:

- [ ] Perbedaan sistem koordinat Canvas vs Kartesian
- [ ] Cara kerja representasi piksel (bitmap)
- [ ] Cara kerja representasi vektor
- [ ] Algoritma Bresenham untuk garis
- [ ] Algoritma Midpoint Circle
- [ ] Transformasi 2D (translasi, rotasi, scale)
- [ ] Perbandingan performa piksel vs vektor
- [ ] Cara export gambar vektor ke SVG
- [ ] Implementasi image filters
- [ ] Membuat aplikasi interaktif dengan canvas

---

## 📚 Resources Tambahan

### Algoritma Drawing
- Bresenham's Line Algorithm
- Midpoint Circle Algorithm
- Flood Fill Algorithm
- Scan-line Fill Algorithm

### Advanced Topics
- Bézier Curves
- Anti-aliasing
- Texture Mapping
- 3D Transformations
- Ray Tracing

### Tools untuk Eksplorasi
- **Pixel Art**: Piskel, Aseprite
- **Vector Graphics**: Inkscape, Figma, Adobe Illustrator
- **WebGL**: Three.js, Babylon.js

---

**Selamat belajar! Jangan ragu untuk eksperimen dan modifikasi kode sesuai kebutuhan Anda.** 🚀

# Grafika Komputer - Praktikum TypeScript

Simulasi dan tutorial lengkap untuk praktikum grafika komputer dengan materi:
- **Piksel vs Vektor** - Perbandingan representasi gambar
- **Model Warna** - RGB, HSV, CMYK
- **Transformasi 2D** - Translasi, Rotasi, Skala
- **Matriks Transformasi** - Matriks 3×3
- **Color Blending** - Pencampuran warna
- **Pencahayaan** - Dasar lighting

## Instalasi

### Prasyarat
- Node.js (v16 atau lebih baru)
- npm atau yarn

### Langkah Instalasi

```bash
# Install dependencies
npm install

# Compile TypeScript ke JavaScript
npm run build

# Jalankan web server
npm run serve
```

Buka browser dan akses: `http://localhost:8080`

## Cara Menjalankan

### Development Mode

```bash
# Watch mode - auto compile saat file berubah
npm run dev
```

### Production Build

```bash
# Build untuk production
npm run build

# Serve dengan web server
npm run serve
```

## Struktur Proyek

```
grafika-komputer/
├── index.html              # ⭐ Aplikasi utama dengan sidebar
├── tutorial-lengkap.html   # Tutorial interaktif lengkap
├── panduan-cepat.html      # Quick start guide
├── src/
│   ├── types.ts              # Definisi tipe data
│   ├── coordinate-system.ts  # Sistem koordinat 2D
│   ├── pixel-image.ts        # Representasi gambar piksel
│   ├── vector-image.ts       # Representasi gambar vektor
│   └── demo.ts              # File demo interaktif
├── dist/                     # Compiled JavaScript
│   ├── demo.js
│   ├── tutorial-demo.js
│   └── ...
├── package.json
├── tsconfig.json
├── README.md               # File ini
├── TUTORIAL.md            # Tutorial step-by-step
└── MULAI-DISINI.md        # Panduan memulai
```

## Konsep Materi

### 1. Gambar Piksel (Raster/Bitmap)

**Definisi:**
Gambar piksel adalah representasi gambar yang tersusun dari grid piksel-piksel kecil. Setiap piksel menyimpan informasi warna dalam format RGBA (Red, Green, Blue, Alpha).

**Karakteristik:**
- ✅ Cocok untuk foto dan gambar kompleks dengan gradasi warna
- ✅ Format: PNG, JPG, BMP, GIF
- ❌ Resolusi tetap (resolution-dependent)
- ❌ Kehilangan kualitas saat diperbesar (pixelated)
- ❌ Ukuran file besar untuk resolusi tinggi

**Penyimpanan Data:**
```
Setiap piksel = 4 bytes (RGBA)
Total memori = Width × Height × 4 bytes

Contoh: Gambar 800×600 piksel
= 800 × 600 × 4 bytes
= 1,920,000 bytes
≈ 1.83 MB (tanpa kompresi)
```

### 2. Gambar Vektor

**Definisi:**
Gambar vektor adalah representasi gambar menggunakan persamaan matematis untuk menggambar bentuk-bentuk geometris (garis, lingkaran, kurva, dll).

**Karakteristik:**
- ✅ Resolusi independen (scalable tanpa kehilangan kualitas)
- ✅ Ukuran file kecil
- ✅ Cocok untuk logo, ikon, diagram, ilustrasi
- ✅ Format: SVG, AI, EPS, PDF
- ❌ Tidak cocok untuk foto atau gambar kompleks

**Penyimpanan Data:**
```
Lingkaran:
- Center: (x, y)
- Radius: r
- Color: (r, g, b, a)
Total: ~20 bytes

Persegi panjang:
- TopLeft: (x, y)
- Width, Height
- Color: (r, g, b, a)
Total: ~24 bytes
```

### 3. Model Warna

#### RGB (Red, Green, Blue)
- **Penggunaan:** Monitor, layar digital
- **Jenis:** Additive color model
- **Rentang:** R: 0-255, G: 0-255, B: 0-255, A: 0-1

#### HSV (Hue, Saturation, Value)
- **Penggunaan:** Color picking, image editing
- **Jenis:** Intuitif untuk manusia
- **Rentang:** H: 0-360°, S: 0-100%, V: 0-100%

#### CMYK (Cyan, Magenta, Yellow, Black)
- **Penggunaan:** Printing
- **Jenis:** Subtractive color model

### 4. Transformasi 2D

#### Translasi (Translation)
Menggeser posisi objek.
```
x' = x + dx
y' = y + dy
```

#### Rotasi (Rotation)
Memutar objek terhadap titik tertentu.
```
x' = x × cos(θ) - y × sin(θ)
y' = x × sin(θ) + y × cos(θ)
```

#### Scale (Scaling)
Memperbesar atau memperkecil objek.
```
x' = x × sx
y' = y × sy
```

#### Shear (Skewing)
Memiringkan objek secara horizontal atau vertikal.
```
Shear Horizontal:
x' = x + shx × y
y' = y

Shear Vertical:
x' = x
y' = y + shy × x
```

#### Reflection (Mirroring)
Memantulkan objek terhadap sumbu atau garis tertentu.
```
Terhadap X-axis: x' = x,  y' = -y
Terhadap Y-axis: x' = -x, y' = y
Terhadap Origin:  x' = -x, y' = -y
Terhadap y=x:     x' = y,  y' = x
```

#### Rotasi Terhadap Titik Pivot
Memutar objek terhadap titik tertentu (bukan origin).
```
1. Translasi ke origin: (x-px, y-py)
2. Rotasi: x' = x×cos(θ) - y×sin(θ), y' = x×sin(θ) + y×cos(θ)
3. Translasi kembali: (x'+px, y'+py)
```

### 5. Matriks Transformasi

#### Matriks Translasi
```
[1  0  dx]   [x]   [x + dx]
[0  1  dy] × [y] = [y + dy]
[0  0  1 ]   [1]   [  1   ]
```

#### Matriks Rotasi
```
[cos(θ) -sin(θ)  0]   [x]
[sin(θ)  cos(θ)  0] × [y]
[  0       0     1]   [1]
```

#### Matriks Skala
```
[sx  0   0]   [x]   [x × sx]
[0   sy  0] × [y] = [y × sy]
[0   0   1]   [1]   [   1   ]
```

#### Matriks Shear
```
Shear X:
[1   shx  0]   [x]   [x + shx×y]
[0    1   0] × [y] = [    y    ]
[0    0   1]   [1]   [    1    ]

Shear Y:
[1    0   0]   [x]   [    x    ]
[shy  1   0] × [y] = [y + shy×x]
[0    0   1]   [1]   [    1    ]
```

#### Matriks Reflection
```
Terhadap X-axis:
[ 1   0  0]
[ 0  -1  0]
[ 0   0  1]

Terhadap Y-axis:
[-1   0  0]
[ 0   1  0]
[ 0   0  1]

Terhadap Origin:
[-1   0  0]
[ 0  -1  0]
[ 0   0  1]
```

#### Transformasi Komposit
Beberapa transformasi dapat digabungkan dengan perkalian matriks:
```
M_final = M_translate × M_rotate × M_scale × M_shear
```

## API Documentation

### Class: `PixelImage`

```typescript
const img = new PixelImage(width: number, height: number);

// Drawing methods
img.setPixel(x: number, y: number, color: Color): void
img.drawLine(x0, y0, x1, y1, color): void
img.drawCircle(centerX, centerY, radius, color, fill): void
img.drawRectangle(x, y, width, height, color, fill): void

// Filters
img.applyGrayscale(): void
img.applyInvert(): void
img.applyBrightness(adjustment: number): void

// Render
img.renderToCanvas(ctx: CanvasRenderingContext2D): void
```

### Class: `VectorImage`

```typescript
const vec = new VectorImage(width: number, height: number);

// Add shapes
vec.addCircle(center: Point2D, radius, color, fill): void
vec.addRectangle(topLeft: Point2D, width, height, color, fill): void
vec.addLine(start: Point2D, end: Point2D, color, thickness): void
vec.addPolygon(points: Point2D[], color, fill): void

// Transformations
vec.translateShape(index: number, dx, dy): void
vec.rotateShape(index: number, angle): void
vec.scaleShape(index: number, scale): void

// Export
vec.exportToSVG(): string
vec.renderToCanvas(ctx: CanvasRenderingContext2D): void
```

### Class: `CoordinateSystem2D`

```typescript
const coordSys = new CoordinateSystem2D(width, height);

// Conversions
coordSys.cartesianToCanvas(point: Point2D): Point2D
coordSys.canvasToCartesian(point: Point2D): Point2D

// Basic Transformations
coordSys.translate(point: Point2D, dx, dy): Point2D
coordSys.rotate(point: Point2D, angle): Point2D
coordSys.scale(point: Point2D, sx, sy): Point2D

// Advanced Transformations
coordSys.rotateAroundPoint(point: Point2D, angle, pivot): Point2D
coordSys.shearX(point: Point2D, shx): Point2D
coordSys.shearY(point: Point2D, shy): Point2D
coordSys.reflectX(point: Point2D): Point2D
coordSys.reflectY(point: Point2D): Point2D
coordSys.reflectOrigin(point: Point2D): Point2D
coordSys.reflectDiagonal(point: Point2D): Point2D

// Matrix Transformations
coordSys.transformMatrix(point: Point2D, matrix: number[]): Point2D
CoordinateSystem2D.createTranslationMatrix(dx, dy): number[]
CoordinateSystem2D.createRotationMatrix(angle): number[]
CoordinateSystem2D.createScaleMatrix(sx, sy?): number[]
CoordinateSystem2D.createShearXMatrix(shx): number[]
CoordinateSystem2D.createShearYMatrix(shy): number[]
CoordinateSystem2D.multiplyMatrices(m1, m2): number[]

// Utilities
coordSys.distance(p1: Point2D, p2: Point2D): number
coordSys.drawGrid(ctx): void
coordSys.drawAxes(ctx): void
```

## Contoh Penggunaan

### Contoh 1: Gambar Piksel

```typescript
import { PixelImage } from './pixel-image';

const img = new PixelImage(800, 600);

// Gambar lingkaran merah
img.drawCircle(400, 300, 100, { r: 255, g: 0, b: 0, a: 1 }, true);

// Render ke canvas
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
img.renderToCanvas(ctx);
```

### Contoh 2: Gambar Vektor

```typescript
import { VectorImage } from './vector-image';

const vec = new VectorImage(800, 600);

// Tambahkan lingkaran
vec.addCircle({ x: 400, y: 300 }, 100, { r: 255, g: 0, b: 0, a: 1 }, true);

// Rotasi
vec.rotateShape(0, Math.PI / 4); // 45 derajat

// Export ke SVG
const svg = vec.exportToSVG();
console.log(svg);
```

### Contoh 3: Transformasi Lanjutan

```typescript
import { CoordinateSystem2D } from './coordinate-system';

const coordSys = new CoordinateSystem2D(800, 600);

// Shear transformation
const point = { x: 100, y: 50 };
const sheared = coordSys.shearX(point, 0.5);
console.log(sheared); // { x: 125, y: 50 }

// Reflection
const reflected = coordSys.reflectX(point);
console.log(reflected); // { x: 100, y: -50 }

// Rotasi terhadap pivot point
const pivot = { x: 200, y: 200 };
const rotated = coordSys.rotateAroundPoint(point, Math.PI / 2, pivot);
```

### Contoh 4: Transformasi dengan Matriks

```typescript
import { CoordinateSystem2D } from './coordinate-system';

const coordSys = new CoordinateSystem2D(800, 600);

// Buat matriks transformasi
const translateMat = CoordinateSystem2D.createTranslationMatrix(50, 30);
const rotateMat = CoordinateSystem2D.createRotationMatrix(Math.PI / 4);
const scaleMat = CoordinateSystem2D.createScaleMatrix(1.5, 1.5);

// Gabungkan transformasi
const compositeMat = CoordinateSystem2D.multiplyMatrices(
  translateMat,
  CoordinateSystem2D.multiplyMatrices(rotateMat, scaleMat)
);

// Aplikasikan ke point
const point = { x: 100, y: 100 };
const transformed = coordSys.transformMatrix(point, compositeMat);
console.log(transformed);
```

## Perbandingan Piksel vs Vektor

| Aspek | Piksel (Raster) | Vektor |
|-------|----------------|--------|
| **Skalabilitas** | ❌ Pixelated saat diperbesar | ✅ Tetap tajam di semua ukuran |
| **Ukuran File** | ❌ Besar (tergantung resolusi) | ✅ Kecil (hanya data matematis) |
| **Kompleksitas** | ✅ Cocok untuk foto & detail tinggi | ❌ Tidak cocok untuk foto |
| **Editing** | ❌ Sulit edit shape individual | ✅ Mudah edit shape individual |
| **Rendering** | ✅ Cepat (direct pixel mapping) | ⚠️ Perlu kalkulasi matematis |
| **Format** | PNG, JPG, BMP, GIF | SVG, AI, EPS, PDF |

## Debugging Tips

### Canvas kosong/tidak muncul?
```typescript
// Pastikan DOM sudah loaded
document.addEventListener('DOMContentLoaded', () => {
  // Kode canvas di sini
});
```

### Koordinat terbalik?
```typescript
// Canvas Y positif ke bawah
// Gunakan CoordinateSystem2D untuk konversi otomatis
const canvasPoint = coordSys.cartesianToCanvas(kartesianPoint);
```

## Referensi

- **Computer Graphics: Principles and Practice** - Foley, van Dam, Feiner, Hughes
- **Fundamentals of Computer Graphics** - Peter Shirley
- **HTML5 Canvas Documentation** - MDN Web Docs
- **SVG Specification** - W3C

## Lisensi

MIT License - Bebas digunakan untuk keperluan edukasi dan pembelajaran.

---

**🎉 Selamat Belajar Grafika Komputer!**

Mulai dari: **[index.html](index.html)**

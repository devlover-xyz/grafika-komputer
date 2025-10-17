# Quick Start Guide

Panduan cepat untuk memulai proyek grafika komputer.

## 🚀 Instalasi Cepat

```bash
# 1. Masuk ke direktori
cd grafika-komputer

# 2. Install dependencies
npm install

# 3. Build TypeScript
npm run build

# 4. Jalankan server
npm run serve
```

Buka browser: **http://localhost:8080**

## 📖 File-File Penting

### Untuk Melihat Simulasi
- **[index.html](index.html)** - Simulasi interaktif lengkap dengan 5 tab
- **[contoh-sederhana.html](contoh-sederhana.html)** - Contoh sederhana tanpa TypeScript

### Untuk Belajar
- **[README.md](README.md)** - Dokumentasi lengkap dengan API reference
- **[TUTORIAL.md](TUTORIAL.md)** - Tutorial step-by-step dengan latihan

### Source Code
- **src/types.ts** - Definisi tipe data
- **src/coordinate-system.ts** - Sistem koordinat 2D
- **src/pixel-image.ts** - Implementasi gambar piksel (bitmap)
- **src/vector-image.ts** - Implementasi gambar vektor
- **src/demo.ts** - Kode demo untuk simulasi interaktif

## 🎯 Apa yang Bisa Dilakukan

### Tab 1: Pengenalan
- Memahami konsep piksel vs vektor
- Melihat perbandingan karakteristik

### Tab 2: Gambar Piksel
- Menggambar shapes (lingkaran, persegi, garis)
- Aplikasikan filter (grayscale, invert, brightness)
- Lihat penggunaan memori

### Tab 3: Gambar Vektor
- Menggambar shapes vektor
- Transformasi (rotasi, scale, translasi)
- Export ke SVG

### Tab 4: Perbandingan
- Lihat efek zoom pada piksel vs vektor
- Bandingkan kualitas gambar

### Tab 5: Sistem Koordinat
- Visualisasi grid Kartesian
- Plot titik
- Demo transformasi 2D

## 💻 Development Mode

Untuk development dengan auto-reload:

```bash
# Terminal 1: TypeScript watch mode
npm run dev

# Terminal 2: Web server
npm run serve
```

Edit file di folder `src/`, save, dan lihat perubahan otomatis di `dist/`.

## 📚 Materi yang Dipelajari

1. ✅ **Representasi Piksel (Bitmap/Raster)**
   - Grid piksel dengan informasi RGBA
   - Algoritma Bresenham (garis)
   - Algoritma Midpoint Circle (lingkaran)
   - Image filters

2. ✅ **Representasi Vektor**
   - Shapes matematis
   - Transformasi geometri
   - Export SVG
   - Resolution independent

3. ✅ **Sistem Koordinat 2D**
   - Koordinat Kartesian
   - Koordinat Canvas (screen space)
   - Konversi koordinat
   - Transformasi: translasi, rotasi, scale

## 🔧 Troubleshooting

### Canvas tidak muncul?
```typescript
// Pastikan DOM sudah loaded
document.addEventListener('DOMContentLoaded', () => {
  // Kode canvas di sini
});
```

### TypeScript error saat build?
```bash
# Hapus folder dist dan rebuild
rm -rf dist
npm run build
```

### Web server tidak jalan?
```bash
# Install http-server secara global
npm install -g http-server

# Atau gunakan npx
npx http-server . -p 8080
```

## 📖 Learning Path

### Pemula
1. Buka [contoh-sederhana.html](contoh-sederhana.html) - Lihat contoh dasar
2. Baca bagian "Konsep Materi" di [README.md](README.md)
3. Coba simulasi di [index.html](index.html)

### Menengah
1. Ikuti [TUTORIAL.md](TUTORIAL.md) section 1-4
2. Coba modifikasi `src/demo.ts`
3. Buat variasi shapes sendiri

### Lanjut
1. Implementasikan algoritma baru (flood fill, dll)
2. Buat mini project dari [TUTORIAL.md](TUTORIAL.md) section 7
3. Tambahkan fitur animasi

## 🎓 Untuk Praktikum

### Latihan Wajib
1. Gambar pola checkerboard (papan catur) - [Tutorial Section 3.2](TUTORIAL.md#praktik-32-menggambar-pola)
2. Buat logo sederhana dengan vektor - [Tutorial Section 4.2](TUTORIAL.md#praktik-42-membuat-rumah-dengan-vektor)
3. Implementasi transformasi - [Tutorial Section 5](TUTORIAL.md#5-transformasi-2d)

### Tugas Akhir (Pilih Salah Satu)
1. Paint Application - [Tutorial Section 7.1](TUTORIAL.md#project-1-paint-application-sederhana)
2. Logo Editor - [Tutorial Section 7.2](TUTORIAL.md#project-2-logo-editor-vektor)
3. Interactive Coordinate System - [Tutorial Section 7.3](TUTORIAL.md#project-3-interactive-coordinate-system)

## 🆘 Butuh Bantuan?

- **API Reference**: Lihat [README.md - API Documentation](README.md#api-documentation)
- **Tutorial**: Lihat [TUTORIAL.md](TUTORIAL.md)
- **Contoh Kode**: Lihat file `src/demo.ts` dan `contoh-sederhana.html`

## ⚡ Tips & Tricks

### Performance
- Gunakan **PixelImage** untuk foto/gambar kompleks
- Gunakan **VectorImage** untuk logo/ikon/diagram

### Memory Usage
```typescript
// Cek memory usage
const pixelImg = new PixelImage(800, 600);
console.log(pixelImg.getMemoryUsage()); // ~1.83 MB

const vectorImg = new VectorImage(800, 600);
// Tambah 100 shapes
console.log(vectorImg.getMemoryUsage()); // ~15 KB
```

### Export
```typescript
// Export vektor ke SVG
const svg = vectorImage.exportToSVG();
console.log(svg); // String SVG
```

---

**Happy Coding! 🚀**

Mulai dari [contoh-sederhana.html](contoh-sederhana.html) atau langsung ke [index.html](index.html)!

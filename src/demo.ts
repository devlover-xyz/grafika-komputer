/**
 * demo.ts
 * File demo interaktif untuk simulasi grafika komputer
 */

import { PixelImage } from './pixel-image';
import { VectorImage } from './vector-image';
import { CoordinateSystem2D } from './coordinate-system';
import { Color } from './types';

// Global variables
let pixelImage: PixelImage;
let vectorImage: VectorImage;
let coordinateSystem: CoordinateSystem2D;
let currentPixelImage: PixelImage;

// Helper: Parse hex color to Color type
function hexToColor(hex: string): Color {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b, a: 1 };
}

// Initialize canvas contexts
function initializeCanvases(): void {
  // Tab switching
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = (tab as HTMLElement).dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(tc => tc.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(targetTab!)?.classList.add('active');
    });
  });

  // Initialize pixel canvas
  const pixelCanvas = document.getElementById('pixelCanvas') as HTMLCanvasElement;
  if (pixelCanvas) {
    pixelImage = new PixelImage(pixelCanvas.width, pixelCanvas.height);
    currentPixelImage = pixelImage.clone();
  }

  // Initialize vector canvas
  const vectorCanvas = document.getElementById('vectorCanvas') as HTMLCanvasElement;
  if (vectorCanvas) {
    vectorImage = new VectorImage(vectorCanvas.width, vectorCanvas.height);
  }

  // Initialize coordinate system
  const coordCanvas = document.getElementById('coordinateCanvas') as HTMLCanvasElement;
  if (coordCanvas) {
    coordinateSystem = new CoordinateSystem2D(
      coordCanvas.width,
      coordCanvas.height
    );
  }

  // Setup zoom slider
  const zoomSlider = document.getElementById('zoomSlider') as HTMLInputElement;
  if (zoomSlider) {
    zoomSlider.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      const zoomValue = document.getElementById('zoomValue');
      if (zoomValue) {
        zoomValue.textContent = value + 'x';
      }
      drawComparisonShapes();
    });
  }
}

// ========== PIXEL GRAPHICS FUNCTIONS ==========

function drawPixelShapes(): void {
  const canvas = document.getElementById('pixelCanvas') as HTMLCanvasElement;
  const colorInput = document.getElementById('pixelColor') as HTMLInputElement;
  const color = hexToColor(colorInput.value);

  // Clear and redraw
  pixelImage = new PixelImage(canvas.width, canvas.height);

  // Draw various shapes
  pixelImage.drawCircle(150, 100, 50, color, true);
  pixelImage.drawRectangle(250, 50, 100, 100, { r: 76, g: 175, b: 80, a: 1 }, false);
  pixelImage.drawLine(400, 50, 550, 150, { r: 255, g: 193, b: 7, a: 1 });
  pixelImage.drawCircle(450, 250, 60, { r: 156, g: 39, b: 176, a: 1 }, false);
  pixelImage.drawRectangle(50, 200, 150, 80, color, true);

  // Render to canvas
  const ctx = canvas.getContext('2d')!;
  pixelImage.renderToCanvas(ctx);

  currentPixelImage = pixelImage.clone();
  updatePixelStats();
}

function applyPixelFilter(filterType: string): void {
  const canvas = document.getElementById('pixelCanvas') as HTMLCanvasElement;

  switch(filterType) {
    case 'grayscale':
      currentPixelImage.applyGrayscale();
      break;
    case 'invert':
      currentPixelImage.applyInvert();
      break;
    case 'brighten':
      currentPixelImage.applyBrightness(30);
      break;
  }

  const ctx = canvas.getContext('2d')!;
  currentPixelImage.renderToCanvas(ctx);
}

function clearPixelCanvas(): void {
  const canvas = document.getElementById('pixelCanvas') as HTMLCanvasElement;
  pixelImage = new PixelImage(canvas.width, canvas.height);
  currentPixelImage = pixelImage.clone();

  const ctx = canvas.getContext('2d')!;
  pixelImage.renderToCanvas(ctx);

  updatePixelStats();
}

function updatePixelStats(): void {
  const statsDiv = document.getElementById('pixelStats');
  if (!statsDiv) return;

  const memUsage = pixelImage.getMemoryUsage();
  const dims = pixelImage.getDimensions();

  statsDiv.innerHTML = `
    <div class="stat-item"><strong>Dimensi:</strong> ${dims.width} x ${dims.height} px</div>
    <div class="stat-item"><strong>Total Piksel:</strong> ${(dims.width * dims.height).toLocaleString()}</div>
    <div class="stat-item"><strong>Memori:</strong> ${memUsage.megabytes.toFixed(2)} MB</div>
  `;
}

// ========== VECTOR GRAPHICS FUNCTIONS ==========

function drawVectorShapes(): void {
  const canvas = document.getElementById('vectorCanvas') as HTMLCanvasElement;
  const colorInput = document.getElementById('vectorColor') as HTMLInputElement;
  const color = hexToColor(colorInput.value);

  vectorImage.clear();

  // Draw various shapes
  vectorImage.addCircle({ x: 150, y: 100 }, 50, color, true);
  vectorImage.addRectangle({ x: 250, y: 50 }, 100, 100, { r: 76, g: 175, b: 80, a: 1 }, false);
  vectorImage.addLine({ x: 400, y: 50 }, { x: 550, y: 150 }, { r: 255, g: 193, b: 7, a: 1 }, 3);
  vectorImage.addCircle({ x: 450, y: 250 }, 60, { r: 156, g: 39, b: 176, a: 1 }, false);

  // Draw triangle (polygon)
  vectorImage.addPolygon(
    [{ x: 100, y: 350 }, { x: 200, y: 250 }, { x: 50, y: 250 }],
    color,
    true
  );

  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  vectorImage.renderToCanvas(ctx);

  updateVectorStats();
}

function transformVector(type: string): void {
  const canvas = document.getElementById('vectorCanvas') as HTMLCanvasElement;
  const shapes = vectorImage.getShapes();

  if (shapes.length === 0) {
    alert('Gambar bentuk terlebih dahulu!');
    return;
  }

  // Apply transformation to the first shape
  switch(type) {
    case 'rotate':
      vectorImage.rotateShape(0, Math.PI / 6); // Rotate 30 degrees
      break;
    case 'scale':
      vectorImage.scaleShape(0, 1.2); // Scale 120%
      break;
    case 'translate':
      vectorImage.translateShape(0, 20, 20); // Move 20px right and down
      break;
  }

  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  vectorImage.renderToCanvas(ctx);
}

function exportSVG(): void {
  const svg = vectorImage.exportToSVG();
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'vector-image.svg';
  a.click();

  URL.revokeObjectURL(url);
}

function clearVectorCanvas(): void {
  const canvas = document.getElementById('vectorCanvas') as HTMLCanvasElement;
  vectorImage.clear();

  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateVectorStats();
}

function updateVectorStats(): void {
  const statsDiv = document.getElementById('vectorStats');
  if (!statsDiv) return;

  const memUsage = vectorImage.getMemoryUsage();

  statsDiv.innerHTML = `
    <div class="stat-item"><strong>Jumlah Shape:</strong> ${memUsage.shapeCount}</div>
    <div class="stat-item"><strong>Memori (estimasi):</strong> ${(memUsage.bytes / 1024).toFixed(2)} KB</div>
    <div class="stat-item"><strong>Resolusi:</strong> Independen (scalable)</div>
  `;
}

// ========== COMPARISON FUNCTIONS ==========

function drawComparisonShapes(): void {
  const pixelCanvas = document.getElementById('comparisonPixelCanvas') as HTMLCanvasElement;
  const vectorCanvas = document.getElementById('comparisonVectorCanvas') as HTMLCanvasElement;
  const zoomSlider = document.getElementById('zoomSlider') as HTMLInputElement;

  const zoom = parseFloat(zoomSlider.value);
  const color: Color = { r: 33, g: 150, b: 243, a: 1 };

  // Draw pixel version
  const pixelImg = new PixelImage(400, 400);
  pixelImg.drawCircle(200, 200, 80, color, true);

  const pixelCtx = pixelCanvas.getContext('2d')!;
  pixelCtx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
  pixelCtx.save();

  // Apply zoom (pixelated effect)
  const offsetX = (pixelCanvas.width - pixelCanvas.width * zoom) / 2;
  const offsetY = (pixelCanvas.height - pixelCanvas.height * zoom) / 2;
  pixelCtx.translate(offsetX, offsetY);
  pixelCtx.scale(zoom, zoom);

  pixelImg.renderToCanvas(pixelCtx);
  pixelCtx.restore();

  // Draw vector version
  const vectorImg = new VectorImage(400, 400);
  vectorImg.addCircle({ x: 200, y: 200 }, 80 * zoom, color, true);

  const vectorCtx = vectorCanvas.getContext('2d')!;
  vectorCtx.clearRect(0, 0, vectorCanvas.width, vectorCanvas.height);
  vectorImg.renderToCanvas(vectorCtx);
}

// ========== COORDINATE SYSTEM FUNCTIONS ==========

function drawCoordinateSystem(): void {
  const canvas = document.getElementById('coordinateCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  coordinateSystem.drawGrid(ctx, 50);

  // Draw axes
  coordinateSystem.drawAxes(ctx);

  // Draw labels
  ctx.fillStyle = '#666';
  ctx.font = '12px Arial';

  // X-axis labels
  for (let x = -250; x <= 250; x += 50) {
    if (x === 0) continue;
    const canvasPoint = coordinateSystem.cartesianToCanvas({ x, y: 0 });
    ctx.fillText(x.toString(), canvasPoint.x - 10, canvasPoint.y + 20);
  }

  // Y-axis labels
  for (let y = -250; y <= 250; y += 50) {
    if (y === 0) continue;
    const canvasPoint = coordinateSystem.cartesianToCanvas({ x: 0, y });
    ctx.fillText(y.toString(), canvasPoint.x + 10, canvasPoint.y + 5);
  }
}

function plotPoints(): void {
  drawCoordinateSystem();

  const canvas = document.getElementById('coordinateCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  // Plot some example points
  const points = [
    { x: 100, y: 100, label: 'A(100, 100)' },
    { x: -100, y: 150, label: 'B(-100, 150)' },
    { x: 150, y: -100, label: 'C(150, -100)' },
    { x: -150, y: -150, label: 'D(-150, -150)' }
  ];

  points.forEach(point => {
    const canvasPoint = coordinateSystem.cartesianToCanvas(point);

    // Draw point
    ctx.fillStyle = '#f44336';
    ctx.beginPath();
    ctx.arc(canvasPoint.x, canvasPoint.y, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Draw label
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(point.label, canvasPoint.x + 10, canvasPoint.y - 10);
  });
}

function demonstrateTransformations(): void {
  drawCoordinateSystem();

  const canvas = document.getElementById('coordinateCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  // Original point
  const point = { x: 100, y: 50 };

  // Draw original
  let canvasPoint = coordinateSystem.cartesianToCanvas(point);
  ctx.fillStyle = '#4CAF50';
  ctx.beginPath();
  ctx.arc(canvasPoint.x, canvasPoint.y, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillText('Original (100, 50)', canvasPoint.x + 10, canvasPoint.y - 10);

  // Translation
  const translated = coordinateSystem.translate(point, 50, 80);
  canvasPoint = coordinateSystem.cartesianToCanvas(translated);
  ctx.fillStyle = '#2196F3';
  ctx.beginPath();
  ctx.arc(canvasPoint.x, canvasPoint.y, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillText('Translated +50, +80', canvasPoint.x + 10, canvasPoint.y - 10);

  // Rotation
  const rotated = coordinateSystem.rotate(point, Math.PI / 4); // 45 degrees
  canvasPoint = coordinateSystem.cartesianToCanvas(rotated);
  ctx.fillStyle = '#FF9800';
  ctx.beginPath();
  ctx.arc(canvasPoint.x, canvasPoint.y, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillText('Rotated 45°', canvasPoint.x + 10, canvasPoint.y - 10);

  // Scale
  const scaled = coordinateSystem.scale(point, 1.5);
  canvasPoint = coordinateSystem.cartesianToCanvas(scaled);
  ctx.fillStyle = '#9C27B0';
  ctx.beginPath();
  ctx.arc(canvasPoint.x, canvasPoint.y, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillText('Scaled 1.5x', canvasPoint.x + 10, canvasPoint.y - 10);
}

// Make functions globally accessible
(window as any).drawPixelShapes = drawPixelShapes;
(window as any).applyPixelFilter = applyPixelFilter;
(window as any).clearPixelCanvas = clearPixelCanvas;
(window as any).drawVectorShapes = drawVectorShapes;
(window as any).transformVector = transformVector;
(window as any).exportSVG = exportSVG;
(window as any).clearVectorCanvas = clearVectorCanvas;
(window as any).drawComparisonShapes = drawComparisonShapes;
(window as any).drawCoordinateSystem = drawCoordinateSystem;
(window as any).plotPoints = plotPoints;
(window as any).demonstrateTransformations = demonstrateTransformations;

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCanvases);
} else {
  initializeCanvases();
}

import NodeImage from '../NodeImage.js';
import CrystallizeProperties from './CrystallizeProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class Crystallize extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Crystallize', CrystallizeProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Cell Size', 'hasCellSizeInput'),
      new InputNumber(this, 2, 'Seed', 'hasSeedInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.cellSize = typeof settings.cellSize !== 'undefined' ? settings.cellSize : 15;
    this.seed = typeof settings.seed !== 'undefined' ? settings.seed : 0;
  }


  mulberry32(a) {
    return function() {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let cellSize = this.cellSize;
      let seed = this.seed;
      if (this.inputs[1].number != null) cellSize = this.inputs[1].number;
      if (this.inputs[2].number != null) seed = this.inputs[2].number;
      cellSize = Math.max(2, Math.min(100, Math.round(cellSize)));

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const srcData = src.bitmap.data;
      const image = src.clone();
      const outData = image.bitmap.data;

      const rand = this.mulberry32(seed);

      // Generate Voronoi points on a grid with jitter
      const gridW = Math.ceil(w / cellSize) + 2;
      const gridH = Math.ceil(h / cellSize) + 2;
      const points = [];

      for (let gy = -1; gy < gridH; gy++) {
        for (let gx = -1; gx < gridW; gx++) {
          points.push({
            x: (gx + 0.5 + (rand() - 0.5) * 0.8) * cellSize,
            y: (gy + 0.5 + (rand() - 0.5) * 0.8) * cellSize,
          });
        }
      }

      // For each pixel, find closest point
      // Then assign average color of that cell
      // First pass: assign each pixel to a cell
      const cellMap = new Int32Array(w * h);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let minDist = Infinity;
          let closestIdx = 0;

          // Only check nearby grid cells for performance
          const gx = Math.floor(x / cellSize);
          const gy = Math.floor(y / cellSize);
          const startIdx = Math.max(0, (gy - 1 + 1) * (gridW + 1) + (gx - 1 + 1));

          for (let i = 0; i < points.length; i++) {
            const dx = x - points[i].x;
            const dy = y - points[i].y;
            const dist = dx * dx + dy * dy;
            if (dist < minDist) {
              minDist = dist;
              closestIdx = i;
            }
          }
          cellMap[y * w + x] = closestIdx;
        }
      }

      // Second pass: compute average color per cell
      const cellR = new Float64Array(points.length);
      const cellG = new Float64Array(points.length);
      const cellB = new Float64Array(points.length);
      const cellCount = new Int32Array(points.length);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const ci = cellMap[y * w + x];
          const si = (y * w + x) * 4;
          cellR[ci] += srcData[si];
          cellG[ci] += srcData[si + 1];
          cellB[ci] += srcData[si + 2];
          cellCount[ci]++;
        }
      }

      for (let i = 0; i < points.length; i++) {
        if (cellCount[i] > 0) {
          cellR[i] = Math.round(cellR[i] / cellCount[i]);
          cellG[i] = Math.round(cellG[i] / cellCount[i]);
          cellB[i] = Math.round(cellB[i] / cellCount[i]);
        }
      }

      // Third pass: assign cell colors
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const ci = cellMap[y * w + x];
          const idx = (y * w + x) * 4;
          outData[idx] = cellR[ci];
          outData[idx + 1] = cellG[ci];
          outData[idx + 2] = cellB[ci];
        }
      }

      this.image = image;
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  toJson() {
    let json = super.toJson();
    json.settings.cellSize = this.cellSize;
    json.settings.seed = this.seed;
    return json;
  }
}

import NodeImage from '../NodeImage.js';
import VoronoiProperties from './VoronoiProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import { Jimp } from "jimp";
import InputNumber from '../InputNumber.js';


export default class Voronoi extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Voronoi', VoronoiProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidthInput'),
      new InputNumber(this, 1, 'Height', 'hasHeightInput'),
      new InputNumber(this, 2, 'Points', 'hasPointsInput'),
      new InputNumber(this, 3, 'Seed', 'hasSeedInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height'),
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.points = typeof settings.points !== 'undefined' ? settings.points : 32;
    this.seed = typeof settings.seed !== 'undefined' ? settings.seed : 0;
    this.mode = typeof settings.mode !== 'undefined' ? settings.mode : 'cell';
  }


  toJson() {
    let json = super.toJson();
    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.points = this.points;
    json.settings.seed = this.seed;
    json.settings.mode = this.mode;
    return json;
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
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let numPoints = this.points;
    let seed = this.seed;

    if (this.inputs[0].number != null) width = this.inputs[0].number;
    if (this.inputs[1].number != null) height = this.inputs[1].number;
    if (this.inputs[2].number != null) numPoints = this.inputs[2].number;
    if (this.inputs[3].number != null) seed = this.inputs[3].number;

    width = Math.max(1, Math.round(width));
    height = Math.max(1, Math.round(height));
    numPoints = Math.max(1, Math.min(1000, Math.round(numPoints)));

    const rand = this.mulberry32(seed);

    // Generate random points with random colors
    const pts = [];
    for (let i = 0; i < numPoints; i++) {
      pts.push({
        x: rand() * width,
        y: rand() * height,
        color: Math.round(rand() * 255)
      });
    }

    const image = new Jimp({ width, height, color: 0x000000ff });
    const data = image.bitmap.data;
    const mode = this.mode;

    // Find max possible distance for normalization (edge distance mode)
    let maxEdgeDist = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let minDist = Infinity;
        let secondDist = Infinity;
        let closestIdx = 0;

        for (let i = 0; i < pts.length; i++) {
          const dx = x - pts[i].x;
          const dy = y - pts[i].y;
          const dist = dx * dx + dy * dy;

          if (dist < minDist) {
            secondDist = minDist;
            minDist = dist;
            closestIdx = i;
          } else if (dist < secondDist) {
            secondDist = dist;
          }
        }

        const idx = (y * width + x) * 4;
        let v;

        if (mode === 'cell') {
          v = pts[closestIdx].color;
        } else if (mode === 'distance') {
          v = Math.min(255, Math.round(Math.sqrt(minDist) * 2));
        } else if (mode === 'edge') {
          const edge = Math.sqrt(secondDist) - Math.sqrt(minDist);
          v = Math.min(255, Math.round(edge * 5));
          if (edge > maxEdgeDist) maxEdgeDist = edge;
        }

        data[idx] = v;
        data[idx + 1] = v;
        data[idx + 2] = v;
        data[idx + 3] = 255;
      }
    }

    this.image = image;
    super.run(inputThatTriggered);
  }


  passToChildren() {
    if (this.image) {
      this.outputs[1].connections.forEach(conn => {
        conn.number = this.image.bitmap.width;
        conn.runNode();
      });
      this.outputs[2].connections.forEach(conn => {
        conn.number = this.image.bitmap.height;
        conn.runNode();
      });
    }
    super.passToChildren();
  }
}

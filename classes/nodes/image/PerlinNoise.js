import NodeImage from '../NodeImage.js';
import PerlinNoiseProperties from './PerlinNoiseProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import { Jimp } from "jimp";
import InputNumber from '../InputNumber.js';


export default class PerlinNoise extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Perlin Noise', PerlinNoiseProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidthInput'),
      new InputNumber(this, 1, 'Height', 'hasHeightInput'),
      new InputNumber(this, 2, 'Scale', 'hasScaleInput'),
      new InputNumber(this, 3, 'Seed', 'hasSeedInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height'),
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.scale = typeof settings.scale !== 'undefined' ? settings.scale : 4;
    this.seed = typeof settings.seed !== 'undefined' ? settings.seed : 0;
  }


  toJson() {
    let json = super.toJson();
    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.scale = this.scale;
    json.settings.seed = this.seed;
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
    let scale = this.scale;
    let seed = this.seed;

    if (this.inputs[0].number != null) width = this.inputs[0].number;
    if (this.inputs[1].number != null) height = this.inputs[1].number;
    if (this.inputs[2].number != null) scale = this.inputs[2].number;
    if (this.inputs[3].number != null) seed = this.inputs[3].number;

    width = Math.max(1, Math.round(width));
    height = Math.max(1, Math.round(height));
    scale = Math.max(0.1, scale);

    // Generate permutation table from seed
    const rand = this.mulberry32(seed);
    const perm = new Uint8Array(512);
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
    }
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

    // Gradient vectors
    const grad2 = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];

    function dot2(g, x, y) { return g[0]*x + g[1]*y; }

    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(t, a, b) { return a + t * (b - a); }

    function perlin2(x, y) {
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
      const xf = x - Math.floor(x);
      const yf = y - Math.floor(y);
      const u = fade(xf);
      const v = fade(yf);

      const aa = perm[perm[X] + Y];
      const ab = perm[perm[X] + Y + 1];
      const ba = perm[perm[X + 1] + Y];
      const bb = perm[perm[X + 1] + Y + 1];

      const g00 = grad2[aa & 7];
      const g10 = grad2[ba & 7];
      const g01 = grad2[ab & 7];
      const g11 = grad2[bb & 7];

      const n00 = dot2(g00, xf, yf);
      const n10 = dot2(g10, xf - 1, yf);
      const n01 = dot2(g01, xf, yf - 1);
      const n11 = dot2(g11, xf - 1, yf - 1);

      return lerp(v, lerp(u, n00, n10), lerp(u, n01, n11));
    }

    const image = new Jimp({ width, height, color: 0x000000ff });
    const data = image.bitmap.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale;
        const ny = y / height * scale;
        const val = (perlin2(nx, ny) + 1) * 0.5;
        const v = Math.max(0, Math.min(255, Math.round(val * 255)));

        const idx = (y * width + x) * 4;
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

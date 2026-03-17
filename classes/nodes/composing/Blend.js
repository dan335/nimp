import { BlendMode } from 'jimp';
import NodeImage from '../NodeImage.js';
import BlendProperties from './BlendProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';

export default class Blend extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Blend', BlendProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Background'),
      new InputImage(this, 1, 'Foreground'),
      new InputNumber(this, 2, 'X', 'hasXInput'),
      new InputNumber(this, 3, 'Y', 'hasYInput'),
      new InputNumber(this, 4, 'Foreground Opacity', 'hasTopOpacityInput'),
      new InputNumber(this, 5, 'Background Opacity', 'hasBottomOpacityInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.blendX = typeof settings.blendX !== 'undefined' ? settings.blendX : 0;
    this.blendY = typeof settings.blendY !== 'undefined' ? settings.blendY : 0;
    this.mode = typeof settings.mode !== 'undefined' ? settings.mode : BlendMode.MULTIPLY;
    this.opacitySource = typeof settings.opacitySource !== 'undefined' ? settings.opacitySource : 1;
    this.opacityDest = typeof settings.opacityDest !== 'undefined' ? settings.opacityDest : 1;
  }


  // Custom blend modes not provided by Jimp
  static CUSTOM_MODES = ['softLight', 'colorDodge', 'colorBurn', 'linearDodge', 'linearBurn'];


  blendChannel(a, b) {
    switch (this.mode) {
      case 'softLight':
        if (b < 128) {
          return Math.round(2 * a * b / 255 + (a / 255) * (a / 255) * (255 - 2 * b));
        } else {
          return Math.round(2 * a * (255 - b) / 255 + Math.sqrt(a / 255) * (2 * b - 255));
        }
      case 'colorDodge':
        return a === 255 ? 255 : Math.min(255, Math.round((b * 255) / (255 - a)));
      case 'colorBurn':
        return a === 0 ? 0 : Math.max(0, Math.round(255 - ((255 - b) * 255) / a));
      case 'linearDodge':
        return Math.min(255, a + b);
      case 'linearBurn':
        return Math.max(0, a + b - 255);
      default:
        return b;
    }
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image && this.inputs[1].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let blendX = this.blendX;
      let blendY = this.blendY;
      let opacitySource = this.opacitySource;
      let opacityDest = this.opacityDest;

      if (this.inputs[2].number != null) {
        blendX = this.inputs[2].number;
      }

      if (this.inputs[3].number != null) {
        blendY = this.inputs[3].number;
      }

      if (this.inputs[4].number != null) {
        opacitySource = this.inputs[4].number;
      }

      if (this.inputs[5].number != null) {
        opacityDest = this.inputs[5].number;
      }

      opacitySource = Math.max(0, opacitySource);
      opacitySource = Math.min(1, opacitySource);

      opacityDest = Math.max(0, opacityDest);
      opacityDest = Math.min(1, opacityDest);

      if (Blend.CUSTOM_MODES.includes(this.mode)) {
        // Per-pixel custom blend
        const bg = this.inputs[0].image;
        const fg = this.inputs[1].image;
        const w = bg.bitmap.width;
        const h = bg.bitmap.height;
        const image = bg.clone();
        const bgData = bg.bitmap.data;
        const fgData = fg.bitmap.data;
        const outData = image.bitmap.data;
        const fgW = fg.bitmap.width;
        const fgH = fg.bitmap.height;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const fx = x - blendX;
            const fy = y - blendY;
            if (fx < 0 || fx >= fgW || fy < 0 || fy >= fgH) continue;

            const idx = (y * w + x) * 4;
            const fgIdx = (fy * fgW + fx) * 4;

            const b_r = bgData[idx];
            const b_g = bgData[idx + 1];
            const b_b = bgData[idx + 2];
            const a_r = fgData[fgIdx];
            const a_g = fgData[fgIdx + 1];
            const a_b = fgData[fgIdx + 2];

            let r = this.blendChannel(a_r, b_r);
            let g = this.blendChannel(a_g, b_g);
            let b = this.blendChannel(a_b, b_b);

            outData[idx] = Math.round(b_r + (r - b_r) * opacitySource);
            outData[idx + 1] = Math.round(b_g + (g - b_g) * opacitySource);
            outData[idx + 2] = Math.round(b_b + (b - b_b) * opacitySource);
          }
        }

        this.image = image;
      } else {
        // Jimp built-in blend mode
        let image = this.inputs[0].image.clone();
        image.composite(this.inputs[1].image, blendX, blendY, {
          mode: this.mode,
          opacitySource: opacitySource,
          opacityDest: opacityDest
        });
        this.image = image;
      }

      super.run(inputThatTriggered);

    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  toJson() {
    let json = super.toJson();

    json.settings.blendX = this.blendX;
    json.settings.blendY = this.blendY;
    json.settings.mode = this.mode;
    json.settings.opacitySource = this.opacitySource;
    json.settings.opacityDest = this.opacityDest;

    return json;
  }
}

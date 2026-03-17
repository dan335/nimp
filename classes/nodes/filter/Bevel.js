import NodeImage from '../NodeImage.js';
import BevelProperties from './BevelProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";


export default class Bevel extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Bevel', BevelProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Height Map'),
      new InputNumber(this, 1, 'Strength', 'hasStrength'),
      new InputNumber(this, 2, 'Light Angle', 'hasLightAngle')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.strength = typeof settings.strength !== 'undefined' ? settings.strength : 2;
    this.lightAngle = typeof settings.lightAngle !== 'undefined' ? settings.lightAngle : 45;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let strength = this.strength;
      let lightAngle = this.lightAngle;
      if (this.inputs[1].number != null) strength = this.inputs[1].number;
      if (this.inputs[2].number != null) lightAngle = this.inputs[2].number;
      strength = Math.max(0.01, strength);

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const srcData = src.bitmap.data;
      const image = new Jimp({ width: w, height: h });
      const data = image.bitmap.data;

      // Light direction from angle
      const rad = lightAngle * Math.PI / 180;
      const lx = Math.cos(rad);
      const ly = Math.sin(rad);
      const lz = 0.5;
      const lMag = Math.sqrt(lx*lx + ly*ly + lz*lz);
      const nlx = lx / lMag;
      const nly = ly / lMag;
      const nlz = lz / lMag;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          // Sample heights using Sobel
          const getH = (px, py) => {
            px = Math.max(0, Math.min(w-1, px));
            py = Math.max(0, Math.min(h-1, py));
            const i = (py * w + px) * 4;
            return (srcData[i] + srcData[i+1] + srcData[i+2]) / 3 / 255;
          };

          const tl = getH(x-1, y-1);
          const t  = getH(x,   y-1);
          const tr = getH(x+1, y-1);
          const r  = getH(x+1, y);
          const br = getH(x+1, y+1);
          const b  = getH(x,   y+1);
          const bl = getH(x-1, y+1);
          const l  = getH(x-1, y);

          // Sobel
          let dx = (tr + 2*r + br) - (tl + 2*l + bl);
          let dy = (bl + 2*b + br) - (tl + 2*t + tr);
          let dz = 1 / strength;

          const mag = Math.sqrt(dx*dx + dy*dy + dz*dz);
          dx /= mag; dy /= mag; dz /= mag;

          // Dot with light
          const dot = dx*nlx + dy*nly + dz*nlz;
          const val = Math.max(0, Math.min(255, Math.round(dot * 255)));

          const idx = (y * w + x) * 4;
          data[idx] = val;
          data[idx+1] = val;
          data[idx+2] = val;
          data[idx+3] = 255;
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
    json.settings.strength = this.strength;
    json.settings.lightAngle = this.lightAngle;
    return json;
  }
}

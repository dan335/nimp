import NodeImage from '../NodeImage.js';
import NormalBlendProperties from './NormalBlendProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class NormalBlend extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Normal Blend', NormalBlendProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Normal A'),
      new InputImage(this, 1, 'Normal B'),
      new InputNumber(this, 2, 'Strength', 'hasStrength')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.strength = typeof settings.strength !== 'undefined' ? settings.strength : 1;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image && this.inputs[1].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let strength = this.strength;
      if (this.inputs[2].number != null) strength = this.inputs[2].number;

      const imgA = this.inputs[0].image;
      const imgB = this.inputs[1].image;
      const w = imgA.bitmap.width;
      const h = imgA.bitmap.height;
      const image = imgA.clone();
      const dataA = imgA.bitmap.data;
      const dataB = imgB.bitmap.data;
      const data = image.bitmap.data;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const bIdx = (y * Math.min(w, imgB.bitmap.width) + Math.min(x, imgB.bitmap.width - 1)) * 4;
          // Decode normals from [0,255] to [-1,1]
          const ax = dataA[idx] / 255 * 2 - 1;
          const ay = dataA[idx+1] / 255 * 2 - 1;
          const az = dataA[idx+2] / 255 * 2 - 1;
          const bx = (dataB[bIdx] / 255 * 2 - 1) * strength;
          const by = (dataB[bIdx+1] / 255 * 2 - 1) * strength;
          const bz = dataB[bIdx+2] / 255 * 2 - 1;
          // Whiteout blend: add XY, multiply Z
          let rx = ax + bx;
          let ry = ay + by;
          let rz = az * bz;
          // Normalize
          const mag = Math.sqrt(rx*rx + ry*ry + rz*rz) || 1;
          rx /= mag; ry /= mag; rz /= mag;
          // Encode back to [0,255]
          data[idx] = Math.round((rx + 1) / 2 * 255);
          data[idx+1] = Math.round((ry + 1) / 2 * 255);
          data[idx+2] = Math.round((rz + 1) / 2 * 255);
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
    return json;
  }
}

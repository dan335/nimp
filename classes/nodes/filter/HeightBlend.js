import NodeImage from '../NodeImage.js';
import HeightBlendProperties from './HeightBlendProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class HeightBlend extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Height Blend', HeightBlendProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Image A'),
      new InputImage(this, 1, 'Image B'),
      new InputImage(this, 2, 'Height A'),
      new InputImage(this, 3, 'Height B'),
      new InputNumber(this, 4, 'Blend', 'hasBlend'),
      new InputNumber(this, 5, 'Contrast', 'hasContrast')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.blend = typeof settings.blend !== 'undefined' ? settings.blend : 0.5;
    this.contrast = typeof settings.contrast !== 'undefined' ? settings.contrast : 4;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image && this.inputs[1].image && this.inputs[2].image && this.inputs[3].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let blend = this.blend;
      let contrast = this.contrast;
      if (this.inputs[4].number != null) blend = this.inputs[4].number;
      if (this.inputs[5].number != null) contrast = this.inputs[5].number;

      const imgA = this.inputs[0].image;
      const imgB = this.inputs[1].image;
      const heightA = this.inputs[2].image;
      const heightB = this.inputs[3].image;
      const w = imgA.bitmap.width;
      const h = imgA.bitmap.height;
      const image = imgA.clone();
      const dataA = imgA.bitmap.data;
      const dataB = imgB.bitmap.data;
      const dataHA = heightA.bitmap.data;
      const dataHB = heightB.bitmap.data;
      const data = image.bitmap.data;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          // Get height values as grayscale
          const ha = (dataHA[idx] + dataHA[idx+1] + dataHA[idx+2]) / 3 / 255;
          const hb = (dataHB[idx] + dataHB[idx+1] + dataHB[idx+2]) / 3 / 255;
          // Weight by blend factor
          let wa = ha + (1 - blend);
          let wb = hb + blend;
          // Apply contrast
          wa = Math.pow(wa, contrast);
          wb = Math.pow(wb, contrast);
          // Normalize
          const total = wa + wb || 1;
          wa /= total;
          wb /= total;
          // Blend colors
          data[idx] = Math.round(dataA[idx] * wa + dataB[idx] * wb);
          data[idx+1] = Math.round(dataA[idx+1] * wa + dataB[idx+1] * wb);
          data[idx+2] = Math.round(dataA[idx+2] * wa + dataB[idx+2] * wb);
          data[idx+3] = Math.round(dataA[idx+3] * wa + dataB[idx+3] * wb);
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
    json.settings.blend = this.blend;
    json.settings.contrast = this.contrast;
    return json;
  }
}

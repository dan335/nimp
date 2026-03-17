import NodeImage from '../NodeImage.js';
import HistogramEqualizeProperties from './HistogramEqualizeProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';


export default class HistogramEqualize extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Histogram Equalize', HistogramEqualizeProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const srcData = src.bitmap.data;
      const image = src.clone();
      const data = image.bitmap.data;
      const totalPixels = w * h;

      // Build histogram per channel
      const histR = new Array(256).fill(0);
      const histG = new Array(256).fill(0);
      const histB = new Array(256).fill(0);

      for (let i = 0; i < srcData.length; i += 4) {
        histR[srcData[i]]++;
        histG[srcData[i + 1]]++;
        histB[srcData[i + 2]]++;
      }

      // Build CDF per channel
      const cdfR = new Array(256);
      const cdfG = new Array(256);
      const cdfB = new Array(256);

      cdfR[0] = histR[0];
      cdfG[0] = histG[0];
      cdfB[0] = histB[0];

      for (let i = 1; i < 256; i++) {
        cdfR[i] = cdfR[i - 1] + histR[i];
        cdfG[i] = cdfG[i - 1] + histG[i];
        cdfB[i] = cdfB[i - 1] + histB[i];
      }

      // Normalize CDF to 0-255
      for (let i = 0; i < 256; i++) {
        cdfR[i] = Math.round(cdfR[i] * 255 / totalPixels);
        cdfG[i] = Math.round(cdfG[i] * 255 / totalPixels);
        cdfB[i] = Math.round(cdfB[i] * 255 / totalPixels);
      }

      // Remap each pixel
      for (let i = 0; i < data.length; i += 4) {
        data[i] = cdfR[srcData[i]];
        data[i + 1] = cdfG[srcData[i + 1]];
        data[i + 2] = cdfB[srcData[i + 2]];
        data[i + 3] = srcData[i + 3];
      }

      this.image = image;
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }
}

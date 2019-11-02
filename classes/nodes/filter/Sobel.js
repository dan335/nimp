import NodeImage from '../NodeImage.js';
import SobelProperties from './SobelProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';

export default class Sobel extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Sobel', SobelProperties, settings);

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

      if (this.isInsideALoop) {
        this.image = this.heightToNormal(this.inputs[0].image.clone());
        super.run(inputThatTriggered);
      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          this.image = this.heightToNormal(image);
          super.run(inputThatTriggered);
        })
      }

    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  intensity(image, row, column) {
    const index = image.getPixelIndex(this.clamp(column, image.bitmap.width), this.clamp(row, image.bitmap.height));
    const average = (image.bitmap.data[index] + image.bitmap.data[index+1] + image.bitmap.data[index+2]) / 3;
    return average / 255;
  }


  clamp(px, pMax) {
    if (px > pMax) {
      return pMax;
    } else if (px < 0) {
      return 0;
    } else {
      return px;
    }
  }


  mapComponent(px) {
    return (px + 1) * (255 / 2);
  }


  heightToNormal(image, pStrength = 2) {

    // copy dadta
    let data = [...image.bitmap.data];

    for (let row = 0; row < image.bitmap.height; row++) {
      for (let column = 0; column < image.bitmap.width; column++) {
        const tl = this.intensity(image, row-1, column-1);
        const t = this.intensity(image, row-1, column);
        const tr = this.intensity(image, row-1, column+1);
        const r = this.intensity(image, row, column+1);
        const br = this.intensity(image, row+1, column+1);
        const b = this.intensity(image, row+1, column);
        const bl = this.intensity(image, row+1, column-1);
        const l = this.intensity(image, row, column-1);

        // sobel filter
        let dx = (tr + 2 * r + br) - (tl + 2 * l + bl);
        let dy = (bl + 2 * b + br) - (tl + 2 * t + tr);
        let dz = 1 / pStrength;

        // // normalize vector
        let magnitude = Math.sqrt(dx * dx + dy * dy);
        magnitude = Math.min(1, Math.max(0, magnitude));

        const index = image.getPixelIndex(column, row);
        data[index] = magnitude * 255;
        data[index+1] = magnitude * 255;
        data[index+2] = magnitude * 255;
      }
    }

    image.bitmap.data = data;
    return image;
  }
}

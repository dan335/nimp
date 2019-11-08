import NodeImage from '../NodeImage.js';
import NormalMapProperties from './NormalMapProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';

// https://stackoverflow.com/questions/2368728/can-normal-maps-be-generated-from-a-texture/2368794#2368794


export default class NormalMap extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Normal Map', NormalMapProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Height Input'),
      new InputNumber(this, 1, 'Strength', 'hasStrength')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.strength = typeof settings.strength !== 'undefined' ? settings.strength : 2;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      let strength = this.strength;

      if (this.inputs[1].number != null) {
        strength = this.inputs[1].number;
      }

      this.bg.classList.add('running');
      this.runTimer = Date.now();

      if (this.isInsideALoop) {
        this.image = this.heightToNormal(this.inputs[0].image.clone(), strength);
        super.run(inputThatTriggered);
      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          this.image = this.heightToNormal(image, strength);
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

        // normalize vector
        const magnitude = Math.sqrt(dx * dx + dy * dy + dz * dz);
        dx = dx / magnitude;
        dy = dy / magnitude;
        dz = dz / magnitude;

        // convert to rgb
        const red = this.mapComponent(dx);
        const green = this.mapComponent(dy);
        const blue = this.mapComponent(dz);

        const index = image.getPixelIndex(column, row);
        data[index] = red;
        data[index+1] = green;
        data[index+2] = blue;
      }
    }

    image.bitmap.data = data;
    return image;
  }
}

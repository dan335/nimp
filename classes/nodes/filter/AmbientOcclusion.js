// https://www.gamedev.net/articles/programming/graphics/a-simple-and-practical-approach-to-ssao-r2753/
// 1.5707963267948966 = 90 degrees in radians
// occlusion = Math.max(0, (1.5707963267948966 - Math.atan(h, w))) * (1 / (1 + distance))

import NodeImage from '../NodeImage.js';
import AmbientOcclusionProperties from './AmbientOcclusionProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class AmbientOcclusion extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Ambient Occlusion', AmbientOcclusionProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Height Map'),
      new InputNumber(this, 1, 'Radius', 'hasRadius')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.radius = typeof settings.radius !== 'undefined' ? settings.radius : 3;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      let radius = this.radius;

      if (this.inputs[1].number != null) {
        radius = this.inputs[1].number;
      }

      this.bg.classList.add('running');
      this.runTimer = Date.now();

      if (this.isInsideALoop) {
        this.image = this.applyFilter(this.inputs[0].image.clone(), radius);
        super.run(inputThatTriggered);
      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          this.image = this.applyFilter(image, radius);
          super.run(inputThatTriggered);
        })
      }

    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  applyFilter(image, radius) {

    // copy data
    let data = [...image.bitmap.data];
    const area = Math.PI * radius * radius;
    const maxOcclusion = 1.5707963267948966 * area * 0.00028;

    for (let x = 0; x < image.bitmap.width; x++) {
      for (let y = 0; y < image.bitmap.height; y++) {
        const height = this.height(image, x, y);
        const index = image.getPixelIndex(x, y);
        let occlusion = 0;

        for (let px = Math.max(0, x - radius); px < Math.min(image.bitmap.width, x + radius); px++) {
          for (let py = Math.max(0, y - radius); py < Math.min(image.bitmap.height, y + radius); py++) {
            if (!(x == px && y == py)) {
              const distance = this.distance(x, y, px, py);
              if (distance <= radius) {
                const heightDiff = this.height(image, px, py) - height;
                if (heightDiff > 0) {
                  occlusion += (Math.atan(heightDiff, distance)) * (1 / (1 + distance));
                }
              }
            }
          }
        }

        data[index] = Math.round(255 - occlusion / maxOcclusion);
        data[index+1] = Math.round(255 - occlusion / maxOcclusion);
        data[index+2] = Math.round(255 - occlusion / maxOcclusion);
      }
    }

    image.bitmap.data = data;
    return image;
  }


  height(image, x, y) {
    const index = image.getPixelIndex(x, y);
    return (image.bitmap.data[index] + image.bitmap.data[index+1] + image.bitmap.data[index+2]) / 3 / 255;
  }


  distance(x1, y1, x2, y2) {
    const a = x1 - x2;
    const b = y1 - y2;
    return Math.sqrt(a*a + b*b);
  }
}

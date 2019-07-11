import NodeImage from '../NodeImage.js';
import BrightnessContrastProperties from './BrightnessContrastProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';

export default class BrightnessContrast extends NodeImage {
  constructor(graph, x, y) {
    super(graph, x, y, 'Brightness/Contrast', BrightnessContrastProperties);

    this.inputs = [
      new InputImage(this, 0, 'Input')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.brightness = 0;
    this.contrast = 0;
  }


  run() {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();
      Jimp.read(this.inputs[0].image).then(image => {
        image.brightness(this.brightness, (error, image) => {
          image.contrast(this.contrast, (error, image) => {
            this.image = image;
            super.run();
          });
        });
      })
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run();
    }
  }
}

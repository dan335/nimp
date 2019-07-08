import Node from '../Node.js';
import BrightnessContrastProperties from './BrightnessContrastProperties.jsx';
import BrightnessContrastNodeOutput from './BrightnessContrastNodeOutput.js';
import BrightnessContrastNodeInput from './BrightnessContrastNodeInput.js';

export default class BrightnessContrast extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'brightnesscontrast', 'Brightness/Contrast', BrightnessContrastProperties);

    this.inputs = [
      new BrightnessContrastNodeInput(this, 0)
    ];
    this.outputs = [
      new BrightnessContrastNodeOutput(this, 0)
    ];

    this.brightness = 0;
    this.contrast = 0;
  }


  run() {
    if (this.inputs[0].image) {
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

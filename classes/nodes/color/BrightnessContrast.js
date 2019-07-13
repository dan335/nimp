import NodeImage from '../NodeImage.js';
import BrightnessContrastProperties from './BrightnessContrastProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import BrightnessContrastInputNumberBrightness from './BrightnessContrastInputNumberBrightness.js';
import BrightnessContrastInputNumberContrast from './BrightnessContrastInputNumberContrast.js';

export default class BrightnessContrast extends NodeImage {
  constructor(graph, x, y) {
    super(graph, x, y, 'Brightness/Contrast', BrightnessContrastProperties);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new BrightnessContrastInputNumberBrightness(this, 1, 'Brightness'),
      new BrightnessContrastInputNumberContrast(this, 2, 'Contrast')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.brightness = 0;
    this.contrast = 0;
  }


  toJson() {
    let json = super.toJson();

    json.settings.brightness = this.brightness;
    json.settings.contrast = this.contrast;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let brightness = this.brightness;
      let contrast = this.contrast;

      if (this.inputs[1].number != null) {
        brightness = this.inputs[1].number;
      }

      if (this.inputs[2].number != null) {
        contrast = this.inputs[2].number;
      }

      brightness = Math.max(-1, brightness);
      brightness = Math.min(1, brightness);

      contrast = Math.max(-1, contrast);
      contrast = Math.min(1, contrast);

      if (this.isInsideALoop) {
        let image = this.inputs[0].image.clone();
        image.brightness(brightness);
        image.contrast(contrast);
        this.image = image;
        super.run(inputThatTriggered);

      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          image.brightness(brightness, (error, image) => {
            if (error) {
              console.log(error);
            } else {
              image.contrast(contrast, (error, image) => {
                if (error) {
                  console.log(error);
                } else {
                  this.image = image;
                  super.run(inputThatTriggered);
                }
              });
            }
          });
        })
      }

    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }
}

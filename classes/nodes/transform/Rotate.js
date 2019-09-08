import NodeImage from '../NodeImage.js';
import RotateProperties from './RotateProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputColor from '../InputColor.js';
import InputNumber from '../InputNumber.js';


export default class Rotate extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Rotate', RotateProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Degrees', 'hasDegreesInput'),
      new InputColor(this, 2, 'Background')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.degrees = typeof settings.degrees !== 'undefined' ? settings.degrees : 90;
    this.resize = typeof settings.resize !== 'undefined' ? settings.resize : true;
    this.mode = typeof settings.mode !== 'undefined' ? settings.mode : Jimp.RESIZE_BICUBIC;
  }


  toJson() {
    let json = super.toJson();

    json.settings.degrees = this.degrees;
    json.settings.resize = this.resize;
    json.settings.mode = this.mode;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let degrees = this.degrees;
      let resize = this.resize;

      if (this.inputs[1].number != null) {
        degrees = this.inputs[1].number;
      }

      if (resize) {
        resize = this.mode;
      }

      let background = null;

      if (this.inputs[2].color) {
        background = parseInt(this.inputs[2].color.toHex8(), 16);
      }

      if (this.isInsideALoop) {
        let image = this.inputs[0].image.clone();
        if (background) {
          image.background(background);
        }
        image.rotate(degrees, resize);
        this.image = image;
        super.run(inputThatTriggered);

      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          if (background) {
            image.background(background);
          }
          image.rotate(degrees, resize, (error, image) => {
            if (error) {
              console.log(error);
            } else {
              this.image = image;
              super.run(inputThatTriggered);
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

import NodeImage from '../NodeImage.js';
import PixelateProperties from './PixelateProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumberSize from '../inputs/InputNumberSize.js';
import InputNumberX from '../inputs/InputNumberX.js';
import InputNumberY from '../inputs/InputNumberY.js';
import InputNumberWidth from '../inputs/InputNumberWidth.js';
import InputNumberHeight from '../inputs/InputNumberHeight.js';

export default class Pixelate extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Pixelate', PixelateProperties);

    this.inputs = [
      new InputImage(this, 0, 'Dest'),
      new InputNumberSize(this, 1, 'Size'),
      new InputNumberX(this, 2, 'X'),
      new InputNumberY(this, 3, 'Y'),
      new InputNumberWidth(this, 4, 'Width'),
      new InputNumberHeight(this, 5, 'Height'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.size = typeof settings.size !== 'undefined' ? settings.size : 20;
    this.valueX = typeof settings.valueX !== 'undefined' ? settings.valueX : 0;
    this.valueY = typeof settings.valueY !== 'undefined' ? settings.valueY : 0;
    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let size = this.size;
      let valueX = this.valueX;
      let valueY = this.valueY;
      let width = this.width;
      let height = this.height;

      if (this.inputs[1].number != null) {
        size = this.inputs[1].number;
      }

      if (this.inputs[2].number != null) {
        valueX = this.inputs[2].number;
      }

      if (this.inputs[3].number != null) {
        valueY = this.inputs[3].number;
      }

      if (this.inputs[4].number != null) {
        width = this.inputs[4].number;
      }

      if (this.inputs[5].number != null) {
        height = this.inputs[5].number;
      }

      if (this.isInsideALoop) {
        let image = this.inputs[0].image.clone();
        image.pixelate(size, valueX, valueY, width, height);
        this.image = image;
        super.run(inputThatTriggered);
      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          image.pixelate(size, valueX, valueY, width, height, (error, image) => {
            if (error) {
              console.log(error);
            } else {
              this.image = image;
              super.run(inputThatTriggered);
            }
          })
        })
      }

    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  toJson() {
    let json = super.toJson();

    json.settings.size = this.size;
    json.settings.valueX = this.valueX;
    json.settings.valueY = this.valueY;
    json.settings.width = this.width;
    json.settings.height = this.height;

    return json;
  }
}

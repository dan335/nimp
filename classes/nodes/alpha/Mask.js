import NodeImage from '../NodeImage.js';
import MaskProperties from './MaskProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';

export default class Mask extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Mask', MaskProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputImage(this, 1, 'Mask'),
      new InputNumber(this, 2, 'X', 'hasXInput'),
      new InputNumber(this, 3, 'Y', 'hasYInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.maskX = typeof settings.maskX !== 'undefined' ? settings.maskX : 0;
    this.maskY = typeof settings.maskY !== 'undefined' ? settings.maskY : 0;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image && this.inputs[1].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let maskX = this.maskX;
      let maskY = this.maskY;

      if (this.inputs[2].number != null) {
        maskX = this.inputs[2].number;
      }

      if (this.inputs[3].number != null) {
        maskY = this.inputs[3].number;
      }

      if (this.isInsideALoop) {
        let image = this.inputs[0].image.clone();
        image.mask(this.inputs[1].image, maskX, maskY);
        this.image = image;
        super.run(inputThatTriggered);
      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          image.mask(this.inputs[1].image, maskX, maskY, (error, image) => {
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

    json.settings.maskX = this.maskX;
    json.settings.maskY = this.maskY;

    return json;
  }
}

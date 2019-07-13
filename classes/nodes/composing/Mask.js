import NodeImage from '../NodeImage.js';
import MaskProperties from './MaskProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import MaskInputNumberX from './MaskInputNumberX.js';
import MaskInputNumberY from './MaskInputNumberY.js';

export default class Mask extends NodeImage {
  constructor(graph, x, y) {
    super(graph, x, y, 'Mask', MaskProperties);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputImage(this, 1, 'Mask'),
      new MaskInputNumberX(this, 2, 'X'),
      new MaskInputNumberY(this, 3, 'Y'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.maskX = 0;
    this.maskY = 0;
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
}

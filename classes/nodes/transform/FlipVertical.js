import NodeImage from '../NodeImage.js';
import FlipVerticalProperties from './FlipVerticalProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';

export default class FlipVertical extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Flip Vertically', FlipVerticalProperties);

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
        const image = this.inputs[0].image.clone();
        image.flip(false, true);
        this.image = image;
        super.run(inputThatTriggered);
      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          image.flip(false, true, (error, image) => {
            this.image = image;
            super.run(inputThatTriggered);
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

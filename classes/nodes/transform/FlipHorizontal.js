import NodeImage from '../NodeImage.js';
import FlipHorizontalProperties from './FlipHorizontalProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';

export default class FlipHorizontal extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Flip Horizontally', FlipHorizontalProperties);

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
        image.flip(true, false);
        this.image = image;
        super.run(inputThatTriggered);
      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          image.flip(true, false, (error, image) => {
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

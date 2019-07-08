import Node from '../Node.js';
import BlurProperties from './BlurProperties.jsx';
import BlurNodeOutput from './BlurNodeOutput.js';
import BlurNodeInput from './BlurNodeInput.js';

export default class Blur extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'blur', 'Blur', BlurProperties);

    this.inputs = [
      new BlurNodeInput(this, 0)
    ];
    this.outputs = [
      new BlurNodeOutput(this, 0)
    ];

    this.radius = 10;
  }


  run() {
    if (this.inputs[0].image) {
      this.runTimer = Date.now();
      Jimp.read(this.inputs[0].image).then(image => {
        image.blur(this.radius, (error, image) => {
          this.image = image;
          super.run();
        });
      })
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run();
    }
  }
}

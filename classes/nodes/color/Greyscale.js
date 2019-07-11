import Node from '../Node.js';
import GreyscaleProperties from './GreyscaleProperties.jsx';
import NodeOutput from '../NodeOutput.js';
import NodeInput from '../NodeInput.js';

export default class Greyscale extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'Greyscale', GreyscaleProperties);

    this.inputs = [
      new NodeInput(this, 0, 'Input')
    ];
    this.outputs = [
      new NodeOutput(this, 0, 'Output')
    ];
  }


  run() {
    if (this.inputs[0].image) {
      this.runTimer = Date.now();
      Jimp.read(this.inputs[0].image).then(image => {
        image.greyscale((error, image) => {
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

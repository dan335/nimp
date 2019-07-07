import Node from '../Node.js';
import GreyscaleProperties from './GreyscaleProperties.jsx';
import GreyscaleNodeOutput from './GreyscaleNodeOutput.js';
import GreyscaleNodeInput from './GreyscaleNodeInput.js';

export default class Greyscale extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'greyscale', 'Greyscale', GreyscaleProperties);

    this.inputs = [
      new GreyscaleNodeInput(this, 0)
    ];
    this.outputs = [
      new GreyscaleNodeOutput(this, 0)
    ];
  }


  run() {
    if (this.inputs[0].image) {
      this.runTimer = Date.now();
      Jimp.read(this.inputs[0].image).then(image => {
        image.greyscale();
        this.image = image;
        super.run();
      })
    }
  }
}

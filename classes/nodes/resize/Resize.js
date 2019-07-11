import Node from '../Node.js';
import ResizeProperties from './ResizeProperties.jsx';
import NodeOutput from '../NodeOutput.js';
import NodeInput from '../NodeInput.js';

export default class Resize extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'Resize', ResizeProperties);

    this.inputs = [
      new NodeInput(this, 0, 'Input')
    ];
    this.outputs = [
      new NodeOutput(this, 0, 'Output')
    ];

    this.resizeX = 256;
    this.resizeY = 256;
    this.mode = Jimp.RESIZE_BICUBIC;
  }


  run() {
    if (this.inputs[0].image) {
      this.runTimer = Date.now();
      Jimp.read(this.inputs[0].image).then(image => {
        image.resize(this.resizeX, this.resizeY, this.mode, (error, image) => {
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

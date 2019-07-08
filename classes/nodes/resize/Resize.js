import Node from '../Node.js';
import ResizeProperties from './ResizeProperties.jsx';
import ResizeNodeOutput from './ResizeNodeOutput.js';
import ResizeNodeInput from './ResizeNodeInput.js';

export default class Resize extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'resize', 'Resize', ResizeProperties);

    this.inputs = [
      new ResizeNodeInput(this, 0)
    ];
    this.outputs = [
      new ResizeNodeOutput(this, 0)
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

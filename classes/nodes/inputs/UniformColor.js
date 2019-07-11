import Node from '../Node.js';
import UniformColorProperties from './UniformColorProperties.jsx';
import NodeOutput from '../NodeOutput.js';
import Jimp from 'jimp';


export default class UniformColor extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'Uniform Color', UniformColorProperties);

    this.inputs = [];
    this.outputs = [
      new NodeOutput(this, 0)
    ];

    this.width = 256;
    this.height = 256;
    this.red = 255;
    this.blue = 255;
    this.green = 255;
    this.alpha = 255;

    this.run();
  }


  run() {
    this.runTimer = Date.now();

    const hexNum = Jimp.rgbaToInt(this.red, this.green, this.blue, this.alpha);

    new Jimp(this.width, this.height, hexNum, (error, image) => {
      if (error) {
        console.log(error);
      } else {
        this.image = image;
        super.run();
      }
    })
  }
}

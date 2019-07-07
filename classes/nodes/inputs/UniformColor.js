import Node from '../Node.js';
import UniformColorProperties from './UniformColorProperties.jsx';
import UniformColorNodeOutput from './UniformColorNodeOutput.js';
import Jimp from 'jimp';
const Buffer = require('buffer').Buffer;
const Jpeg = require('jpeg-js');


export default class UniformColor extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'uniformcolor', 'Uniform Color', UniformColorProperties);

    this.inputs = [];
    this.outputs = [
      new UniformColorNodeOutput(this, 0)
    ];

    this.width = 256;
    this.height = 256;
    this.red = 0xFF;
    this.blue = 0xFF;
    this.green = 0xFF;
    this.alpha = 0xFF;

    this.run();
  }


  run() {
    this.runTimer = Date.now();
    let buffer = new Buffer(this.width * this.height * 4);

    let i = 0;
    while (i < buffer.length) {
      buffer[i++] = this.red;
      buffer[i++] = this.green;
      buffer[i++] = this.blue;
      buffer[i++] = this.alpha;
    }

    var jpegImageData = Jpeg.encode({data:buffer, width:this.width, height:this.height}, 90);

    Jimp.read(jpegImageData.data).then(image => {
      this.image = image;
      super.run();
    }).catch(error => {
      console.log(error);
    })
  }
}

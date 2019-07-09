import Node from '../Node.js';
import ImageUploadProperties from './ImageUploadProperties.jsx';
import ImageUploadNodeOutput from './ImageUploadNodeOutput.js';

export default class ImageUpload extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'imageupload', 'ImageUpload', ImageUploadProperties);

    this.inputs = [];
    this.outputs = [
      new ImageUploadNodeOutput(this, 0)
    ];

    this.base64 = null;
  }


  run() {
    if (this.base64) {
      this.runTimer = Date.now();
      Jimp.read(this.base64).then(image => {
        this.image = image;
        super.run();
      })
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run();
    }
  }
}

import NodeImage from '../NodeImage.js';
import ImageUploadProperties from './ImageUploadProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';

export default class ImageUpload extends NodeImage {
  constructor(graph, x, y) {
    super(graph, x, y, 'ImageUpload', ImageUploadProperties);

    this.inputs = [];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height')
    ];

    this.base64 = null;
  }


  run(inputThatTriggered) {
    if (this.base64) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();
      Jimp.read(this.base64).then(image => {
        this.image = image;
        super.run(inputThatTriggered);
      })
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  passToChildren() {
    if (this.image) {
      this.outputs[1].connections.forEach(conn => {
        conn.number = this.image.bitmap.width;
        conn.runNode();
      })
      this.outputs[2].connections.forEach(conn => {
        conn.number = this.image.bitmap.height;
        conn.runNode();
      })
    }

    super.passToChildren();
  }
}

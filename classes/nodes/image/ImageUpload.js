import NodeImage from '../NodeImage.js';
import ImageUploadProperties from './ImageUploadProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';

export default class ImageUpload extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'ImageUpload', ImageUploadProperties, settings);

    this.inputs = [];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height')
    ];

    this.base64 = typeof settings.base64 !== 'undefined' ? settings.base64 : null;
  }


  toJson() {
    let json = super.toJson();

    json.settings.base64 = null;

    return json;
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

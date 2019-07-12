import NodeImage from '../NodeImage.js';
import OpaqueProperties from './OpaqueProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';

export default class Opaque extends NodeImage {
  constructor(graph, x, y) {
    super(graph, x, y, 'Opaque', OpaqueProperties);

    this.inputs = [
      new InputImage(this, 0, 'Input')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];
  }


  run() {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();
      Jimp.read(this.inputs[0].image).then(image => {
        image.opaque((error, image) => {
          if (error) {
            console.log(error);
          } else {
            this.image = image;
            super.run();
          }
        });
      })
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run();
    }
  }
}

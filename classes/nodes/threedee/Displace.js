import NodeImage from '../NodeImage.js';
import DisplaceProperties from './DisplaceProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import DisplaceInputNumberOffset from './DisplaceInputNumberOffset.js';

export default class Displace extends NodeImage {
  constructor(graph, x, y) {
    super(graph, x, y, 'Displace', DisplaceProperties);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputImage(this, 1, 'Map'),
      new DisplaceInputNumberOffset(this, 2, 'Offset')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.offset = 20;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image && this.inputs[1].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let offset = this.offset;

      if (this.inputs[2].number != null) {
        offset = this.inputs[2].number;
      }

      Jimp.read(this.inputs[0].image).then(image => {
        image.displace(this.inputs[1].image, offset, (error, image) => {
          if (error) {
            console.log(error);
          } else {
            this.image = image;
            super.run(inputThatTriggered);
          }
        })
      })
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }
}

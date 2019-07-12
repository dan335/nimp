import NodeImage from '../NodeImage.js';
import BlurProperties from './BlurProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import BlurInputNumberRadius from './BlurInputNumberRadius.js';


export default class Blur extends NodeImage {
  constructor(graph, x, y) {
    super(graph, x, y, 'Blur', BlurProperties);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new BlurInputNumberRadius(this, 1, 'Radius')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.radius = 10;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();
      Jimp.read(this.inputs[0].image).then(image => {
        let radius = this.radius;

        if (this.inputs[1].number != null) {
          radius = this.inputs[1].number;
        }

        radius = Math.max(1, radius);

        image.blur(radius, (error, image) => {
          if (error) {
            console.log(error);
          } else {
            this.image = image;
            super.run(inputThatTriggered);
          }
        });
      })
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }
}

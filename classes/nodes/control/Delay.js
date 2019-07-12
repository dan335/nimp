import NodeImage from '../NodeImage.js';
import DelayProperties from './DelayProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import DelayInputNumberReset from './DelayInputNumberReset.js';


export default class Delay extends NodeImage {
  constructor(graph, x, y) {
    super(graph, x, y, 'Delay', DelayProperties);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new DelayInputNumberReset(this, 1, 'Reset')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.delayNum = 2;
    this.n = 0;
  }


  run(inputThatTriggered) {
    if (inputThatTriggered instanceof DelayInputNumberReset) {
      // reset
      this.n = 0;

    } else {
      this.n++;

      if (this.n >= this.delayNum) {

        this.n = 0;

        if (this.inputs[0].image) {
          this.bg.classList.add('running');
          this.runTimer = Date.now();
          Jimp.read(this.inputs[0].image).then(image => {
            this.image = image;
            super.run(inputThatTriggered);
          })
        } else {
          this.runTimer = Date.now();
          this.image = null;
          super.run(inputThatTriggered);
        }
      }
    }
  }
}

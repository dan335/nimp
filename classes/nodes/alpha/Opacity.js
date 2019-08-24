import NodeImage from '../NodeImage.js';
import OpacityProperties from './OpacityProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumberAmount from '../inputs/InputNumberAmount.js';


export default class Opacity extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Opacity', OpacityProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumberAmount(this, 1, 'Amount')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.amount = typeof settings.amount !== 'undefined' ? settings.amount : 0.5;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let amount = this.amount;

      if (this.inputs[1].number != null) {
        amount = this.inputs[1].number;
      }

      amount = Math.min(1, Math.max(0, amount));

      if (this.isInsideALoop) {
        let image = this.inputs[0].image.clone();
        image.opacity(amount);
        this.image = image;
        super.run(inputThatTriggered);

      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          image.opacity(amount, (error, image) => {
            if (error) {
              console.log(error);
            } else {
              this.image = image;
              super.run(inputThatTriggered);
            }
          });
        })
      }
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  toJson() {
    let json = super.toJson();

    json.settings.amount = this.amount;

    return json;
  }
}

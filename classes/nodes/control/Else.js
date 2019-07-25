import NodeImage from '../NodeImage.js';
import ElseProperties from './ElseProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import ElseInputNumberA from './ElseInputNumberA.js';


export default class Else extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Image If Else', ElseProperties);

    this.inputs = [
      new InputImage(this, 0, 'Input A'),
      new InputImage(this, 1, 'Input B'),
      new ElseInputNumberA(this, 2, 'Test')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.a = typeof settings.a !== 'undefined' ? settings.a : 1;
  }


  toJson() {
    let json = super.toJson();

    json.settings.a = this.a;

    return json;
  }


  run(inputThatTriggered) {
    let a = this.a;

    if (this.inputs[2].number != null) {
      a = this.inputs[2].number;
    }

    if (this.inputs[0].image && this.inputs[1].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      if (this.isInsideALoop) {
        let image = null;
        if (a) {
          if (this.inputs[0].image) {
            image = this.inputs[0].image.clone();
          }
        } else {
          if (this.inputs[1].image) {
            image = this.inputs[1].image.clone();
          }
        }

        this.image = image;
        super.run(inputThatTriggered);

      } else {
        if (a) {
          Jimp.read(this.inputs[0].image).then(image => {
            this.image = image;
            super.run(inputThatTriggered);
          })
        } else {
          Jimp.read(this.inputs[1].image).then(image => {
            this.image = image;
            super.run(inputThatTriggered);
          })
        }

      }
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }
}

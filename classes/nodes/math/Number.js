import NodeNumber from '../NodeNumber.js';
import NumberProperties from './NumberProperties.jsx';
import OutputNumber from '../OutputNumber.js';

export default class Number extends NodeNumber {
  constructor(graph, x, y) {
    super(graph, x, y, 'Number', NumberProperties);

    this.inputs = [];
    this.outputs = [
      new OutputNumber(this, 0, 'Output')
    ];
  }


  run() {
    if (this.base64) {
      this.bg.classList.add('running');
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

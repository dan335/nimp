import Node from '../Node.js';
import OutputProperties from './OutputProperties.jsx';
import NodeInput from '../NodeInput.js';
import Jimp from 'jimp';



export default class Output extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'Output', OutputProperties);

    this.inputs = [
      new NodeInput(this, 0)
    ];
    this.outputs = [];

    this.type = Jimp.MIME_JPEG;
    this.base64 = null;
    this.component = null;
    this.filename = 'NimpDownload';
  }


  setComponent(component) {
    this.component = component;
  }


  updateComponentWithBase64() {
    if (this.component) {
      this.component.setState({base64:this.base64});
    }
  }


  run() {
    if (this.inputs[0].image) {
      this.runTimer = Date.now();
      this.image = this.inputs[0].image;
      this.inputs[0].image.clone().getBase64Async(this.type).then(base64 => {
        this.base64 = base64;
        super.run();
        this.updateComponentWithBase64();
      })
    } else {
      this.runTimer = Date.now();
      this.image = null;
      this.base64 = null;
      this.updateComponentWithBase64();
      super.run();
    }
  }
}

import NodeImage from '../NodeImage.js';
import OutputProperties from './OutputProperties.jsx';
import InputImage from '../InputImage.js';
import Jimp from 'jimp';



export default class Output extends NodeImage {
  constructor(className, graph, x, y) {
    super(className, graph, x, y, 'Output', OutputProperties);

    this.inputs = [
      new InputImage(this, 0, 'Input')
    ];
    this.outputs = [];

    this.type = Jimp.MIME_JPEG;
    this.base64 = null;
    this.component = null;
    this.filename = 'NimpDownload';
  }


  toJson() {
    let json = super.toJson();

    json.type = this.type;
    json.base64 = this.null;
    json.filename = this.filename;

    return json;
  }


  setComponent(component) {
    this.component = component;
  }


  updateComponentWithBase64() {
    if (this.component) {
      this.component.setState({base64:this.base64});
    }
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();
      this.image = this.inputs[0].image;
      this.inputs[0].image.clone().getBase64Async(this.type).then(base64 => {
        this.base64 = base64;
        super.run(inputThatTriggered);
        this.updateComponentWithBase64();
      })
    } else {
      this.runTimer = Date.now();
      this.image = null;
      this.base64 = null;
      this.updateComponentWithBase64();
      super.run(inputThatTriggered);
    }
  }
}

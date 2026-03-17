import NodeImage from '../NodeImage.js';
import ConvolutionCustomProperties from './ConvolutionCustomProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';


export default class ConvolutionCustom extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Custom Convolution', ConvolutionCustomProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.kernelSize = typeof settings.kernelSize !== 'undefined' ? settings.kernelSize : 3;
    this.kernel = typeof settings.kernel !== 'undefined' ? settings.kernel : [0,0,0,0,1,0,0,0,0];
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      const image = this.inputs[0].image.clone();
      const size = this.kernelSize;
      const kernel2d = [];
      for (let i = 0; i < size; i++) {
        kernel2d.push(this.kernel.slice(i * size, (i + 1) * size));
      }
      image.convolution(kernel2d);
      this.image = image;
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  toJson() {
    let json = super.toJson();
    json.settings.kernelSize = this.kernelSize;
    json.settings.kernel = this.kernel;
    return json;
  }
}

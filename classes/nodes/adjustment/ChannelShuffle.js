import NodeImage from '../NodeImage.js';
import ChannelShuffleProperties from './ChannelShuffleProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';


export default class ChannelShuffle extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Channel Shuffle', ChannelShuffleProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.redSource = typeof settings.redSource !== 'undefined' ? settings.redSource : 0;
    this.greenSource = typeof settings.greenSource !== 'undefined' ? settings.greenSource : 1;
    this.blueSource = typeof settings.blueSource !== 'undefined' ? settings.blueSource : 2;
    this.alphaSource = typeof settings.alphaSource !== 'undefined' ? settings.alphaSource : 3;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      const src = this.inputs[0].image;
      const srcData = src.bitmap.data;
      const image = src.clone();
      const outData = image.bitmap.data;

      for (let i = 0; i < srcData.length; i += 4) {
        outData[i] = srcData[i + this.redSource];
        outData[i + 1] = srcData[i + this.greenSource];
        outData[i + 2] = srcData[i + this.blueSource];
        outData[i + 3] = srcData[i + this.alphaSource];
      }

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
    json.settings.redSource = this.redSource;
    json.settings.greenSource = this.greenSource;
    json.settings.blueSource = this.blueSource;
    json.settings.alphaSource = this.alphaSource;
    return json;
  }
}

import NodeImage from '../NodeImage.js';
import PBROutputProperties from './PBROutputProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';


export default class PBROutput extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'PBR Output', PBROutputProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Albedo'),
      new InputImage(this, 1, 'Normal'),
      new InputImage(this, 2, 'Roughness'),
      new InputImage(this, 3, 'Metallic'),
      new InputImage(this, 4, 'AO'),
      new InputImage(this, 5, 'Height')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.activeTab = typeof settings.activeTab !== 'undefined' ? settings.activeTab : 'albedo';
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    const tabMap = {
      'albedo': 0, 'normal': 1, 'roughness': 2,
      'metallic': 3, 'ao': 4, 'height': 5
    };
    const idx = tabMap[this.activeTab] || 0;

    if (this.inputs[idx].image) {
      this.image = this.inputs[idx].image.clone();
    } else if (this.inputs[0].image) {
      this.image = this.inputs[0].image.clone();
    } else {
      this.image = null;
    }
    super.run(inputThatTriggered);
  }


  toJson() {
    let json = super.toJson();
    json.settings.activeTab = this.activeTab;
    return json;
  }
}

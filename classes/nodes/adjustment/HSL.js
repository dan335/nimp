import NodeImage from '../NodeImage.js';
import HSLProperties from './HSLProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import HSLInputNumberHue from './HSLInputNumberHue.js';
import HSLInputNumberSaturation from './HSLInputNumberSaturation.js';
import HSLInputNumberLightness from './HSLInputNumberLightness.js';

export default class HSL extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'HSL', HSLProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new HSLInputNumberHue(this, 1, 'Hue'),
      new HSLInputNumberSaturation(this, 2, 'Saturation'),
      new HSLInputNumberLightness(this, 3, 'Lightness'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.hue = typeof settings.hue !== 'undefined' ? settings.hue : 0;
    this.saturation = typeof settings.saturation !== 'undefined' ? settings.saturation : 0;
    this.lightness = typeof settings.lightness !== 'undefined' ? settings.lightness : 0;
  }


  toJson() {
    let json = super.toJson();

    json.settings.hue = this.hue;
    json.settings.saturation = this.saturation;
    json.settings.lightness = this.lightness;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let hue = this.hue;
      let saturation = this.saturation;
      let lightness = this.lightness;

      if (this.inputs[1].number != null) {
        hue = this.inputs[1].number;
      }

      if (this.inputs[2].number != null) {
        saturation = this.inputs[2].number;
      }

      if (this.inputs[3].number != null) {
        lightness = this.inputs[3].number;
      }

      hue = Math.max(-360, hue);
      hue = Math.min(360, hue);

      saturation = Math.max(-1, saturation);
      saturation = Math.min(1, saturation);

      lightness = Math.max(-1, lightness);
      lightness = Math.min(1, lightness);

      saturation *= 100;
      lightness *= 100;

      let adj = [];

      if (hue != 0) {
        adj.push(
          {apply:'hue', params:[hue]}
        );
      }

      if (saturation < 0) {
        adj.push(
          {apply:'desaturate', params:[saturation * -1]}
        )
      } else if (saturation > 0) {
        adj.push(
          {apply:'saturate', params:[saturation]}
        )
      }

      if (lightness < 0) {
        adj.push(
          {apply:'darken', params:[lightness * -1]}
        )
      } else if (lightness > 0) {
        adj.push(
          {apply:'lighten', params:[lightness]}
        )
      }

      if (this.isInsideALoop) {
        let image = this.inputs[0].image.clone();

        image.color(adj);

        this.image = image;
        super.run(inputThatTriggered);

      } else {
        Jimp.read(this.inputs[0].image).then(async image => {

          await image.color(adj);

          this.image = image;
          super.run(inputThatTriggered);
        })
      }

    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }
}

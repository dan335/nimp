import NodeImage from '../NodeImage.js';
import MultiGradientMapProperties from './MultiGradientMapProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
const tinycolor = require("tinycolor2");


export default class MultiGradientMap extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Multi Gradient Map', MultiGradientMapProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.stops = typeof settings.stops !== 'undefined' ? settings.stops : [
      { position: 0, color: '#000000' },
      { position: 0.5, color: '#ff8800' },
      { position: 1, color: '#ffffff' },
    ];
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      // Sort stops by position
      const stops = this.stops.slice().sort((a, b) => a.position - b.position);

      // Parse colors
      const parsedStops = stops.map(s => {
        const c = tinycolor(s.color);
        return { position: s.position, rgb: c.isValid() ? c.toRgb() : { r: 0, g: 0, b: 0 } };
      });

      if (parsedStops.length === 0) {
        parsedStops.push({ position: 0, rgb: { r: 0, g: 0, b: 0 } });
        parsedStops.push({ position: 1, rgb: { r: 255, g: 255, b: 255 } });
      }

      if (parsedStops.length === 1) {
        parsedStops.push({ position: 1, rgb: parsedStops[0].rgb });
      }

      // Build LUT for performance
      const lutR = new Uint8Array(256);
      const lutG = new Uint8Array(256);
      const lutB = new Uint8Array(256);

      for (let i = 0; i < 256; i++) {
        const t = i / 255;

        // Find surrounding stops
        let lower = parsedStops[0];
        let upper = parsedStops[parsedStops.length - 1];

        for (let s = 0; s < parsedStops.length - 1; s++) {
          if (t >= parsedStops[s].position && t <= parsedStops[s + 1].position) {
            lower = parsedStops[s];
            upper = parsedStops[s + 1];
            break;
          }
        }

        const range = upper.position - lower.position;
        const localT = range > 0 ? (t - lower.position) / range : 0;

        lutR[i] = Math.round(lower.rgb.r + (upper.rgb.r - lower.rgb.r) * localT);
        lutG[i] = Math.round(lower.rgb.g + (upper.rgb.g - lower.rgb.g) * localT);
        lutB[i] = Math.round(lower.rgb.b + (upper.rgb.b - lower.rgb.b) * localT);
      }

      const image = this.inputs[0].image.clone();
      const data = image.bitmap.data;

      for (let i = 0; i < data.length; i += 4) {
        const luminance = Math.round(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
        data[i] = lutR[luminance];
        data[i + 1] = lutG[luminance];
        data[i + 2] = lutB[luminance];
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
    json.settings.stops = this.stops;
    return json;
  }
}

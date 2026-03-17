import NodeImage from '../NodeImage.js';
import CurvesProperties from './CurvesProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';


export default class Curves extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Curves', CurvesProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.controlPoints = typeof settings.controlPoints !== 'undefined' ? settings.controlPoints : [
      { x: 0, y: 0 },
      { x: 0.25, y: 0.25 },
      { x: 0.75, y: 0.75 },
      { x: 1, y: 1 },
    ];
  }


  // Monotone cubic spline interpolation
  buildLUT() {
    const pts = this.controlPoints.slice().sort((a, b) => a.x - b.x);
    const n = pts.length;

    if (n < 2) {
      const lut = new Uint8Array(256);
      for (let i = 0; i < 256; i++) lut[i] = i;
      return lut;
    }

    // Compute slopes
    const dx = [];
    const dy = [];
    const m = [];

    for (let i = 0; i < n - 1; i++) {
      dx[i] = pts[i + 1].x - pts[i].x;
      dy[i] = pts[i + 1].y - pts[i].y;
      m[i] = dx[i] === 0 ? 0 : dy[i] / dx[i];
    }

    // Compute tangents (Fritsch-Carlson)
    const tangents = new Array(n);
    tangents[0] = m[0];
    tangents[n - 1] = m[n - 2];

    for (let i = 1; i < n - 1; i++) {
      if (m[i - 1] * m[i] <= 0) {
        tangents[i] = 0;
      } else {
        tangents[i] = (m[i - 1] + m[i]) / 2;
      }
    }

    // Enforce monotonicity
    for (let i = 0; i < n - 1; i++) {
      if (Math.abs(m[i]) < 1e-10) {
        tangents[i] = 0;
        tangents[i + 1] = 0;
      } else {
        const alpha = tangents[i] / m[i];
        const beta = tangents[i + 1] / m[i];
        const s = alpha * alpha + beta * beta;
        if (s > 9) {
          const tau = 3 / Math.sqrt(s);
          tangents[i] = tau * alpha * m[i];
          tangents[i + 1] = tau * beta * m[i];
        }
      }
    }

    // Build LUT
    const lut = new Uint8Array(256);

    for (let i = 0; i < 256; i++) {
      const t = i / 255;
      let val;

      if (t <= pts[0].x) {
        val = pts[0].y;
      } else if (t >= pts[n - 1].x) {
        val = pts[n - 1].y;
      } else {
        // Find segment
        let seg = 0;
        for (let j = 0; j < n - 1; j++) {
          if (t >= pts[j].x && t <= pts[j + 1].x) {
            seg = j;
            break;
          }
        }

        const h = dx[seg];
        if (h === 0) {
          val = pts[seg].y;
        } else {
          const s = (t - pts[seg].x) / h;
          const s2 = s * s;
          const s3 = s2 * s;

          // Hermite basis
          val = (2 * s3 - 3 * s2 + 1) * pts[seg].y +
                (s3 - 2 * s2 + s) * h * tangents[seg] +
                (-2 * s3 + 3 * s2) * pts[seg + 1].y +
                (s3 - s2) * h * tangents[seg + 1];
        }
      }

      lut[i] = Math.max(0, Math.min(255, Math.round(val * 255)));
    }

    return lut;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      const lut = this.buildLUT();
      const image = this.inputs[0].image.clone();
      const data = image.bitmap.data;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = lut[data[i]];
        data[i + 1] = lut[data[i + 1]];
        data[i + 2] = lut[data[i + 2]];
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
    json.settings.controlPoints = this.controlPoints;
    return json;
  }
}

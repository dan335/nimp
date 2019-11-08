// https://github.com/EmilianStankov/ImageFilters/blob/master/src/com/imagefilters/StainedGlassFilter.java

import NodeImage from '../NodeImage.js';
import StainedGlassProperties from './StainedGlassProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class StainedGlass extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Stained Glass', StainedGlassProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Num Regions', 'hasNumPoints')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.numPoints = typeof settings.numPoints !== 'undefined' ? settings.numPoints : 20;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      let numPoints = this.numPoints;

      if (this.inputs[1].number != null) {
        numPoints = this.inputs[1].number;
      }

      this.bg.classList.add('running');
      this.runTimer = Date.now();

      if (this.isInsideALoop) {
        this.image = this.applyFilter(this.inputs[0].image.clone(), numPoints);
        super.run(inputThatTriggered);
      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          this.image = this.applyFilter(image, numPoints);
          super.run(inputThatTriggered);
        })
      }

    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  applyFilter(image, numPoints) {

    // copy data
    let data = [...image.bitmap.data];
    let centerPoints = [];
    let regions = {};

    // create center points
    for (let i = 0; i < numPoints; i++) {
      const x = Math.round(Math.random() * image.bitmap.width);
      const y = Math.round(Math.random() * image.bitmap.height);
      centerPoints.push({x:x, y:y});
      regions[x+'_'+y] = [];
    }

    // split pixels into regions
    for (let x = 0; x < image.bitmap.width; x++) {
      for (let y = 0; y < image.bitmap.height; y++) {

        let smallest = image.bitmap.width + image.bitmap.height;
        let nearestPoint = null;

        centerPoints.forEach(cp => {
          const distance = this.distance(x, y, cp.x, cp.y);
          if (distance < smallest) {
            smallest = distance;
            nearestPoint = cp;
          }
        })

        if (nearestPoint) {
          regions[nearestPoint.x+'_'+nearestPoint.y].push({x:x, y:y});
        }

      }
    }

    // apply filter
    centerPoints.forEach(cp => {
      let red = 0;
      let green = 0;
      let blue = 0;

      regions[cp.x+'_'+cp.y].forEach(p => {
        const index = image.getPixelIndex(p.x, p.y);
        red += data[index];
        green += data[index+1];
        blue += data[index+2];
      });

      regions[cp.x+'_'+cp.y].forEach(p => {
        const index = image.getPixelIndex(p.x, p.y);
        data[index] = red / regions[cp.x+'_'+cp.y].length;
        data[index+1] = green / regions[cp.x+'_'+cp.y].length;
        data[index+2] = blue / regions[cp.x+'_'+cp.y].length;
      })
    })

    image.bitmap.data = data;
    return image;
  }


  distance(x1, y1, x2, y2) {
    const a = x1 - x2;
    const b = y1 - y2;
    return Math.sqrt(a*a + b*b);
  }
}

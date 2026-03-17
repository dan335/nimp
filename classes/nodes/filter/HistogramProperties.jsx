import Properties from '../Properties.js';


export default class HistogramProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Histogram</div>
        <div style={{padding:'10px'}}>
          Visualizes RGB and luminance histograms of the input image as a 256x200 image.
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

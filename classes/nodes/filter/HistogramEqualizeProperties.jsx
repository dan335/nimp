import Properties from '../Properties.js';


export default class HistogramEqualizeProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Histogram Equalize</div>
        <div style={{padding:'10px'}}>
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

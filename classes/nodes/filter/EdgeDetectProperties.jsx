import Properties from '../Properties.js';


export default class EdgeDetectProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Edge Detect</div>
        <div style={{padding:'10px'}}>
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

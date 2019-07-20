import Properties from '../Properties.js';

export default class NormalizeProperties extends Properties {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Normalize Image</div>
        <div style={{padding:'10px'}}>
          Normalizes an images color by computing a histogram.
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

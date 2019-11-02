import Properties from '../Properties.js';

export default class NormalMapProperties extends Properties {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Height to Normal Map</div>
        <div style={{padding:'10px'}}>
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

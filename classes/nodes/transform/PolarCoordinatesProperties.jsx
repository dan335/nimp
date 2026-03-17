import Properties from '../Properties.js';

export default class PolarCoordinatesProperties extends Properties {

  constructor(props) {
    super(props);
    this.modeChange = this.modeChange.bind(this);
  }

  modeChange(event) {
    this.props.node.mode = event.target.value;
    this.props.node.run(null);
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Polar Coordinates</div>
        <div style={{padding:'10px'}}>
          Mode<br/>
          <select defaultValue={this.props.node.mode} onChange={this.modeChange}>
            <option value="toPolar">To Polar</option>
            <option value="toCartesian">To Cartesian</option>
          </select>
          <br/><br/>
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

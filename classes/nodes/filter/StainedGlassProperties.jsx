import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class StainedGlassProperties extends Properties {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Height to Normal Map</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Num Regions" varName={'numPoints'} input={this.props.node.inputs[1]} min={1} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

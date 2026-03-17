import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class DistanceFieldProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Distance Field</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Threshold" varName={'threshold'} input={this.props.node.inputs[1]} min={0} max={255} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

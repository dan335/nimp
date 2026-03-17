import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class SpherizeProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Spherize</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Radius" varName={'radius'} input={this.props.node.inputs[1]} min={0.1} max={10} step={0.1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class SwirlProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Swirl</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Angle" varName={'angle'} input={this.props.node.inputs[1]} min={-720} max={720} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Radius" varName={'radius'} input={this.props.node.inputs[2]} min={0.01} max={2} step={0.01} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

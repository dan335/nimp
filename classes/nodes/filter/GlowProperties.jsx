import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class GlowProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Glow / Bloom</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Threshold" varName={'threshold'} input={this.props.node.inputs[1]} min={0} max={255} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Radius" varName={'radius'} input={this.props.node.inputs[2]} min={1} max={50} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Intensity" varName={'intensity'} input={this.props.node.inputs[3]} min={0} max={2} step={0.01} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

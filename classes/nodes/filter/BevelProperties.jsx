import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class BevelProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Bevel</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Strength" varName={'strength'} input={this.props.node.inputs[1]} min={0.01} step={0.01} />
          <PropertiesInputNumber node={this.props.node} name="Light Angle" varName={'lightAngle'} input={this.props.node.inputs[2]} min={0} max={360} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

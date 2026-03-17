import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class HalftoneProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Halftone</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Dot Size" varName={'dotSize'} input={this.props.node.inputs[1]} min={2} max={30} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Angle" varName={'angle'} input={this.props.node.inputs[2]} min={0} max={180} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class DirectionalBlurProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Directional Blur</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Angle" varName={'angle'} input={this.props.node.inputs[1]} min={0} max={360} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Samples" varName={'samples'} input={this.props.node.inputs[2]} min={1} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

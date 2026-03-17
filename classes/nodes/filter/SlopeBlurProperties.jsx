import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class SlopeBlurProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Slope Blur</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Strength" varName={'strength'} input={this.props.node.inputs[2]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Samples" varName={'samples'} input={this.props.node.inputs[3]} min={1} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

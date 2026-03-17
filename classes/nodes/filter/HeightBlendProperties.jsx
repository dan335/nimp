import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class HeightBlendProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Height Blend</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Blend" varName={'blend'} input={this.props.node.inputs[4]} min={0} max={1} step={0.01} />
          <PropertiesInputNumber node={this.props.node} name="Contrast" varName={'contrast'} input={this.props.node.inputs[5]} min={0} step={0.1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

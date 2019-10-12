import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class CropProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Crop</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="X" varName={'cropX'} input={this.props.node.inputs[1]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Y" varName={'cropY'} input={this.props.node.inputs[2]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[3]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[4]} min={1} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

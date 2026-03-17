import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class ColorToImageProperties extends Properties {

  constructor(props) {
    super(props);
    this.state = {
      hasColorInput: props.node.inputs[0].parent ? true : false,
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Color to Image</div>
        <div style={{padding:'10px'}}>
          {this.renderColor()}
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[1]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[2]} min={1} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

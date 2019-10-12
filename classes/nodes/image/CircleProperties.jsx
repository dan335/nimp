import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class CircleProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasColorInput: props.node.inputs[3].parent ? true : false,
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Circle</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[0]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[1]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Padding" varName={'padding'} input={this.props.node.inputs[2]} min={0} step={1} />
          <br/>
          {this.renderColor()}

          {this.renderRun()}
        </div>
      </div>
    )
  }
}

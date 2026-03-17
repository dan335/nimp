import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class RemapProperties extends Properties {

  constructor(props) {
    super(props);
    this.state = {
      hasValue: props.node.inputs[0].parent ? true : false,
      hasInMin: props.node.inputs[1].parent ? true : false,
      hasInMax: props.node.inputs[2].parent ? true : false,
      hasOutMin: props.node.inputs[3].parent ? true : false,
      hasOutMax: props.node.inputs[4].parent ? true : false,
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Remap / Lerp</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Value" varName={'value'} input={this.props.node.inputs[0]} step={0.01} />
          <PropertiesInputNumber node={this.props.node} name="In Min" varName={'inMin'} input={this.props.node.inputs[1]} step={0.01} />
          <PropertiesInputNumber node={this.props.node} name="In Max" varName={'inMax'} input={this.props.node.inputs[2]} step={0.01} />
          <PropertiesInputNumber node={this.props.node} name="Out Min" varName={'outMin'} input={this.props.node.inputs[3]} step={0.01} />
          <PropertiesInputNumber node={this.props.node} name="Out Max" varName={'outMax'} input={this.props.node.inputs[4]} step={0.01} />
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

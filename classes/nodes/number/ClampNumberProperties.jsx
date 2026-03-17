import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class ClampNumberProperties extends Properties {

  constructor(props) {
    super(props);
    this.state = {
      hasValue: props.node.inputs[0].parent ? true : false,
      hasMin: props.node.inputs[1].parent ? true : false,
      hasMax: props.node.inputs[2].parent ? true : false,
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Clamp Number</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Value" varName={'value'} input={this.props.node.inputs[0]} step={0.01} />
          <PropertiesInputNumber node={this.props.node} name="Min" varName={'min'} input={this.props.node.inputs[1]} step={0.01} />
          <PropertiesInputNumber node={this.props.node} name="Max" varName={'max'} input={this.props.node.inputs[2]} step={0.01} />
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

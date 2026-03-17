import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class WeavePatternProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Weave Pattern</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[0]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[1]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Thread Size" varName={'threadSize'} input={this.props.node.inputs[2]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Gap" varName={'gap'} input={this.props.node.inputs[3]} min={0} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

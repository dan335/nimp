import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class StarburstPatternProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Starburst Pattern</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[0]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[1]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Rays" varName={'rays'} input={this.props.node.inputs[2]} min={2} max={100} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class ScratchesProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Scratches</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[0]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[1]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Seed" varName={'seed'} input={this.props.node.inputs[2]} />
          <PropertiesInputNumber node={this.props.node} name="Count" varName={'count'} input={this.props.node.inputs[3]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Length" varName={'length'} input={this.props.node.inputs[4]} min={1} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

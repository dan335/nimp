import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class SplatterProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Splatter</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[0]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[1]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Count" varName={'count'} input={this.props.node.inputs[2]} min={1} max={500} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Seed" varName={'seed'} input={this.props.node.inputs[3]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Min Radius" varName={'minRadius'} min={1} max={100} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Max Radius" varName={'maxRadius'} min={1} max={100} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

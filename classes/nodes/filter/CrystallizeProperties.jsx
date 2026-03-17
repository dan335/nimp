import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class CrystallizeProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Crystallize</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Cell Size" varName={'cellSize'} input={this.props.node.inputs[1]} min={2} max={100} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Seed" varName={'seed'} input={this.props.node.inputs[2]} min={0} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

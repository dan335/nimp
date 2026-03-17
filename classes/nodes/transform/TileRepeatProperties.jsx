import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class TileRepeatProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Tile Repeat</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Repeat X" varName={'repeatX'} input={this.props.node.inputs[1]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Repeat Y" varName={'repeatY'} input={this.props.node.inputs[2]} min={1} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

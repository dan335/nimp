import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class VoronoiProperties extends Properties {

  modeChange(event) {
    this.props.node.mode = event.target.value;
    this.props.node.run(null);
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Voronoi</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[0]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[1]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Points" varName={'points'} input={this.props.node.inputs[2]} min={1} max={1000} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Seed" varName={'seed'} input={this.props.node.inputs[3]} min={0} step={1} />
          <br/>
          Mode &nbsp;
          <select defaultValue={this.props.node.mode} onChange={(e) => this.modeChange(e)}>
            <option value="cell">Cell Color</option>
            <option value="distance">Distance to Center</option>
            <option value="edge">Edge Distance</option>
          </select>
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

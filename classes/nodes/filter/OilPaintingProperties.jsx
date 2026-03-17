import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class OilPaintingProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Oil Painting</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Radius" varName={'radius'} input={this.props.node.inputs[1]} min={1} max={8} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Intensity Levels" varName={'levels'} input={this.props.node.inputs[2]} min={2} max={50} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

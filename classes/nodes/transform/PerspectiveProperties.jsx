import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class PerspectiveProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Perspective</div>
        <div style={{padding:'10px'}}>
          Apply a trapezoid perspective transform by scaling the top and bottom edges independently.<br/>
          <br/>
          <PropertiesInputNumber node={this.props.node} name="Top Scale" varName={'topScale'} input={this.props.node.inputs[1]} min={0} step={0.05} />
          <PropertiesInputNumber node={this.props.node} name="Bottom Scale" varName={'bottomScale'} input={this.props.node.inputs[2]} min={0} step={0.05} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

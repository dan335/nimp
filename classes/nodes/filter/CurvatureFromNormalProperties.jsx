import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class CurvatureFromNormalProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Curvature From Normal</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Strength" varName={'strength'} input={this.props.node.inputs[1]} min={0} step={0.01} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class NormalBlendProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Normal Blend</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Strength" varName={'strength'} input={this.props.node.inputs[2]} min={0} step={0.01} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

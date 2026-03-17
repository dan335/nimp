import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class EmbossProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Emboss</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Strength" varName={'strength'} input={this.props.node.inputs[1]} min={0} max={5} step={0.01} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

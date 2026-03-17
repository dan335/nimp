import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class NormalToHeightProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Normal To Height</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Iterations" varName={'iterations'} input={this.props.node.inputs[1]} min={1} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

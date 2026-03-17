import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class ChromaticAberrationProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Chromatic Aberration</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Amount" varName={'amount'} input={this.props.node.inputs[1]} min={0} max={50} step={0.5} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

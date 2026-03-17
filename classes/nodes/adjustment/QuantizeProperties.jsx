import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class QuantizeProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Quantize</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Colors" varName={'colors'} input={this.props.node.inputs[1]} min={2} max={256} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

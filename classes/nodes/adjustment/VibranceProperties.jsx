import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class VibranceProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Vibrance</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Amount" varName={'amount'} input={this.props.node.inputs[1]} min={-100} max={100} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

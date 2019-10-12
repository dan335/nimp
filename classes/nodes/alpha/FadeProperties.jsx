import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class FadeProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Fade</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Amount" varName={'amount'} input={this.props.node.inputs[1]} min={0} max={1} step={0.01} help="0 has no effect.  1 makes the image transparent." />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

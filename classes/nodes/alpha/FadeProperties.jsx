import Properties from '../Properties.js';
import PropertiesInputSlider from '../../../components/PropertiesInputSlider.jsx';

export default class FadeProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Fade</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputSlider node={this.props.node} name="Amount" varName={'amount'} input={this.props.node.inputs[1]} min={0} max={1} step={0.01} help="0 has no effect.  1 makes the image transparent." />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

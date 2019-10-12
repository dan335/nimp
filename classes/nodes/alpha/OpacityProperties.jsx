import Properties from '../Properties.js';
import PropertiesInputSlider from '../../../components/PropertiesInputSlider.jsx';

export default class OpacityProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Opacity</div>
        <div style={{padding:'10px'}}>
          Multiply the alpha channel by an amount.<br/>
          <br/>
          <PropertiesInputSlider node={this.props.node} name="Amount" varName={'amount'} input={this.props.node.inputs[1]} min={0} max={1} step={0.01} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

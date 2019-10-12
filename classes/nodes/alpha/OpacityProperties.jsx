import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class OpacityProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Opacity</div>
        <div style={{padding:'10px'}}>
          Multiply the alpha channel by an amount.<br/>
          <br/>
          <PropertiesInputNumber node={this.props.node} name="Amount" varName={'amount'} input={this.props.node.inputs[1]} min={0} max={1} step={0.01} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

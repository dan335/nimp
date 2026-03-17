import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class SwitchProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Switch</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Index (0-3)" varName={'index'} input={this.props.node.inputs[4]} min={0} max={3} step={1} />
          <br/><br/>
          Routes one of four image inputs (A/B/C/D) to the output based on the index value.
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

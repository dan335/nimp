import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class BlurProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Blur</div>
        <div style={{padding:'10px'}}>
          Fast blur.<br/>
          <br/>
          <PropertiesInputNumber node={this.props.node} name="Radius" varName={'radius'} input={this.props.node.inputs[1]} min={0} help="Value is in pixels." />

          {this.renderRun()}
        </div>
      </div>
    )
  }
}

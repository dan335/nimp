import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class GaussianBlurProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Gaussian Blur</div>
        <div style={{padding:'10px'}}>
          Slow but high quality blur.<br/>
          <br/>
          <PropertiesInputNumber node={this.props.node} name="Radius" varName={'radius'} input={this.props.node.inputs[1]} min={0} help="Value is in pixels." />

          {this.renderRun()}
        </div>
      </div>
    )
  }
}

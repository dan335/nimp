import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class AmbientOcclusionProperties extends Properties {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Ambient Occlusion</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Radius" varName={'radius'} input={this.props.node.inputs[1]} min={1} step={1} />
          {this.renderRun()}
          <br/><br/>
          <div>
            Uses input as a height map.  Black is lowest and white is highest.  Calculates how much each pixel is exposed to ambient lighting.<br/>
            <br/>
            Increasing radius greatly decreases performance.
          </div>
        </div>
      </div>
    )
  }
}

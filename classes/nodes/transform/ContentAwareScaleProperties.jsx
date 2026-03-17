import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class ContentAwareScaleProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Content Aware Scale</div>
        <div style={{padding:'10px'}}>
          Resize image width using seam carving to preserve important content.<br/>
          <br/>
          <PropertiesInputNumber node={this.props.node} name="Target Width" varName={'targetWidth'} input={this.props.node.inputs[1]} min={10} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

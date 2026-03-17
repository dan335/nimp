import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class PBRPreviewProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">PBR Preview</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Size" varName={'size'} input={this.props.node.inputs[3]} min={32} max={512} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class TilePreviewProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Tile Preview</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Tiles" varName={'tiles'} input={this.props.node.inputs[1]} min={1} max={8} step={1} />
          <br/>
          Shows the image tiled NxN to verify seamlessness.
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

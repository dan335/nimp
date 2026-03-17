import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class MakeTileableProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Make Tileable</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Blend Width" varName={'blendWidth'} input={this.props.node.inputs[1]} min={0.01} max={0.5} step={0.01} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

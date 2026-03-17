import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class KaleidoscopeProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Kaleidoscope</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Segments" varName={'segments'} input={this.props.node.inputs[1]} min={2} max={32} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class CompareProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Compare</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Split Position" varName={'split'} input={this.props.node.inputs[2]} min={0} max={1} step={0.01} />
          <br/>
          Side-by-side split view of two input images.
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

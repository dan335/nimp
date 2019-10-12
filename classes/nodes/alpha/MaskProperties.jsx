import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class MaskProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Mask</div>
        <div style={{padding:'10px'}}>
          Position of image.<br/><br/>
          <PropertiesInputNumber node={this.props.node} name="X" varName={'maskX'} input={this.props.node.inputs[2]} />
          <PropertiesInputNumber node={this.props.node} name="Y" varName={'maskY'} input={this.props.node.inputs[3]} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

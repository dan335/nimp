import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class PosterizeProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Posterize</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Amount" varName={'amount'} input={this.props.node.inputs[1]} min={0} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

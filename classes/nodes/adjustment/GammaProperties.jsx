import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class GammaProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Gamma</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Gamma" varName={'gamma'} input={this.props.node.inputs[1]} min={0.01} max={10} step={0.01} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

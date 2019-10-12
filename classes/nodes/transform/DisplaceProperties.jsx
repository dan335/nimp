import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class DisplaceProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Displace</div>
        <div style={{padding:'10px'}}>
          Displace the image pixels based on the provided displacement map.<br/>
          <br/>
          <PropertiesInputNumber node={this.props.node} name="Offset" varName={'offset'} input={this.props.node.inputs[2]} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

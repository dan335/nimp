import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class NumberProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Number Input</div>

        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Number" varName={'number'} input={null} />
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

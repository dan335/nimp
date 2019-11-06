import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class IfProperties extends Properties {


  render() {
    return (
      <div>
        <div className="propertiesTitle">Number If</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Test" varName={'a'} input={null} min={0} max={1} step={1} />

          <br/><br/>
          Outputs number if test number is true.  Does nothing if number is false.  Number is considered false if it is 0 or -0.
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class UniformColorProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasColorInput: props.node.inputs[2].parent ? true : false,
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Uniform Color</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[0]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[1]} min={1} step={1} />

          <br/><br/>

          {this.renderColor()}

          {this.renderRun()}
        </div>
      </div>
    )
  }
}

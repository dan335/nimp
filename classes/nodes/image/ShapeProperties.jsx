import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class ShapeProperties extends Properties {

  constructor(props) {
    super(props);
    this.state = {
      hasColorInput: props.node.inputs[4].parent ? true : false,
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Shape</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[0]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[1]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Sides" varName={'sides'} input={this.props.node.inputs[2]} min={3} max={64} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Inner Radius" varName={'innerRadius'} input={this.props.node.inputs[3]} min={0.01} max={1} step={0.01} />
          <br/>
          {this.renderColor()}
          <br/>
          Set Inner Radius below 1 for star shapes.
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

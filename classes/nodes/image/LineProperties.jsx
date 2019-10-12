import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class LineProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasColorInput: props.node.inputs[6].parent ? true : false,
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Line</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[0]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[1]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="X1" varName={'x1'} input={this.props.node.inputs[2]} step={0.1} />
          <PropertiesInputNumber node={this.props.node} name="Y1" varName={'y1'} input={this.props.node.inputs[3]} step={0.1} />
          <PropertiesInputNumber node={this.props.node} name="X2" varName={'x2'} input={this.props.node.inputs[4]} step={0.1} />
          <PropertiesInputNumber node={this.props.node} name="Y2" varName={'y2'} input={this.props.node.inputs[5]} step={0.1} />
          <PropertiesInputNumber node={this.props.node} name="Line Width" varName={'lineWidth'} input={this.props.node.inputs[7]} min={1} step={0.1} />
          {this.renderColor()}

          {this.renderRun()}
        </div>
      </div>
    )
  }
}

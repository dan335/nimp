import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class SliderProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      reRenderSlider: Math.random()
    }

    this.sliderMove = this.sliderMove.bind(this);
  }


  sliderChange(event) {
    const elm = document.getElementById('sliderInput');
    this.props.node.number = Number(elm.value);
    this.props.node.run(null);
  }


  sliderMove() {
    this.setState({reRenderSlider:Math.random()});
  }

  renderSlider() {
    const bogus = this.state.reRenderSlider;
    return (
      <div style={{backgroundColor:'hsl(209, 10%, 25%)', padding:'10px', marginBottom:'3px'}}>
        <input style={{width:'100%'}} type="range" id="sliderInput" defaultValue={this.props.node.number} min={this.props.node.min} max={this.props.node.max} step={this.props.node.step} onChange={(event) => {this.sliderChange(event);}} />
      </div>
    )
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Number Input</div>

        <div style={{padding:'10px'}}>
          {this.renderSlider()}

          <PropertiesInputNumber node={this.props.node} name="Min" varName={'min'} input={this.props.node.inputs[0]} callback={this.sliderMove} />
          <PropertiesInputNumber node={this.props.node} name="Max" varName={'max'} input={this.props.node.inputs[1]} callback={this.sliderMove} />
          <PropertiesInputNumber node={this.props.node} name="Step" varName={'step'} input={this.props.node.inputs[2]} callback={this.sliderMove} />

          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

import Properties from '../Properties.js';

export default class SliderProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      reRenderSlider: Math.random()
    }
  }


  sliderChange(event) {
    const elm = document.getElementById('sliderInput');
    this.props.node.number = Number(elm.value);
    this.props.node.run(null);
  }


  minChange() {
    const elm = document.getElementById('minInput');
    this.props.node.min = Number(elm.value);
    this.setState({reRenderSlider:Math.random()});
  }

  maxChange() {
    const elm = document.getElementById('maxInput');
    this.props.node.max = Number(elm.value);
    this.setState({reRenderSlider:Math.random()});
  }

  stepChange() {
    const elm = document.getElementById('stepInput');
    this.props.node.step = Number(elm.value);
    this.setState({reRenderSlider:Math.random()});
  }


  renderMin() {
    return (
      <div>
        Min &nbsp;
        <input id="minInput" type="number" defaultValue={this.props.node.min} onChange={(event) => {this.minChange(event);}} />
        <br/>
      </div>
    )
  }


  renderMax() {
    return (
      <div>
        Max &nbsp;
        <input id="maxInput" type="number" defaultValue={this.props.node.max} onChange={(event) => {this.maxChange(event);}} />
        <br/>
      </div>
    )
  }


  renderStep() {
    return (
      <div>
        Step &nbsp;
        <input id="stepInput" type="number" defaultValue={this.props.node.step} onChange={(event) => {this.stepChange(event);}} />
        <br/>
      </div>
    )
  }


  renderSlider() {
    const bogus = this.state.reRenderSlider;
    return (
      <div>
        <input type="range" id="sliderInput" defaultValue={this.props.node.number} min={this.props.node.min} max={this.props.node.max} step={this.props.node.step} onChange={(event) => {this.sliderChange(event);}} />
      </div>
    )
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Number Input</div>

        <div style={{padding:'10px'}}>
          {this.renderSlider()}

          {this.renderMin()}
          {this.renderMax()}
          {this.renderStep()}
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

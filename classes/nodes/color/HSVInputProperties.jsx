import Properties from '../Properties.js';

export default class HSVInputProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasHueInput: props.node.inputs[0].parent ? true : false,
      hasSaturationInput: props.node.inputs[1].parent ? true : false,
      hasValueInput: props.node.inputs[2].parent ? true : false,
      hasAlphaInput: props.node.inputs[3].parent ? true : false,
    }
  }


  hueChange(event) {
    const elm = document.getElementById('hueInput');
    this.props.node.hue = Number(elm.value);
    this.props.node.run(null);
  }


  saturationChange(event) {
    const elm = document.getElementById('saturationInput');
    this.props.node.saturation = Number(elm.value);
    this.props.node.run(null);
  }


  valueChange(event) {
    const elm = document.getElementById('valueInput');
    this.props.node.value = Number(elm.value);
    this.props.node.run(null);
  }


  alphaChange(event) {
    const elm = document.getElementById('alphaInput');
    this.props.node.alpha = Number(elm.value);
    this.props.node.run(null);
  }


  renderHue() {
    if (!this.state.hasHueInput) {
      return (
        <div>
          Hue &nbsp;&nbsp; 0 - 255<br/>
          <input id="hueInput" type="number" min="0" max="255" defaultValue={this.props.node.hue} onChange={(event) => {this.hueChange(event);}} />
          <br/>
        </div>
      )
    }
  }

  renderSaturation() {
    if (!this.state.hasSaturationInput) {
      return (
        <div>
          Saturation &nbsp;&nbsp; 0 - 1<br/>
          <input id="saturationInput" type="number" min="0" max="1" step="0.1" defaultValue={this.props.node.saturation} onChange={(event) => {this.saturationChange(event);}} />
          <br/>
        </div>
      )
    }
  }

  renderValue() {
    if (!this.state.hasValueInput) {
      return (
        <div>
          Value &nbsp;&nbsp; 0 - 1<br/>
          <input id="valueInput" type="number" min="0" max="1" step="0.1" defaultValue={this.props.node.value} onChange={(event) => {this.valueChange(event);}} />
          <br/>
        </div>
      )
    }
  }

  renderAlpha() {
    if (!this.state.hasAlphaInput) {
      return (
        <div>
          Alpha &nbsp;&nbsp; 0 - 1<br/>
          <input id="alphaInput" type="number" min="0" max="1" step="0.1" defaultValue={this.props.node.alpha} onChange={(event) => {this.alphaChange(event);}} />
          <br/>
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">HSV Input</div>

        <div style={{padding:'10px'}}>
          {this.renderHue()}<br/>
          {this.renderSaturation()}<br/>
          {this.renderValue()}<br/>
          {this.renderAlpha()}
        </div>
      </div>
    )
  }
}

import Properties from '../Properties.js';

export default class HSLInputProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasHueInput: props.node.inputs[0].parent ? true : false,
      hasSaturationInput: props.node.inputs[1].parent ? true : false,
      hasLightnessInput: props.node.inputs[2].parent ? true : false,
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


  lightnessChange(event) {
    const elm = document.getElementById('lightnessInput');
    this.props.node.lightness = Number(elm.value);
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

  renderLightness() {
    if (!this.state.hasLightnessInput) {
      return (
        <div>
          Lightness &nbsp;&nbsp; 0 - 1<br/>
          <input id="lightnessInput" type="number" min="0" max="1" step="0.1" defaultValue={this.props.node.lightness} onChange={(event) => {this.lightnessChange(event);}} />
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
        <div className="propertiesTitle">HSL Input</div>

        <div style={{padding:'10px'}}>
          {this.renderHue()}<br/>
          {this.renderSaturation()}<br/>
          {this.renderLightness()}<br/>
          {this.renderAlpha()}
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

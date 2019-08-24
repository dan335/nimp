import Properties from '../Properties.js';

export default class ColorAdjustProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasHueInput: props.node.inputs[1].parent ? true : false,
      hasSaturationInput: props.node.inputs[2].parent ? true : false,
      hasLightnessInput: props.node.inputs[3].parent ? true : false,
      hasBrightnessInput: props.node.inputs[3].parent ? true : false,
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

  brightnessChange(event) {
    const elm = document.getElementById('brightnessInput');
    this.props.node.brightness = Number(elm.value);
    this.props.node.run(null);
  }


  renderHue() {
    if (!this.state.hasHueInput) {
      return (
        <div>
          Hue &nbsp;&nbsp; -360 - 360<br/>
          <input id="hueInput" style={{width:'100%'}} type="range" min="-360" max="360" defaultValue={this.props.node.hue} onChange={(event) => {this.hueChange(event);}} />
          <br/>
        </div>
      )
    }
  }

  renderSaturation() {
    if (!this.state.hasSaturationInput) {
      return (
        <div>
          Saturation &nbsp;&nbsp; -1 - 1<br/>
          <input id="saturationInput" style={{width:'100%'}} type="range" min="-1" max="1" step="0.01" defaultValue={this.props.node.saturation} onChange={(event) => {this.saturationChange(event);}} />
          <br/>
        </div>
      )
    }
  }

  renderLightness() {
    if (!this.state.hasLightnessInput) {
      return (
        <div>
          Lightness &nbsp;&nbsp; -1 - 1<br/>
          <input id="lightnessInput" style={{width:'100%'}} type="range" min="-1" max="1" step="0.01" defaultValue={this.props.node.lightness} onChange={(event) => {this.lightnessChange(event);}} />
          <br/>
        </div>
      )
    }
  }

  renderBrightness() {
    if (!this.state.hasBrightnessInput) {
      return (
        <div>
          Brightness &nbsp;&nbsp; -1 - 1<br/>
          <input id="brightnessInput" style={{width:'100%'}} type="range" min="-1" max="1" step="0.01" defaultValue={this.props.node.brightness} onChange={(event) => {this.brightnessChange(event);}} />
          <br/>
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Color Adjust</div>

        <div style={{padding:'10px'}}>
          {this.renderHue()}<br/>
          {this.renderSaturation()}<br/>
          {this.renderLightness()}<br/>
          {this.renderBrightness()}<br/>
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

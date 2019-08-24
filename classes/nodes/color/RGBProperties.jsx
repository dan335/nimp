import Properties from '../Properties.js';

export default class RGBProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasRedInput: props.node.inputs[0].parent ? true : false,
      hasGreenInput: props.node.inputs[1].parent ? true : false,
      hasBlueInput: props.node.inputs[2].parent ? true : false,
      hasAlphaInput: props.node.inputs[3].parent ? true : false,
    }
  }


  redChange(event) {
    const elm = document.getElementById('redInput');
    this.props.node.red = Number(elm.value);
    this.props.node.run(null);
  }


  greenChange(event) {
    const elm = document.getElementById('greenInput');
    this.props.node.green = Number(elm.value);
    this.props.node.run(null);
  }


  blueChange(event) {
    const elm = document.getElementById('blueInput');
    this.props.node.blue = Number(elm.value);
    this.props.node.run(null);
  }


  alphaChange(event) {
    const elm = document.getElementById('alphaInput');
    this.props.node.alpha = Number(elm.value);
    this.props.node.run(null);
  }


  renderRed() {
    if (!this.state.hasRedInput) {
      return (
        <div>
          Red<br/>
          <input id="redInput" type="number" min="0" max="255" defaultValue={this.props.node.red} onChange={(event) => {this.redChange(event);}} />
          <br/>
        </div>
      )
    }
  }

  renderGreen() {
    if (!this.state.hasGreenInput) {
      return (
        <div>
          Green<br/>
          <input id="greenInput" type="number" min="0" max="255" defaultValue={this.props.node.green} onChange={(event) => {this.greenChange(event);}} />
          <br/>
        </div>
      )
    }
  }

  renderBlue() {
    if (!this.state.hasBlueInput) {
      return (
        <div>
          Blue<br/>
          <input id="blueInput" type="number" min="0" max="255" defaultValue={this.props.node.blue} onChange={(event) => {this.blueChange(event);}} />
          <br/>
        </div>
      )
    }
  }

  renderAlpha() {
    if (!this.state.hasAlphaInput) {
      return (
        <div>
          Alpha<br/>
          <input id="alphaInput" type="number" min="0" max="1" step="0.1" defaultValue={this.props.node.alpha} onChange={(event) => {this.alphaChange(event);}} />
          <br/>
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">RGB Input</div>

        <div style={{padding:'10px'}}>
          From 0 - 255<br/>
          <br/>
          {this.renderRed()}
          {this.renderGreen()}
          {this.renderBlue()}
          {this.renderAlpha()}
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

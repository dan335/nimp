import Properties from '../Properties.js';
import Jimp from 'jimp';


export default class CircleProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasWidth: props.node.inputs[0].parent ? true : false,
      hasHeight: props.node.inputs[1].parent ? true : false,
      hasPadding: props.node.inputs[2].parent ? true : false
    }

    this.widthChange = this.widthChange.bind(this);
    this.heightChange = this.heightChange.bind(this);
    this.redChange = this.redChange.bind(this);
    this.greenChange = this.greenChange.bind(this);
    this.blueChange = this.blueChange.bind(this);
    this.alphaChange = this.alphaChange.bind(this);
    this.paddingChange = this.paddingChange.bind(this);
  }

  redChange() {
    const elm = document.getElementById('redSlider');
    this.props.node.red = Number(elm.value);
    this.props.node.run(null);
  }


  greenChange() {
    const elm = document.getElementById('greenSlider');
    this.props.node.green = Number(elm.value);
    this.props.node.run(null);
  }


  blueChange() {
    const elm = document.getElementById('blueSlider');
    this.props.node.blue = Number(elm.value);
    this.props.node.run(null);
  }


  alphaChange() {
    const elm = document.getElementById('alphaSlider');
    this.props.node.alpha = Number(elm.value);
    this.props.node.run(null);
  }


  widthChange() {
    const elm = document.getElementById('widthInput');
    this.props.node.width = Number(elm.value);
    this.props.node.run(null);
  }

  heightChange() {
    const elm = document.getElementById('heightInput');
    this.props.node.height = Number(elm.value);
    this.props.node.run(null);
  }

  paddingChange() {
    const elm = document.getElementById('paddingInput');
    this.props.node.padding = Number(elm.value);
    this.props.node.run(null);
  }

  renderWidth() {
    if (!this.state.hasWidthInput) {
      return (
        <div>
          Width &nbsp;
          <input id="widthInput" type="number" min="1" defaultValue={this.props.node.width} onChange={(event) => {this.widthChange(event);}} />
          <br/>
        </div>
      )
    }
  }


  renderHeight() {
    if (!this.state.hasHeightInput) {
      return (
        <div>
          Height &nbsp;
          <input id="heightInput" type="number" min="1" defaultValue={this.props.node.height} onChange={(event) => {this.heightChange(event);}} />
        </div>
      )
    }
  }

  renderPadding() {
    if (!this.state.hasPaddingInput) {
      return (
        <div>
          Padding &nbsp;
          <input id="paddingInput" type="number" min="1" defaultValue={this.props.node.padding} onChange={(event) => {this.paddingChange(event);}} />
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Circle</div>
        <div style={{padding:'10px'}}>

        {this.renderWidth()}
        {this.renderHeight()}

        <br/><br/>

        Red<br/>
        <input id="redSlider" style={{width:'100%'}} type="range" min="0" max="255" defaultValue={this.props.node.red} onChange={(event) => {this.redChange(event);}} />

        Green<br/>
        <input id="greenSlider" style={{width:'100%'}} type="range" min="0" max="255" defaultValue={this.props.node.green} onChange={(event) => {this.greenChange(event);}} />

        Blue<br/>
        <input id="blueSlider" style={{width:'100%'}} type="range" min="0" max="255" defaultValue={this.props.node.blue} onChange={(event) => {this.blueChange(event);}} />

        Alpha<br/>
        <input id="alphaSlider" style={{width:'100%'}} type="range" min="0" max="255" defaultValue={this.props.node.alpha} onChange={(event) => {this.alphaChange(event);}} />

        <br/><br/>
        {this.renderPadding()}
        </div>
      </div>
    )
  }
}

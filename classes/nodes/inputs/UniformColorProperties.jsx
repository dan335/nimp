import Properties from '../Properties.js';
import Jimp from 'jimp';


export default class UniformColorProperties extends Properties {

  redChange() {
    const elm = document.getElementById('redSlider');
    this.props.node.red = Number(elm.value);
    this.props.node.run();
  }


  greenChange() {
    const elm = document.getElementById('greenSlider');
    this.props.node.green = Number(elm.value);
    this.props.node.run();
  }


  blueChange() {
    const elm = document.getElementById('blueSlider');
    this.props.node.blue = Number(elm.value);
    this.props.node.run();
  }


  alphaChange() {
    const elm = document.getElementById('alphaSlider');
    this.props.node.alpha = Number(elm.value);
    this.props.node.run();
  }


  widthChange() {
    const elm = document.getElementById('widthInput');
    this.props.node.width = Number(elm.value);
    this.props.node.run();
  }

  heightChange() {
    const elm = document.getElementById('heightInput');
    this.props.node.height = Number(elm.value);
    this.props.node.run();
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Uniform Color</div>
        <div style={{padding:'10px'}}>

        Width<br/>
        <input id="widthInput" type="number" min="1" defaultValue={this.props.node.width} onChange={(event) => {this.widthChange(event);}} />
        <br/><br/>

        Height<br/>
        <input id="heightInput" type="number" min="1" defaultValue={this.props.node.height} onChange={(event) => {this.heightChange(event);}} />
        <br/>

        <br/><br/>

        Red<br/>
        <input id="redSlider" style={{width:'100%'}} type="range" min="0" max="255" defaultValue={this.props.node.red} onChange={(event) => {this.redChange(event);}} />

        Green<br/>
        <input id="greenSlider" style={{width:'100%'}} type="range" min="0" max="255" defaultValue={this.props.node.green} onChange={(event) => {this.greenChange(event);}} />

        Blue<br/>
        <input id="blueSlider" style={{width:'100%'}} type="range" min="0" max="255" defaultValue={this.props.node.blue} onChange={(event) => {this.blueChange(event);}} />

        Alpha<br/>
        <input id="alphaSlider" style={{width:'100%'}} type="range" min="0" max="255" defaultValue={this.props.node.alpha} onChange={(event) => {this.alphaChange(event);}} />

        </div>
      </div>
    )
  }
}

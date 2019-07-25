import Properties from '../Properties.js';
import Jimp from 'jimp';


export default class GradientProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasWidthInput: props.node.inputs[0].parent ? true : false,
      hasHeightInput: props.node.inputs[1].parent ? true : false,
      hasColorAInput: props.node.inputs[2].parent ? true : false,
      hasColorBInput: props.node.inputs[3].parent ? true : false,
    }
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

  colorAChange() {
    const elm = document.getElementById('colorAInput');
    this.props.node.colorA = elm.value;
    this.props.node.run(null);
  }

  colorBChange() {
    const elm = document.getElementById('colorBInput');
    this.props.node.colorB = elm.value;
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

  renderColorA() {
    if (!this.state.hasColorAInput) {
      return (
        <div>
          Color A &nbsp;
          <input id="colorAInput" type="text" defaultValue={this.props.node.colorA} onChange={(event) => {this.colorAChange(event);}} />
        </div>
      )
    }
  }

  renderColorB() {
    if (!this.state.hasColorBInput) {
      return (
        <div>
          Color B &nbsp;
          <input id="colorBInput" type="text" defaultValue={this.props.node.colorB} onChange={(event) => {this.colorBChange(event);}} />
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Gradient</div>
        <div style={{padding:'10px'}}>
          {this.renderWidth()}
          {this.renderHeight()}

          <br/><br/>
          {this.renderColorA()}
          {this.renderColorB()}

          {this.renderRun()}
        </div>
      </div>
    )
  }
}

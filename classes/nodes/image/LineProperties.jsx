import Properties from '../Properties.js';
import Jimp from 'jimp';


export default class LineProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasWidthInput: props.node.inputs[0].parent ? true : false,
      hasHeightInput: props.node.inputs[1].parent ? true : false,
      hasX1Input: props.node.inputs[2].parent ? true : false,
      hasY1Input: props.node.inputs[3].parent ? true : false,
      hasX2Input: props.node.inputs[4].parent ? true : false,
      hasY2Input: props.node.inputs[5].parent ? true : false,
      hasColorInput: props.node.inputs[6].parent ? true : false,
      hasLineWidthInput: props.node.inputs[7].parent ? true : false,
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

  x1Change() {
    const elm = document.getElementById('x1Input');
    this.props.node.x1 = Number(elm.value);
    this.props.node.run(null);
  }

  y1Change() {
    const elm = document.getElementById('y1Input');
    this.props.node.y1 = Number(elm.value);
    this.props.node.run(null);
  }

  x2Change() {
    const elm = document.getElementById('x2Input');
    this.props.node.x2 = Number(elm.value);
    this.props.node.run(null);
  }

  y2Change() {
    const elm = document.getElementById('y2Input');
    this.props.node.y2 = Number(elm.value);
    this.props.node.run(null);
  }

  lineWidthChange() {
    const elm = document.getElementById('lineWidthInput');
    this.props.node.lineWidth = Number(elm.value);
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

  renderX1() {
    if (!this.state.hasX1Input) {
      return (
        <div>
          X1 &nbsp;
          <input id="x1Input" type="number" min="0" defaultValue={this.props.node.x1} onChange={(event) => {this.x1Change(event);}} />
        </div>
      )
    }
  }

  renderY1() {
    if (!this.state.hasY1Input) {
      return (
        <div>
          Y1 &nbsp;
          <input id="y1Input" type="number" min="0" defaultValue={this.props.node.y1} onChange={(event) => {this.y1Change(event);}} />
        </div>
      )
    }
  }

  renderX2() {
    if (!this.state.hasX2Input) {
      return (
        <div>
          X2 &nbsp;
          <input id="x2Input" type="number" min="0" defaultValue={this.props.node.x2} onChange={(event) => {this.x2Change(event);}} />
        </div>
      )
    }
  }

  renderY2() {
    if (!this.state.hasY2Input) {
      return (
        <div>
          Y2 &nbsp;
          <input id="y2Input" type="number" min="0" defaultValue={this.props.node.y2} onChange={(event) => {this.y2Change(event);}} />
        </div>
      )
    }
  }

  renderLineWidth() {
    if (!this.state.hasLineWidthInput) {
      return (
        <div>
          Line Width &nbsp;
          <input id="lineWidthInput" type="number" min="1" defaultValue={this.props.node.lineWidth} onChange={(event) => {this.lineWidthChange(event);}} />
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Line</div>
        <div style={{padding:'10px'}}>
          {this.renderWidth()}
          {this.renderHeight()}

          <br/><br/>
          {this.renderX1()}
          {this.renderY1()}
          {this.renderX2()}
          {this.renderY2()}
          <br/>
          {this.renderColor()}
          {this.renderLineWidth()}

          {this.renderRun()}
        </div>
      </div>
    )
  }
}

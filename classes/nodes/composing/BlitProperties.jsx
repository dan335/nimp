import Properties from '../Properties.js';

export default class BlitProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasXInput: props.node.inputs[2].parent ? true : false,
      hasYInput: props.node.inputs[3].parent ? true : false,
      hasSrcXInput: props.node.inputs[4].parent ? true : false,
      hasSrcYInput: props.node.inputs[5].parent ? true : false,
      hasSrcWidthInput: props.node.inputs[6].parent ? true : false,
      hasSrcHeightInput: props.node.inputs[7].parent ? true : false,
    }

    this.xChange = this.xChange.bind(this);
    this.yChange = this.yChange.bind(this);
    this.srcXChange = this.srcXChange.bind(this);
    this.srcYChange = this.srcYChange.bind(this);
    this.srcWidthChange = this.srcWidthChange.bind(this);
    this.srcHeightChange = this.srcHeightChange.bind(this);
  }


  xChange(event) {
    const elm = document.getElementById('xInput');
    this.props.node.blitX = Number(elm.value);
    this.props.node.run(null);
  }

  yChange(event) {
    const elm = document.getElementById('yInput');
    this.props.node.blitY = Number(elm.value);
    this.props.node.run(null);
  }

  srcXChange(event) {
    const elm = document.getElementById('srcXInput');
    this.props.node.srcX = Number(elm.value);
    this.props.node.run(null);
  }

  srcYChange(event) {
    const elm = document.getElementById('srcYInput');
    this.props.node.srcY = Number(elm.value);
    this.props.node.run(null);
  }

  srcWidthChange(event) {
    const elm = document.getElementById('srcWidthInput');
    this.props.node.srcWidth = Number(elm.value);
    this.props.node.run(null);
  }

  srcHeightChange(event) {
    const elm = document.getElementById('srcHeightInput');
    this.props.node.srcHeight = Number(elm.value);
    this.props.node.run(null);
  }


  renderX() {
    if (!this.state.hasXInput) {
      return (
        <div>
          X &nbsp;
          <input id="xInput" type="number" defaultValue={this.props.node.blitX} onChange={(event) => {this.xChange(event);}} />
          <br/>
        </div>
      )
    }
  }


  renderY() {
    if (!this.state.hasYInput) {
      return (
        <div>
          Y &nbsp;
          <input id="yInput" type="number" defaultValue={this.props.node.blitY} onChange={(event) => {this.yChange(event);}} />
        </div>
      )
    }
  }

  renderSrcX() {
    if (!this.state.hasSrcXInput) {
      return (
        <div>
          Source X &nbsp;
          <input id="srcXInput" type="number" defaultValue={this.props.node.srcX} onChange={(event) => {this.srcXChange(event);}} />
          <br/>
        </div>
      )
    }
  }


  renderSrcY() {
    if (!this.state.hasSrcYInput) {
      return (
        <div>
          Source Y &nbsp;
          <input id="srcYInput" type="number" defaultValue={this.props.node.srcY} onChange={(event) => {this.srcYChange(event);}} />
        </div>
      )
    }
  }

  renderSrcWidth() {
    if (!this.state.hasSrcWidthInput) {
      return (
        <div>
          Source Width &nbsp;
          <input id="srcWidthInput" type="number" defaultValue={this.props.node.srcWidth} onChange={(event) => {this.srcWidthChange(event);}} />
          <br/>
        </div>
      )
    }
  }


  renderSrcHeight() {
    if (!this.state.hasSrcHeightInput) {
      return (
        <div>
          Source Height &nbsp;
          <input id="srcHeightInput" type="number" defaultValue={this.props.node.srcHeight} onChange={(event) => {this.srcHeightChange(event);}} />
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Blit</div>
        <div style={{padding:'10px'}}>
          Position of image.<br/>
          {this.renderX()}
          {this.renderY()}

          {this.renderSrcX()}
          {this.renderSrcY()}

          {this.renderSrcWidth()}
          {this.renderSrcHeight()}
        </div>
      </div>
    )
  }
}

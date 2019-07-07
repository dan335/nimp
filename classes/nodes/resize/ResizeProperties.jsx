import React from 'react';

export default class ResizeProperties extends React.Component {

  constructor(props) {
    super(props);

    this.xChange = this.xChange.bind(this);
    this.yChange = this.yChange.bind(this);
    this.modeChange = this.modeChange.bind(this);
    this.xAutoChange = this.xAutoChange.bind(this);
    this.yAutoChange = this.yAutoChange.bind(this);
  }


  xChange(event) {
    const elm = document.getElementById('xInput');
    this.props.node.resizeX = Number(elm.value);
    this.props.node.run();
  }

  xAutoChange(event) {
    const elm = document.getElementById('xAutoInput');
    const e = document.getElementById('xInput');
    if (elm.checked) {
      this.props.node.resizeX = Jimp.AUTO;
      e.disabled = true;
    } else {
      e.disabled = false;
      this.props.node.resizeX = Number(e.value);
    }
    this.props.node.run();
  }


  yChange(event) {
    const elm = document.getElementById('yInput');
    this.props.node.resizeY = Number(elm.value);
    this.props.node.run();
  }

  yAutoChange(event) {
    const elm = document.getElementById('yAutoInput');
    const e = document.getElementById('yInput');
    if (elm.checked) {
      this.props.node.resizeY = Jimp.AUTO;
      e.disabled = true;
    } else {
      e.disabled = false;
      this.props.node.resizeY = Number(e.value);
    }
    this.props.node.run();
  }


  modeChange(event) {
    const elm = document.getElementById('modeInput');
    this.props.node.mode = elm.value;
    this.props.node.run();
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Resize</div>
        <div style={{padding:'5px'}}>
          X<br/>
          <input id="xAutoInput" type="checkbox" defaultChecked={this.props.node.resizeX == Jimp.AUTO} onChange={(event) => {this.xAutoChange(event)}}/> Auto<br/>

          <input id="xInput" type="number" min="1" defaultValue={this.props.node.resizeX == Jimp.AUTO ? 256 : this.props.node.resizeX} disabled={this.props.node.resizeX == Jimp.AUTO} onChange={(event) => {this.xChange(event);}} />
          <br/>
          <br/>

          Y<br/>
          <input id="yAutoInput" type="checkbox" defaultChecked={this.props.node.resizeY == Jimp.AUTO} onChange={(event) => {this.yAutoChange(event)}}/> Auto<br/>

          <input id="yInput" type="number" min="1" defaultValue={this.props.node.resizeY == Jimp.AUTO ? 256 : this.props.node.resizeY} disabled={this.props.node.resizeY == Jimp.AUTO} onChange={(event) => {this.yChange(event);}} />
          <br/>
          <br/>

          Mode<br/>
          <select id="modeInput" defaultValue={this.props.node.mode} onChange={(event) => {this.modeChange(event)}}>
            <option value={Jimp.RESIZE_NEAREST_NEIGHBOR}>Nearest Neighbor</option>
            <option value={Jimp.RESIZE_BILINEAR}>Bilinear</option>
            <option value={Jimp.RESIZE_BICUBIC}>Bicubic</option>
            <option value={Jimp.RESIZE_HERMITE}>Hermite</option>
            <option value={Jimp.RESIZE_BEZIER}>Bezier</option>
          </select>

        </div>
      </div>
    )
  }
}

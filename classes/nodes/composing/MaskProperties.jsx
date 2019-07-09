import React from 'react';

export default class MaskProperties extends React.Component {

  constructor(props) {
    super(props);

    this.xChange = this.xChange.bind(this);
    this.yChange = this.yChange.bind(this);
  }


  xChange(event) {
    const elm = document.getElementById('xInput');
    this.props.node.maskX = Number(elm.value);
    this.props.node.run();
  }

  yChange(event) {
    const elm = document.getElementById('yInput');
    this.props.node.maskY = Number(elm.value);
    this.props.node.run();
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Mask</div>
        <div style={{padding:'10px'}}>
          Position of image.<br/>
          X &nbsp;
          <input id="xInput" type="number" defaultValue={this.props.node.maskX} onChange={(event) => {this.xChange(event);}} />
          <br/>
          Y &nbsp;
          <input id="yInput" type="number" defaultValue={this.props.node.maskY} onChange={(event) => {this.yChange(event);}} />
        </div>
      </div>
    )
  }
}

import React from 'react';

export default class DisplaceProperties extends React.Component {

  constructor(props) {
    super(props);

    this.offsetChange = this.offsetChange.bind(this);
  }


  offsetChange(event) {
    const elm = document.getElementById('offsetInput');
    this.props.node.offset = Number(elm.value);
    this.props.node.run();
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Displace</div>
        <div style={{padding:'10px'}}>
          Displace the image pixels based on the provided displacement map.<br/>
          <br/>
          Offset &nbsp;
          <input id="offsetInput" type="number" defaultValue={this.props.node.offset} onChange={(event) => {this.offsetChange(event);}} />
        </div>
      </div>
    )
  }
}

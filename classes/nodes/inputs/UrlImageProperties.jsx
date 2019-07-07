import React from 'react';

export default class UrlImageProperties extends React.Component {

  constructor(props) {
    super(props);

    this.urlChange = this.urlChange.bind(this);
  }


  urlChange(event) {
    const elm = document.getElementById('urlInput');
    this.props.node.url = elm.value;
    this.props.node.run();
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Image from URL</div>
        <div style={{padding:'5px'}}>
          URL<br/>
          <input id="urlInput" type="text" style={{width:'100%'}} defaultValue={this.props.node.url} onChange={(event) => {this.urlChange(event);}} />
        </div>
      </div>
    )
  }
}

import Properties from '../Properties.js';

export default class UrlImageProperties extends Properties {

  constructor(props) {
    super(props);

    this.urlChange = this.urlChange.bind(this);
  }


  urlChange(event) {
    const elm = document.getElementById('urlInput');
    this.props.node.url = elm.value;
    this.props.node.run(null);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Image from URL</div>
        <div style={{padding:'10px'}}>
          URL<br/>
          <input id="urlInput" type="text" style={{width:'100%'}} defaultValue={this.props.node.url} onChange={(event) => {this.urlChange(event);}} />

          <br/><br/>
          If this fails it's probably because the remote site doesn't allow cross-origin resource sharing.  Some sites like <a href="https://imgur.com/">Imgur</a> allow it.
        </div>
      </div>
    )
  }
}

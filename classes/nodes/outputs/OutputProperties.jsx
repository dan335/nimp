import Properties from '../Properties.js';
import Jimp from 'jimp';


export default class OutputProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      base64: null
    }
  }


  componentDidMount() {
    this.props.node.setComponent(this);
    this.props.node.updateComponentWithBase64();
  }


  componentWillUnmount() {
    this.props.node.component = null;
  }


  typeChange() {
    const elm = document.getElementById('typeInput');
    this.props.node.type = elm.value;
    this.props.node.run();
  }


  downloadImage() {
    let a = document.createElement('a');
    switch(this.props.node.type) {
      case Jimp.MIME_JPEG:
        a.download = this.props.node.filename+'.jpg';
        break;
      case Jimp.MIME_PNG:
        a.download = this.props.node.filename+'.png';
        break;
      case Jimp.MIME_BMP:
        a.download = this.props.node.filename+'.bmp';
        break;
      case Jimp.MIME_TIFF:
        a.download = this.props.node.filename+'.tif';
        break;
    }
    a.href = this.state.base64;
    a.click();
  }


  renderLink() {
    if (this.state.base64) {
      return (
        <button onClick={this.downloadImage.bind(this)}>Download</button>
      )
    } else {
      return null;
    }
  }

  renderImage() {
    if (this.state.base64) {
      return (
        <img src={this.state.base64} style={{maxWidth:'100%', maxHeight:'100%'}}/>
      )
    } else {
      return null;
    }
  }


  filenameChange() {
    const elm = document.getElementById('filenameInput');
    this.props.node.filename = elm.value;
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Output</div>
        <div style={{padding:'10px'}}>
          Filename
          <br/>
          <input id="filenameInput" defaultValue={this.props.node.filename} onChange={(event) => {this.filenameChange(event)}} type="text" />.
          <select id="typeInput" defaultValue={this.props.node.type} onChange={(event) => {this.typeChange(event);}}>
            <option value={Jimp.MIME_JPEG}>JPG</option>
            <option value={Jimp.MIME_PNG}>PNG</option>
            <option value={Jimp.MIME_BMP}>BMP</option>
            <option value={Jimp.MIME_TIFF}>TIF</option>
          </select>

          <br/><br/>
          {this.renderLink()}
          <br/><br/>
          {this.renderImage()}
          <br/><br/>
          If you get an error when downloading right click on image and save as.
        </div>
      </div>
    )
  }
}

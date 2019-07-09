import React from 'react';

export default class GreyscaleProperties extends React.Component {

  constructor(props) {
    super(props);

    this.onUploadImage = this.onUploadImage.bind(this);
  }


  onUploadImage(event) {
    const elm = document.getElementById('uploadInput');
    const reader = new FileReader();

    reader.addEventListener('load', (e) => {
      this.props.node.base64 = e.target.result;
      this.props.node.run();
    })

    reader.readAsDataURL(elm.files[0]);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Image Upload</div>
        <div style={{padding:'10px'}}>
          <input id="uploadInput" style={{width:'100%'}} type="file" onChange={(event) => {this.onUploadImage(event);}} />
        </div>
      </div>
    )
  }
}

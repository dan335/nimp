import React from 'react';

export default class GreyscaleProperties extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      progress: null
    }

    this.onUploadImage = this.onUploadImage.bind(this);
  }


  onUploadImage(event) {
    const elm = document.getElementById('uploadInput');
    const reader = new FileReader();

    // reader.addEventListener('load', (e) => {
    //   this.props.node.base64 = e.target.result;
    //   this.props.node.run();
    // })

    reader.onloadstart = (event) => {
      this.setState({progress: 0});
    }

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        this.setState({progress: event.loaded / event.total * 100});
      }
    }

    reader.onloadend = (event) => {
      this.setState({progress: null});
      this.props.node.base64 = event.target.result;
      this.props.node.run();
    }

    reader.readAsDataURL(elm.files[0]);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Image Upload</div>
        <div style={{padding:'10px'}}>
          <input id="uploadInput" style={{width:'100%'}} type="file" onChange={(event) => {this.onUploadImage(event);}} />
          <br/><br/>
          {this.state.progress != null ?
            Math.round(this.state.progress)+'% Uploaded'
          : null}
        </div>
      </div>
    )
  }
}

import Properties from '../Properties.js';

export default class DitherProperties extends Properties {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Dither Image</div>
        <div style={{padding:'10px'}}>
          Apply a dither effect to an image.
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

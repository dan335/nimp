import Properties from '../Properties.js';

export default class SepiaProperties extends Properties {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Sobel Filter</div>
        <div style={{padding:'10px'}}>
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

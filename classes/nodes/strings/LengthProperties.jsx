import Properties from '../Properties.js';

export default class LengthProperties extends Properties {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Length a String</div>
        <div style={{padding:'10px'}}>
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

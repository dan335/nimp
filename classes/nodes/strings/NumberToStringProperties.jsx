import Properties from '../Properties.js';

export default class NumberToStringProperties extends Properties {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Number to String</div>
        <div style={{padding:'10px'}}>
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

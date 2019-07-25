import Properties from '../Properties.js';

export default class ChannelSplitProperties extends Properties {

  constructor(props) {
    super(props);
  }



  render() {
    return (
      <div>
        <div className="propertiesTitle">Channel Split</div>
        <div style={{padding:'10px'}}>

          {this.renderRun()}
        </div>
      </div>
    )
  }
}

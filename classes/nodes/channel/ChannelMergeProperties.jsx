import Properties from '../Properties.js';

export default class ChannelMergeProperties extends Properties {

  constructor(props) {
    super(props);
  }



  render() {
    return (
      <div>
        <div className="propertiesTitle">Channel Merge</div>
        <div style={{padding:'10px'}}>

          {this.renderRun()}
        </div>
      </div>
    )
  }
}

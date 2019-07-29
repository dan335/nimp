import Properties from '../Properties.js';

export default class PasteImageProperties extends Properties {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Image from Clipboard</div>
        <div style={{padding:'10px'}}>
          When this node is selected it captures images that are pasted.
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

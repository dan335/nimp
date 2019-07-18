import Properties from '../Properties.js';

export default class PiProperties extends Properties {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Pi</div>

        <div style={{padding:'10px'}}>
          {this.props.node.number}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

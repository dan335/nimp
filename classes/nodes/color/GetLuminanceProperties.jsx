import Properties from '../Properties.js';

export default class GetLuminanceProperties extends Properties {

  constructor(props) {
    super(props);
  }


  stringChange(event) {
    const elm = document.getElementById('stringInput');
    this.props.node.string = elm.value;
    this.props.node.run(null);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Luminance From Color</div>

        <div style={{padding:'10px'}}>
          0 - 1
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

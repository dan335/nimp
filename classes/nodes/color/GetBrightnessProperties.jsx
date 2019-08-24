import Properties from '../Properties.js';

export default class GetBrightnessProperties extends Properties {

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
        <div className="propertiesTitle">Brightness From Color</div>

        <div style={{padding:'10px'}}>
          0 - 255
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

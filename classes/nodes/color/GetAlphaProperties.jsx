import Properties from '../Properties.js';

export default class GetAlphaProperties extends Properties {

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
        <div className="propertiesTitle">Alpha Value From Color</div>

        <div style={{padding:'10px'}}>
          0 - 1
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

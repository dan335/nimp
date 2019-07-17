import Properties from '../Properties.js';

export default class ColorInputProperties extends Properties {

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
        <div className="propertiesTitle">HSV Input</div>

        <div style={{padding:'10px'}}>
          Color<br/>
          <input type="text" id="stringInput" defaultValue={this.props.node.string} onChange={(event) => {this.stringChange(event)}} />
          <br/><br/>
          Examples of Possible Values<br/>
          <ul>
            <li>#fff or #ffffff</li>
            <li>rgb (255, 0, 0)</li>
            <li>hsl(0, 100%, 50%)</li>
            <li>hsv 0 1 1</li>
            <li>red</li>
          </ul>

          See <a href="https://www.npmjs.com/package/tinycolor2">Tinycolor</a> for all options.
        </div>
      </div>
    )
  }
}

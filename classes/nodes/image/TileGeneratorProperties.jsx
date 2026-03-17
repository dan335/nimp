import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class TileGeneratorProperties extends Properties {

  constructor(props) {
    super(props);

    this.modeChange = this.modeChange.bind(this);
  }

  modeChange(event) {
    const elm = document.getElementById('tileGeneratorMode');
    this.props.node.mode = elm.value;
    this.props.node.run(null);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Tile Generator</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[0]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[1]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Tile Size" varName={'tileSize'} input={this.props.node.inputs[2]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Gap" varName={'gap'} input={this.props.node.inputs[3]} min={0} step={1} />

          <br/>

          Mode.<br/>
          <select id="tileGeneratorMode" defaultValue={this.props.node.mode} onChange={(event) => {this.modeChange(event)}}>
            <option value="brick">Brick</option>
            <option value="herringbone">Herringbone</option>
            <option value="basketWeave">Basket Weave</option>
            <option value="hexagon">Hexagon</option>
          </select>
          <br/>
          <br/>

          {this.renderRun()}
        </div>
      </div>
    )
  }
}

import Properties from '../Properties.js';
import Jimp from 'jimp';


export default class SimplexProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasWidth: props.node.inputs[0].parent ? true : false,
      hasHeight: props.node.inputs[1].parent ? true : false,
      hasSeed: props.node.inputs[2].parent ? true : false,
      hasScale: props.node.inputs[3].parent ? true : false
    }

    this.widthChange = this.widthChange.bind(this);
    this.heightChange = this.heightChange.bind(this);
    this.seedChange = this.seedChange.bind(this);
    this.scaleChange = this.scaleChange.bind(this);
  }

  widthChange() {
    const elm = document.getElementById('widthInput');
    this.props.node.width = Number(elm.value);
    this.props.node.run(null);
  }

  heightChange() {
    const elm = document.getElementById('heightInput');
    this.props.node.height = Number(elm.value);
    this.props.node.run(null);
  }

  seedChange() {
    const elm = document.getElementById('seedInput');
    this.props.node.seed = Number(elm.value);
    this.props.node.run(null);
  }

  scaleChange() {
    const elm = document.getElementById('scaleInput');
    this.props.node.scale = Number(elm.value);
    this.props.node.run(null);
  }

  renderWidth() {
    if (!this.state.hasWidth) {
      return (
        <div>
          Width<br/>
          <input id="widthInput" type="number" min="1" defaultValue={this.props.node.width} onChange={(event) => {this.widthChange(event);}} />
          <br/><br/>
        </div>
      )
    }
  }

  renderHeight() {
    if (!this.state.hasHeight) {
      return (
        <div>
          Height<br/>
          <input id="heightInput" type="number" min="1" defaultValue={this.props.node.height} onChange={(event) => {this.heightChange(event);}} />
          <br/>
        </div>
      )
    }
  }

  renderSeed() {
    if (!this.state.hasSeed) {
      return (
        <div>
          Seed<br/>
          <input id="seedInput" type="number" defaultValue={this.props.node.seed} onChange={(event) => {this.seedChange(event);}} />
          <br/>
        </div>
      )
    }
  }

  renderScale() {
    if (!this.state.hasScale) {
      return (
        <div>
          Scale<br/>
          <input id="scaleInput" type="number" defaultValue={this.props.node.scale} min="0.00001" max="5" step="0.01" onChange={(event) => {this.scaleChange(event);}} />
          <br/>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Simplex Noise</div>
        <div style={{padding:'10px'}}>
          {this.renderWidth()}
          {this.renderHeight()}

          <br/><br/>

          {this.renderSeed()}
          <br/>
          {this.renderScale()}
        </div>
      </div>
    )
  }
}

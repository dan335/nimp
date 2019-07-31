import Properties from '../Properties.js';
import Jimp from 'jimp';


export default class TextProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasWidthInput: props.node.inputs[0].parent ? true : false,
      hasHeightInput: props.node.inputs[1].parent ? true : false,
      hasWidth: props.node.hasWidth,
      hasHeight: props.node.hasHeight
    }
  }

  textChange() {
    const elm = document.getElementById('textInput');
    this.props.node.text = elm.value;
    this.props.node.run(null);
  }

  fontChange() {
    const elm = document.getElementById('fontInput');
    this.props.node.font = elm.value;
    this.props.node.run(null);
  }

  alignmentXChange() {
    const elm = document.getElementById('alignmentXInput');
    this.props.node.alignmentX = Number(elm.value);
    this.props.node.run(null);
  }

  alignmentYChange() {
    const elm = document.getElementById('alignmentYInput');
    this.props.node.alignmentY = Number(elm.value);
    this.props.node.run(null);
  }

  onHasWidthChange() {
    const elm = document.getElementById('hasWidthCheckbox');
    this.props.node.hasWidth = elm.checked;
    this.setState({hasWidth:elm.checked});
    this.props.node.run(null);
  }

  onWidthChange() {
    const elm = document.getElementById('widthInput');
    this.props.node.width = Number(elm.value);
    this.props.node.run(null);
  }

  onHasHeightChange() {
    const elm = document.getElementById('hasHeightCheckbox');
    this.props.node.hasHeight = elm.checked;
    this.setState({hasHeight:elm.checked});
    this.props.node.run(null);
  }

  onHeightChange() {
    const elm = document.getElementById('heightInput');
    this.props.node.height = Number(elm.value);
    this.props.node.run(null);
  }

  renderWidth() {
    if (!this.state.hasWidthInput) {
      return (
        <div>
          <label>Width</label>
          &nbsp;&nbsp;
          <input type="checkbox" defaultValue={this.props.node.hasWidth} id="hasWidthCheckbox" onChange={this.onHasWidthChange.bind(this)} />
          {this.state.hasWidth && (
            <div>
              <input type="number" defaultValue={this.props.node.width} id="widthInput" onChange={this.onWidthChange.bind(this)} />
            </div>
          )}
          <br/><br/>
        </div>
      )
    }
  }

  renderHeight() {
    if (!this.state.hasHeightInput) {
      return (
        <div>
          <label>Height</label>
          &nbsp;&nbsp;
          <input type="checkbox" defaultValue={this.props.node.hasHeight} id="hasHeightCheckbox" onChange={this.onHasHeightChange.bind(this)} />
          {this.state.hasHeight && (
            <div>
              <input type="number" defaultValue={this.props.node.height} id="heightInput" onChange={this.onHeightChange.bind(this)} />
            </div>
          )}
        </div>
      )
    }
  }




  render() {
    return (
      <div>
        <div className="propertiesTitle">Text</div>
        <div style={{padding:'10px'}}>
          <label>Text</label>
          <textarea id="textInput" defaultValue={this.props.node.text} onChange={this.textChange.bind(this)}></textarea>
          <br/><br/>

          <label>Font</label><br/>
          <select id="fontInput" defaultValue={this.props.node.font} onChange={this.fontChange.bind(this)}>
            <option value='/static/fonts/open-sans/open-sans-8-black/open-sans-8-black.fnt'>Open Sans 8 Black</option>
            <option value='/static/fonts/open-sans/open-sans-8-white/open-sans-8-white.fnt'>Open Sans 8 White</option>
            <option value='/static/fonts/open-sans/open-sans-10-black/open-sans-10-black.fnt'>Open Sans 10 Black</option>
            <option value='/static/fonts/open-sans/open-sans-12-black/open-sans-12-black.fnt'>Open Sans 12 Black</option>
            <option value='/static/fonts/open-sans/open-sans-14-black/open-sans-14-black.fnt'>Open Sans 14 Black</option>
            <option value='/static/fonts/open-sans/open-sans-16-black/open-sans-16-black.fnt'>Open Sans 16 Black</option>
            <option value='/static/fonts/open-sans/open-sans-16-white/open-sans-16-white.fnt'>Open Sans 16 White</option>
            <option value='/static/fonts/open-sans/open-sans-32-black/open-sans-32-black.fnt'>Open Sans 32 Black</option>
            <option value='/static/fonts/open-sans/open-sans-32-white/open-sans-32-white.fnt'>Open Sans 32 White</option>
            <option value='/static/fonts/open-sans/open-sans-64-black/open-sans-64-black.fnt'>Open Sans 64 Black</option>
            <option value='/static/fonts/open-sans/open-sans-64-white/open-sans-64-white.fnt'>Open Sans 64 White</option>
            <option value='/static/fonts/open-sans/open-sans-128-black/open-sans-128-black.fnt'>Open Sans 128 Black</option>
            <option value='/static/fonts/open-sans/open-sans-128-white/open-sans-128-white.fnt'>Open Sans 128 White</option>
          </select>
          <br/><br/>

          <label>Horizontal Alignment</label><br/>
          <select id="alignmentXInput" defaultValue={this.props.node.alignmentX} onChange={this.alignmentXChange.bind(this)}>
            <option value={Jimp.HORIZONTAL_ALIGN_LEFT}>Left</option>
            <option value={Jimp.HORIZONTAL_ALIGN_CENTER}>Center</option>
            <option value={Jimp.HORIZONTAL_ALIGN_RIGHT}>Right</option>
          </select>
          <br/><br/>

          <label>Vertical Alignment</label><br/>
          <select id="alignmentYInput" defaultValue={this.props.node.alignmentY} onChange={this.alignmentYChange.bind(this)}>
            <option value={Jimp.VERTICAL_ALIGN_TOP}>Top</option>
            <option value={Jimp.VERTICAL_ALIGN_MIDDLE}>Middle</option>
            <option value={Jimp.VERTICAL_ALIGN_BOTTOM}>Bottom</option>
          </select>
          <br/><br/>

          {this.renderWidth()}
          {this.renderHeight()}
          {this.renderRun()}
        </div>

        <style jsx>{`
          textarea {
            width: 100%;
            min-height: 100px;
          }
        `}</style>
      </div>
    )
  }
}

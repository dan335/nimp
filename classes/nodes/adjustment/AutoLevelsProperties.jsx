import Properties from '../Properties.js';

export default class AutoLevelsProperties extends Properties {
  render() {
    return (
      <div>
        <div className="propertiesTitle">Auto Levels</div>
        <div style={{padding:'10px'}}>
          <div>Automatically adjusts levels to use the full 0-255 range per channel.</div>
          {this.renderRun()}
        </div>
      </div>
    )
  }
}

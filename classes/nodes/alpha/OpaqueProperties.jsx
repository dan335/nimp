import Properties from '../Properties.js';

export default class OpaqueProperties extends Properties {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Opaque</div>
        <div style={{padding:'10px'}}>
          Set the alpha channel of every pixel to be opaque.
        </div>
      </div>
    )
  }
}

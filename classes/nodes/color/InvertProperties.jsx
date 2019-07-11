import Properties from '../Properties.js';

export default class InvertProperties extends Properties {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Invert Colors</div>
      </div>
    )
  }
}

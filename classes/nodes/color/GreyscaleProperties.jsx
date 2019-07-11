import Properties from '../Properties.js';

export default class GreyscaleProperties extends Properties {

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Convert to Greyscale</div>
      </div>
    )
  }
}

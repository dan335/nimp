import NodeImage from '../NodeImage.js';
import LoopProperties from './LoopProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import LoopInputNumberNumLoops from './LoopInputNumberNumLoops.js';
import OutputNumber from '../OutputNumber.js';
import LoopInputImageLoopOutput from './LoopInputImageLoopOutput.js';
import LoopOutputImageLoopInput from './LoopOutputImageLoopInput.js'

export default class Loop extends NodeImage {
  constructor(graph, x, y) {
    super(graph, x, y, 'Loop', LoopProperties);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new LoopInputNumberNumLoops(this, 1, 'Num Loops'),
      new LoopInputImageLoopOutput(this, 2, 'Loop End'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Loop Num'),
      new LoopOutputImageLoopInput(this, 2, 'Loop Start')
    ];

    this.numLoops = 1;
    this.loopIndex = null;
  }


  run(inputThatTriggered) {

    if (this.inputs[0].image && !isNaN(this.numLoops) && this.outputs[2].connections.length && this.inputs[2].parent) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let numLoops = this.numLoops;

      if (this.inputs[1].number != null) {
        numLoops = this.inputs[1].number;
      }

      numLoops = Math.max(1, numLoops);

      if (this.loopIndex == null) {
        // start loop
        this.loopIndex = 0;

        this.outputs[1].connections.forEach(conn => {
          conn.number = this.loopIndex;
          conn.runNode();
        })

        this.outputs[2].connections.forEach(conn => {
          if (this.inputs[0].image) {
            Jimp.read(this.inputs[0].image).then(image => {
              conn.image = image;
              conn.runNode();
            })
          } else {
            conn.image = null;
            conn.runNode();
          }
        })

      } else {
        if (this.loopIndex >= numLoops-1) {
          // end loop
          this.loopIndex = null;
          if (this.inputs[2].image) {
            this.image = this.inputs[2].image;
          } else {
            this.image = null;
          }
          super.run(inputThatTriggered);

        } else {
          // continue loop
          this.loopIndex++;

          this.outputs[1].connections.forEach(conn => {
            conn.number = this.loopIndex;
            conn.runNode();
          })

          if (this.inputs[2].image) {
            Jimp.read(this.inputs[2].image).then(image => {
              this.outputs[2].connections.forEach(conn => {
                conn.image = image;
                conn.runNode();
              })
            })
          } else {
            this.outputs[2].connections.forEach(conn => {
              conn.image = null;
              conn.runNode();
            })
          }
        }
      }

    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  passToChildren() {
    if (this.outputs[0].connections.length) {
      this.outputs[0].connections.forEach(conn => {
        if (this.image) {
          conn.image = this.image;
          conn.runNode();
        } else {
          conn.image = null;
          conn.runNode();
        }
      })
    }
  }
}

import NodeImage from '../NodeImage.js';
import LoopProperties from './LoopProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import LoopInputNumberNumLoops from './LoopInputNumberNumLoops.js';
import OutputNumber from '../OutputNumber.js';
import LoopInputImageLoopOutput from './LoopInputImageLoopOutput.js';
import LoopOutputImageLoopInput from './LoopOutputImageLoopInput.js'

export default class Loop extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Loop', LoopProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new LoopInputNumberNumLoops(this, 1, 'Num Loops'),
      new LoopInputImageLoopOutput(this, 2, 'Loop End'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Increment'),
      new LoopOutputImageLoopInput(this, 2, 'Loop Start')
    ];

    this.isRunning = false;

    this.numLoops = typeof settings.numLoops !== 'undefined' ? settings.numLoops : 1;
  }


  toJson() {
    let json = super.toJson();

    json.settings.numLoops = this.numLoops;

    return json;
  }


  run(inputThatTriggered) {

    if (inputThatTriggered == this.inputs[0] || inputThatTriggered == this.inputs[1]) {

      if (!this.isRunning) {

        // start running
        if (this.inputs[0].image && !isNaN(this.numLoops) && this.outputs[2].connections.length && this.inputs[2].parent) {

          this.isRunning = true;
          this.bg.classList.add('running');
          this.runTimer = Date.now();

          if (this.isInsideALoop) {
            this.runLoop();
          } else {
            // add delay so that running color shows up
            setTimeout(() => {
              this.runLoop(inputThatTriggered);
            }, 0);
          }

        } else {
          this.runTimer = Date.now();
          this.image = null;
          super.run(inputThatTriggered);
        }
      }
    } else {
      // called from loop end input
      // do nothing if running
      // if not running run
      //
      // can cause infinite loop
      //
      // if (!this.isRunning) {
      //   this.run(this.inputs[0]);
      // }
    }
  }


  runLoop(inputThatTriggered) {
    let numLoops = this.numLoops;
    if (this.inputs[1].number != null) {
      numLoops = this.inputs[1].number;
    }
    numLoops = Math.max(1, numLoops);

    for (let n = 0; n < numLoops; n++) {

      let image;
      if (n == 0) {
        image = this.inputs[0].image.clone();
      } else {
        if (this.inputs[2].image) {
          image = this.inputs[2].image.clone();
        } else {
          image = null;
        }
      }

      // run loop num output
      this.outputs[1].connections.forEach(input => {
        input.number = n;
        input.runNode();
      })

      // run loop start output
      this.outputs[2].connections.forEach(input => {
        if (image) {
          input.image = image;
          input.runNode();
        } else {
          input.image = null;
          input.runNode();
        }
      })
    }

    // loop finished
    // get loop end image and set image
    if (this.inputs[2].image) {
      this.image = this.inputs[2].image.clone();
    } else {
      this.image = null;
    }
    super.run(inputThatTriggered);

    this.isRunning = false;
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

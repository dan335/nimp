import MainLayout from '../layouts/MainLayout.js';
import Graph from '../classes/Graph.js';
import settings from '../lib/settings.js';
import functions from '../lib/functions.js';

// dragging svg
// https://css-tricks.com/creating-a-panning-effect-for-svg/

export default class Index extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      mouseState: null,
      properties: null,
    }

    this.svgIsPointerDown = false;
    this.svgPointerOrigin = {x:0, y:0};
    this.svgZoom = 1;

    this.startDraggingNewNode = this.startDraggingNewNode.bind(this);
    this.createNewNode = this.createNewNode.bind(this);
  }


  componentDidMount() {
    this.svg = document.getElementById('svg');

    this.svgViewBox = {
      x: 0,
      y: 0,
      width: this.svg.clientWidth,
      height: this.svg.clientHeight
    }

    this.svgNewViewBox = {x:0, y:0};

    this.svgRatio = this.svgViewBox.width / this.svg.getBoundingClientRect().width;

    const viewBoxString = `${this.svgNewViewBox.x} ${this.svgNewViewBox.y} ${this.svgViewBox.width} ${this.svgViewBox.height}`;
    this.svg.setAttribute('viewBox', viewBoxString);

    window.addEventListener("resize", this.resize.bind(this));
    //window.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.resize();

    this.graph = new Graph(this.svg, this);

    if (window.PointerEvent) {
      this.svg.addEventListener('pointerdown', this.svgOnMouseDown.bind(this));
      this.svg.addEventListener('pointerup', this.svgOnMouseUp.bind(this));
      this.svg.addEventListener('pointerleave', this.svgOnMouseLeave.bind(this));
      this.svg.addEventListener('pointermove', this.svgOnMouseMove.bind(this));
    } else {
      this.svg.addEventListener('mousedown', this.svgOnMouseDown.bind(this));
      this.svg.addEventListener('mouseup', this.svgOnMouseUp.bind(this));
      this.svg.addEventListener('mouseleave', this.svgOnMouseLeave.bind(this));
      this.svg.addEventListener('mousemove', this.svgOnMouseMove.bind(this));

      this.svg.addEventListener('touchstart', this.svgOnMouseDown.bind(this));
      this.svg.addEventListener('touchend', this.svgOnMouseUp.bind(this));
      this.svg.addEventListener('touchmove', this.svgOnMouseMove.bind(this));
    }

    this.svg.addEventListener('wheel', this.svgOnWheel.bind(this));
  }


  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }


  resize() {
    const elm = document.getElementById('mainContainer');
    if (elm) {
      elm.style.height = window.innerHeight + 'px';
    }

    // this.svgRatio = this.svgViewBox.width / this.svg.getBoundingClientRect().width;

    // this.svgViewBox.width = this.svg.clientWidth;
    // this.svgViewBox.height = this.svg.clientHeight;
  }


  svgOnWheel(event) {
    const delta = Math.sign(event.deltaY);
    this.svgViewBox.width *= 1 + delta * 0.05;
    this.svgViewBox.height *= 1 + delta * 0.05;
    this.svgZoom *= 1 + delta * 0.05;

    const viewBoxString = `${this.svgNewViewBox.x} ${this.svgNewViewBox.y} ${this.svgViewBox.width} ${this.svgViewBox.height}`;
    this.svg.setAttribute('viewBox', viewBoxString);
  }


  svgOnMouseDown(event) {
    if (event.target.tagName != 'svg') return;

    const pointerPosition = functions.getPointFromEvent(event);
    this.svgPointerOrigin.x = pointerPosition.x;
    this.svgPointerOrigin.y = pointerPosition.y;
    this.svgIsPointerDown = true;
  }

  svgOnMouseUp(event) {
    if (event.target.tagName != 'svg') return;

    this.svgIsPointerDown = false;
    this.svgViewBox.x = this.svgNewViewBox.x;
    this.svgViewBox.y = this.svgNewViewBox.y;
  }

  svgOnMouseLeave(event) {
    this.svgIsPointerDown = false;
    this.svgViewBox.x = this.svgNewViewBox.x;
    this.svgViewBox.y = this.svgNewViewBox.y;
  }

  svgOnMouseMove(event) {
    if (event.target.tagName != 'svg') return;

    if (!this.svgIsPointerDown) return;

    event.preventDefault();

    const pointerPosition = functions.getPointFromEvent(event);

    this.svgNewViewBox.x = this.svgViewBox.x - ((pointerPosition.x - this.svgPointerOrigin.x) * this.svgRatio * this.svgZoom);

    this.svgNewViewBox.y = this.svgViewBox.y - ((pointerPosition.y - this.svgPointerOrigin.y) * this.svgRatio * this.svgZoom);

    const viewBoxString = `${this.svgNewViewBox.x} ${this.svgNewViewBox.y} ${this.svgViewBox.width} ${this.svgViewBox.height}`;
    this.svg.setAttribute('viewBox', viewBoxString);
  }


  renderNodeButtons() {
    return settings.nodes.map(node => {
      return this.renderNodeButton(node);
    })
  }

  renderNodeButton(node) {
    return (
      <div key={node.name} className="nodeButtonContainer">
        <div className="nodeButton" onMouseEnter={(event) => {event.target.nextSibling.classList.add('show')}} onMouseLeave={() => {event.target.nextSibling.classList.remove('show')}} onMouseDown={() => {this.startDraggingNewNode(node)}}>
          {node.name}
        </div>
        <div className="nodeButtonDrag">drag >></div>
      </div>
    )
  }

  startDraggingNewNode(node) {
    this.setState({
      mouseState: {
        type: 'draggingNewNode',
        data: node
      }
    })
  }

  onMouseUpSvg(event) {
    event.stopPropagation();
    if (this.state.mouseState) {
      if (this.state.mouseState.type == 'draggingNewNode') {
        const svgPos = functions.getPointOnSvg(event, this.svg);

        this.createNewNode(this.state.mouseState.data.classObject, svgPos.x, svgPos.y);
        this.setState({mouseState:null});
      }
    }
  }


  createNewNode(classObject, x, y) {
    this.graph.createNode(classObject, x, y);
  }


  renderProperties() {
    if (this.state.properties) {
      const Properties = this.state.properties.component;
      return (
        <Properties node={this.state.properties.node} />
      );
    } else {
      return null;
    }
  }


  render() {
    return (
      <div>
        <MainLayout>
          <div id="mainContainer">
            <div id="topContainer">NIMP <span style={{color:'hsl(0, 0%, 60%)'}}> &nbsp; (Node Based Image Manipulation Program)</span></div>
            <div id="midContainer">
              <div id="midLeftContainer">
                <div className="nodeButtonHeader">Nodes</div>
                {this.renderNodeButtons()}
              </div>
              <div id="innerMidContainer">
                <div id="svgContainer">
                  <svg id="svg" version="1.1" onMouseUp={(event) => {this.onMouseUpSvg(event)}} xmlns="http://www.w3.org/2000/svg" />
                  <div id="svgHelpText">Click: Select &nbsp;&nbsp; Double Click: Select and View</div>
                </div>
                <div id="viewContainer">
                  <img id="nodeViewImage" style={{maxHeight:'100%',maxWidth:'100%',display:'block'}} />
                </div>
              </div>

              <div id="midRightContainer">
                {this.renderProperties()}
              </div>
            </div>
          </div>
        </MainLayout>

        <style jsx global>{`
          #topContainer {
            line-height: 30px;
            padding-left: 5px;
            background-color: hsl(209, 10%, 25%);
          }
          #mainContainer {
            display: grid;
            grid-template-rows: 30px auto;
          }

          #midLeftContainer {
            border-right: 2px solid #000;
          }

          #midRightContainer {
            border-left: 2px solid #000;
          }

          #midContainer {
            display: grid;
            grid-template-columns: 160px auto 280px;
          }

          #viewContainer {
            background-color: hsl(209, 10%, 8%);
          }

          #innerMidContainer {
            display: grid;
            grid-template-rows: 1fr 1fr;
          }

          #svgContainer {
            background-color: hsl(209, 10%, 10%);
            position: relative;
          }

          #svgHelpText {
            position: absolute;
            right: 10px;
            bottom: 10px;
            color: hsl(209, 10%, 60%);
            font-size: 90%;
          }

          #svg {
            width: 100%;
            height: 100%;
          }

          .nodeButtonHeader {
            padding: 5px;
            margin-bottom: 2px;
            background-color: hsl(209, 10%, 5%);
          }

          .nodeButtonContainer {
            position: relative;
          }

          .nodeButton {
            padding: 5px;
            background-color: hsl(209, 10%, 40%);
            margin-bottom: 2px;
            cursor: pointer;
          }

          .nodeButtonDrag {
            position: absolute;
            right: -55px;
            top: 5px;
            display:none;
            color: hsl(209, 10%, 60%);
            z-index: 1;
          }

          .nodeButtonDrag.show {
            display:block;
          }

          .nodeBg {
            stroke-linejoin: round;
          }

          .nodeBg.viewed {
            stroke: hsl(209, 10%, 90%);
            stroke-width: 3px;
            stroke-dasharray: 5;
          }

          .nodeBg.selected {
            stroke: hsl(209, 10%, 90%);
            stroke-width: 3px;
          }

          .nodeBg.selected.viewed {
            stroke-dasharray: none;
          }

          .propertiesTitle {
            padding: 10px;
            background-color: hsl(209, 10%, 5%);
          }

          .nodeConnection {
            fill: hsl(209, 10%, 60%);
            stroke: hsl(209, 10%, 90%);
            stroke-width: 2px;
          }

          .nodeConnectionSpline {
            stroke: #fff;
            fill: none;
            stroke-width: 2px;
            pointer-events: visible;
          }
        `}</style>
      </div>
    )
  }
}

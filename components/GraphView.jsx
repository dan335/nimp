import Graph from '../classes/Graph.js';
import settings from '../lib/settings.js';
import functions from '../lib/functions.js';
import GraphProperties from '../components/GraphProperties.jsx';
import TopBar from '../components/TopBar.jsx';
import Head from 'next/head';

// dragging svg
// https://css-tricks.com/creating-a-panning-effect-for-svg/

export default class GraphView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseState: null,
      properties: null,
      propertiesKey: Math.random(),  // force react to replace properties
      category: 'Image'
    }

    this.svgIsPointerDown = false;
    this.svgPointerDownTime = 0;
    this.svgPointerOrigin = {x:0, y:0};
    this.svgZoom = 1;

    this.startDraggingNewNode = this.startDraggingNewNode.bind(this);
    this.createNewNode = this.createNewNode.bind(this);

    this.graphProperties = null;  // link to GraphProperties.jsx
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

    if (this.props.graphToLoad) {
      this.graph.fromJson(this.props.graphToLoad.graph);
      this.graph.title = this.props.graphToLoad.title;
      this.graph.slug = this.props.graphToLoad.slug;
      this.graph.url = this.props.graphToLoad.url;
      this.graph.userId = this.props.graphToLoad.userId;
      this.graph.isPublic = this.props.graphToLoad.isPublic;
      this.graph.anyoneCanOverwrite = this.props.graphToLoad.anyoneCanOverwrite;

      this.setState({propertiesKey:Math.random()})  // re-render properties
    }

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

    fetch('/api/viewgraph', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
      body: JSON.stringify({
        graphId: this.graph.id
      })
    })
  }


  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }


  resize() {
    const elm = document.getElementById('mainContainer');
    if (elm) {
      elm.style.height = window.innerHeight + 'px';
    }
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
    this.svgPointerDownTime = new Date().getTime()
  }

  svgOnMouseUp(event) {
    // stop dragging
    this.svgIsPointerDown = false;
    this.svgViewBox.x = this.svgNewViewBox.x;
    this.svgViewBox.y = this.svgNewViewBox.y;

    //if (event.target.tagName != 'svg') return;

    event.stopPropagation();

    let isClick = true;

    if (this.state.mouseState) {
      if (this.state.mouseState.type == 'draggingNewNode') {
        const svgPos = functions.getPointOnSvg(event, this.svg);

        this.createNewNode(this.state.mouseState.data.className, this.state.mouseState.data.classObject, svgPos.x, svgPos.y);
        this.setState({mouseState:null});
        this.isClick = false;
      }
    }

    if (isClick) {
      if (new Date().getTime() - this.svgPointerDownTime < 400) {
        const pointerPosition = functions.getPointFromEvent(event);
        let a = this.svgPointerOrigin.x - pointerPosition.x;
        let b = this.svgPointerOrigin.y - pointerPosition.y;
        let distance = Math.sqrt(a*a+b*b);
        if (distance < 5) {
          // show graph properties
          if (this.graph.selectedNode) {
            this.graph.selectedNode.deselect();
          }
        }
      }
    }
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


  renderCategoryButtons() {
    return settings.nodes.map(category => {
      return this.renderCategoryButton(category);
    })
  }


  renderCategoryButton(category) {
    return (
      <div key={category.title} className={'nodeButton ' + (category.title == this.state.category ? 'active' : '')} onClick={() => {this.setState({category:category.title})}}>
        {category.title}
      </div>
    )
  }


  renderNodeButtons() {
    const category = settings.nodes.find(c => {
      return c.title == this.state.category;
    })

    if (category) {
      return category.nodes.map(node => {
        return this.renderNodeButton(node);
      })
    }
  }

  renderNodeButton(node) {
    return (
      <div key={node.title} className="nodeButtonContainer">
        <div className="nodeButton" onMouseEnter={(event) => {event.target.nextSibling.classList.add('show')}} onMouseLeave={() => {event.target.nextSibling.classList.remove('show')}} onMouseDown={() => {this.startDraggingNewNode(node)}}>
          {node.title}
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


  createNewNode(className, classObject, x, y) {
    const node = this.graph.createNode(className, classObject, x, y, {});
    this.graph.selectNode(node);
    this.graph.viewNode(node);
  }


  renderGraphProperties() {
    if (!this.state.properties) {
      return (
        <GraphProperties user={this.props.user} graph={this.graph} key={this.state.propertiesKey} indexComponent={this} />
      )
    }
  }


  renderProperties() {
    if (this.state.properties && this.state.propertiesKey) {
      const Properties = this.state.properties.component;
      return (
        <Properties node={this.state.properties.node} key={this.state.propertiesKey} />
      );
    } else {
      return null;
    }
  }


  render() {
    return (
      <div>
        <div id="mainContainer">
          <TopBar user={this.props.user} />

          <div id="midContainer">
            <div id="midLeftContainer">
              <div id="midLeftCategories">
                <div className="nodeButtonHeader">Categories</div>
                {this.renderCategoryButtons()}
              </div>
              <div id="midLeftNodes">
                <div className="nodeButtonHeader">{this.state.category} Nodes</div>
                {this.renderNodeButtons()}
              </div>
            </div>
            <div id="innerMidContainer">
              <div id="svgContainer">
                <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="hsl(209, 10%, 30%)" strokeWidth="1"/>
                    </pattern>
                  </defs>

                  <rect width="5000" height="5000" fill="url(#grid)" x="-2500" y="-2500" pointerEvents="none" />
                </svg>
                <div id="svgHelpText">Click: Select &nbsp;&nbsp; Double Click: Select and View &nbsp;&nbsp; Right Click: Delete</div>
              </div>
              <div id="viewContainer">
                <img id="nodeViewImage" style={{maxHeight:'100%',maxWidth:'100%',display:'block'}} />
              </div>
            </div>

            <div id="midRightContainer">
              {this.renderGraphProperties()}
              {this.renderProperties()}
            </div>
          </div>
        </div>

        <style jsx global>{`
          #mainContainer {
            display: grid;
            grid-template-rows: 40px auto;
          }

          #midLeftContainer {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-right: 2px solid #000;
            grid-column-gap: 2px;
          }

          #midRightContainer {
            border-left: 2px solid #000;
          }

          #midContainer {
            display: grid;
            grid-template-columns: 280px auto 280px;
          }

          #viewContainer {
            background-color: hsl(209, 10%, 8%);
          }

          #innerMidContainer {
            display: grid;
            grid-template-rows: 60% 40%;
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
            font-size: 80%;
          }

          #svg {
            width: 100%;
            height: 100%;
          }

          .nodeButtonHeader {
            padding: 5px;
            background-color: hsl(209, 10%, 5%);
            color: hsl(209, 10%, 60%);
            margin-bottom: 2px;
          }

          .nodeButtonContainer {
            position: relative;
          }

          .nodeButton {
            padding: 5px;
            background-color: hsl(209, 10%, 40%);
            margin-bottom: 2px;
            cursor: pointer;
            border-radius: 2px;
          }

          .nodeButton:hover {
            background-color: hsl(209, 10%, 60%);
          }

          .nodeButton.active {
            background-color: hsl(209, 60%, 40%);
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

          .nodeBg.running {
            fill: hsl(0, 60%, 60%);
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

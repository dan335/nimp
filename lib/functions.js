

const functions = {
  // get point from event.  either touch or mouse
  getPointFromEvent: function(event) {
    let point = {x:0, y:0};

    if (event.targetTouches) {
      point.x = event.targetTouches[0].clientX;
      point.y = event.targetTouches[0].clientY;
    } else {
      point.x = event.clientX;
      point.y = event.clientY;
    }

    return point;
  },


  getPointOnSvg: function(event, svg) {
    const point = svg.createSVGPoint();
    const pos = functions.getPointFromEvent(event);

    point.x = pos.x;
    point.y = pos.y;

    const svgPos = point.matrixTransform(svg.getScreenCTM().inverse());
    return svgPos;
  },


  // make sure connection does not create an infinite loop
  isNodeInParents: function(searchNode, findNode) {
    for (let n = 0; n < searchNode.inputs.length; n++) {
      if (searchNode.inputs[n].parent) {
        // special case for loop nodes
        if (searchNode.inputs[n].parent.node.title == 'Loop') return false;

        if (searchNode.inputs[n].parent.node == findNode) {
          return true;
        } else {
          const result = functions.isNodeInParents(searchNode.inputs[n].parent.node, findNode);
          if (result) return true;
        }
      }
    }

    return false;
  },


  // nodes know if they're inside a loop
  // if we're inside run things synchronously instead of async
  isInsideALoop: function(node) {
    for (let n = 0; n < node.inputs.length; n++) {
      if (node.inputs[n].parent) {
        if (node.inputs[n].parent.node.title == 'Loop') {
          return true;
        } else {
          if (node.inputs[n].title != 'Loop End') {
            const result = functions.isInsideALoop(node.inputs[n].parent.node);
            if (result) return true;
          }
        }
      }
    }
    return false;
  }
}

export default functions

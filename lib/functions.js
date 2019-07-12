

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


  isNodeInParents: function(searchNode, findNode) {
    for (let n = 0; n < searchNode.inputs.length; n++) {
      if (searchNode.inputs[n].parent) {
        // special case for loop nodes
        if (searchNode.inputs[n].parent.node.name == 'Loop') return false;

        if (searchNode.inputs[n].parent.node == findNode) {
          return true;
        } else {
          const result = functions.isNodeInParents(searchNode.inputs[n].parent.node, findNode);
          if (result) return true;
        }
      }
    }

    return false;
  }
}

export default functions

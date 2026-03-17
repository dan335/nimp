export function createMockGraph() {
  const noop = () => {};
  return {
    svg: { appendChild: noop, prepend: noop, removeChild: noop },
    component: { setState: noop, mouseState: null, svgLastMousePos: null, removeTempLine: noop },
    viewedNode: null,
    selectedNode: null,
    nodes: [],
    selectNode: noop,
    viewNode: noop,
  };
}

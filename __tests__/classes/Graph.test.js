import Graph from '../../classes/Graph.js';
import NumberInput from '../../classes/nodes/number/Number.js';
import AddNumbers from '../../classes/nodes/number/AddNumbers.js';

function createMockGraph() {
  const noop = () => {};
  const svg = { appendChild: noop, prepend: noop, removeChild: noop };
  const component = { setState: noop, mouseState: null, svgLastMousePos: null, removeTempLine: noop };
  return new Graph(svg, component);
}


describe('Graph', () => {
  test('constructor initializes defaults', () => {
    const graph = createMockGraph();
    expect(graph.nodes).toEqual([]);
    expect(graph.title).toBe('New Graph');
    expect(graph.isPublic).toBe(true);
    expect(graph.selectedNode).toBeNull();
    expect(graph.viewedNode).toBeNull();
  });

  test('createNode adds a node to the graph', () => {
    const graph = createMockGraph();
    const node = graph.createNode('Number', NumberInput, 100, 100, {}, false);
    expect(graph.nodes).toHaveLength(1);
    expect(graph.nodes[0]).toBe(node);
  });

  test('createNode can run node immediately', () => {
    const graph = createMockGraph();
    const node = graph.createNode('Number', NumberInput, 100, 100, { number: 42 }, true);
    expect(node.number).toBe(42);
  });

  test('deleteNode removes node from graph', () => {
    const graph = createMockGraph();
    const node = graph.createNode('Number', NumberInput, 100, 100, {}, false);
    expect(graph.nodes).toHaveLength(1);
    graph.deleteNode(node);
    expect(graph.nodes).toHaveLength(0);
  });

  test('getOutputNode returns null for empty graph', () => {
    const graph = createMockGraph();
    expect(graph.getOutputNode()).toBeNull();
  });

  test('getOutputNode returns null when no Output node exists', () => {
    const graph = createMockGraph();
    graph.createNode('Number', NumberInput, 100, 100, {}, false);
    expect(graph.getOutputNode()).toBeNull();
  });

  test('toJson serializes graph', () => {
    const graph = createMockGraph();
    graph.createNode('Number', NumberInput, 100, 100, { number: 42 }, false);
    const json = graph.toJson();
    expect(json.title).toBe('New Graph');
    expect(json.nodes).toHaveLength(1);
    expect(json.nodes[0].className).toBe('Number');
    expect(json.id).toBeDefined();
  });

  test('toJson round trip preserves node data', () => {
    const graph = createMockGraph();
    const node = graph.createNode('Number', NumberInput, 100, 100, { number: 42 }, false);
    const json = graph.toJson();
    expect(json.nodes[0].settings.number).toBe(42);
    expect(json.nodes[0].id).toBe(node.id);
  });

  test('selectNode sets selectedNode', () => {
    const graph = createMockGraph();
    const node = graph.createNode('Number', NumberInput, 100, 100, {}, false);
    graph.selectNode(node);
    expect(graph.selectedNode).toBe(node);
  });

  test('selectNode deselects previous node', () => {
    const graph = createMockGraph();
    const node1 = graph.createNode('Number', NumberInput, 100, 100, {}, false);
    const node2 = graph.createNode('Number', NumberInput, 200, 200, {}, false);
    graph.selectNode(node1);
    graph.selectNode(node2);
    expect(graph.selectedNode).toBe(node2);
  });

  test('viewNode sets viewedNode', () => {
    const graph = createMockGraph();
    const node = graph.createNode('Number', NumberInput, 100, 100, {}, false);
    graph.viewNode(node);
    expect(graph.viewedNode).toBe(node);
  });

  test('multiple createNode/deleteNode operations', () => {
    const graph = createMockGraph();
    const n1 = graph.createNode('Number', NumberInput, 100, 100, {}, false);
    const n2 = graph.createNode('Number', NumberInput, 200, 200, {}, false);
    const n3 = graph.createNode('Number', NumberInput, 300, 300, {}, false);
    expect(graph.nodes).toHaveLength(3);
    graph.deleteNode(n2);
    expect(graph.nodes).toHaveLength(2);
    expect(graph.nodes).toContain(n1);
    expect(graph.nodes).toContain(n3);
    expect(graph.nodes).not.toContain(n2);
  });
});

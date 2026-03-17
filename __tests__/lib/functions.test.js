import functions from '../../lib/functions.js';

describe('isNodeInParents', () => {
  test('returns false when node has no inputs', () => {
    const searchNode = { inputs: [] };
    const findNode = {};
    expect(functions.isNodeInParents(searchNode, findNode)).toBe(false);
  });

  test('returns false when inputs have no parents', () => {
    const searchNode = { inputs: [{ parent: null }, { parent: null }] };
    const findNode = {};
    expect(functions.isNodeInParents(searchNode, findNode)).toBe(false);
  });

  test('returns true when findNode is direct parent', () => {
    const findNode = { title: 'Find', inputs: [] };
    const searchNode = {
      inputs: [{ parent: { node: findNode } }]
    };
    expect(functions.isNodeInParents(searchNode, findNode)).toBe(true);
  });

  test('returns true when findNode is grandparent', () => {
    const findNode = { title: 'Grandparent', inputs: [] };
    const middleNode = {
      title: 'Middle',
      inputs: [{ parent: { node: findNode } }]
    };
    const searchNode = {
      inputs: [{ parent: { node: middleNode } }]
    };
    expect(functions.isNodeInParents(searchNode, findNode)).toBe(true);
  });

  test('returns false when findNode is not in parent chain', () => {
    const otherNode = { title: 'Other', inputs: [] };
    const findNode = { title: 'Find', inputs: [] };
    const searchNode = {
      inputs: [{ parent: { node: otherNode } }]
    };
    expect(functions.isNodeInParents(searchNode, findNode)).toBe(false);
  });

  test('stops searching at Loop nodes', () => {
    const findNode = { title: 'Find', inputs: [] };
    const loopNode = { title: 'Loop', inputs: [{ parent: { node: findNode } }] };
    const searchNode = {
      inputs: [{ parent: { node: loopNode } }]
    };
    expect(functions.isNodeInParents(searchNode, findNode)).toBe(false);
  });
});


describe('isInsideALoop', () => {
  test('returns false when node has no inputs', () => {
    const node = { inputs: [] };
    expect(functions.isInsideALoop(node)).toBe(false);
  });

  test('returns false when inputs have no parents', () => {
    const node = { inputs: [{ parent: null }] };
    expect(functions.isInsideALoop(node)).toBe(false);
  });

  test('returns true when direct parent is Loop', () => {
    const loopNode = { title: 'Loop', inputs: [] };
    const node = {
      inputs: [{ parent: { node: loopNode }, title: 'Input' }]
    };
    expect(functions.isInsideALoop(node)).toBe(true);
  });

  test('returns true when nested parent is Loop', () => {
    const loopNode = { title: 'Loop', inputs: [] };
    const middleNode = {
      title: 'Middle',
      inputs: [{ parent: { node: loopNode }, title: 'Input' }]
    };
    const node = {
      inputs: [{ parent: { node: middleNode }, title: 'Input' }]
    };
    expect(functions.isInsideALoop(node)).toBe(true);
  });

  test('stops at Loop End input', () => {
    const loopNode = { title: 'Loop', inputs: [] };
    const middleNode = {
      title: 'Middle',
      inputs: [{ parent: { node: loopNode }, title: 'Input' }]
    };
    const node = {
      inputs: [{ parent: { node: middleNode }, title: 'Loop End' }]
    };
    expect(functions.isInsideALoop(node)).toBe(false);
  });
});


describe('getClassFromName', () => {
  test('returns a class object for a valid className', () => {
    const result = functions.getClassFromName('AddNumbers');
    expect(result).not.toBeNull();
    expect(typeof result).toBe('function');
  });

  test('returns null for invalid className', () => {
    const result = functions.getClassFromName('NonExistentNode');
    expect(result).toBeNull();
  });

  test('returns correct class for various node types', () => {
    expect(functions.getClassFromName('Number')).not.toBeNull();
    expect(functions.getClassFromName('ColorInput')).not.toBeNull();
    expect(functions.getClassFromName('Output')).not.toBeNull();
  });
});

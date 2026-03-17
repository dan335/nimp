jest.useFakeTimers();
import { createMockGraph } from '../../../helpers/mockGraph.js';
import AddNumbers from '../../../../classes/nodes/number/AddNumbers.js';
import SubtractNumbers from '../../../../classes/nodes/number/SubtractNumbers.js';
import MultiplyNumbers from '../../../../classes/nodes/number/MultiplyNumbers.js';
import DivideNumbers from '../../../../classes/nodes/number/DivideNumbers.js';
import ModuloNumbers from '../../../../classes/nodes/number/ModuloNumbers.js';
import ExponentNumbers from '../../../../classes/nodes/number/ExponentNumbers.js';
import AbsoluteValue from '../../../../classes/nodes/number/AbsoluteValue.js';
import Round from '../../../../classes/nodes/number/Round.js';
import Floor from '../../../../classes/nodes/number/Floor.js';
import Ceil from '../../../../classes/nodes/number/Ceil.js';
import Min from '../../../../classes/nodes/number/Min.js';
import Max from '../../../../classes/nodes/number/Max.js';
import Sin from '../../../../classes/nodes/number/Sin.js';
import Cos from '../../../../classes/nodes/number/Cos.js';
import Pi from '../../../../classes/nodes/number/Pi.js';
import SquareRoot from '../../../../classes/nodes/number/SquareRoot.js';
import RandomNumber from '../../../../classes/nodes/number/RandomNumber.js';
import DegreesToRadians from '../../../../classes/nodes/number/DegreesToRadians.js';
import RadiansToDegrees from '../../../../classes/nodes/number/RadiansToDegrees.js';
import Atan2 from '../../../../classes/nodes/number/Atan2.js';
import NumberInput from '../../../../classes/nodes/number/Number.js';
import Slider from '../../../../classes/nodes/number/Slider.js';

function createNode(NodeClass, settings = {}) {
  const graph = createMockGraph();
  return new NodeClass(NodeClass.name, graph, 100, 100, settings);
}

function createTwoInputNode(NodeClass, a, b) {
  const node = createNode(NodeClass);
  node.inputs[0].number = a;
  node.inputs[1].number = b;
  node.run(null);
  return node;
}

function createOneInputNode(NodeClass, a) {
  const node = createNode(NodeClass);
  node.inputs[0].number = a;
  node.run(null);
  return node;
}


describe('AddNumbers', () => {
  test('adds two numbers', () => {
    const node = createTwoInputNode(AddNumbers, 3, 5);
    expect(node.number).toBe(8);
  });

  test('returns null when first input is null', () => {
    const node = createTwoInputNode(AddNumbers, null, 5);
    expect(node.number).toBeNull();
  });

  test('returns null when both inputs are null', () => {
    const node = createTwoInputNode(AddNumbers, null, null);
    expect(node.number).toBeNull();
  });

  test('handles negative numbers', () => {
    const node = createTwoInputNode(AddNumbers, -3, -7);
    expect(node.number).toBe(-10);
  });

  test('handles decimal numbers', () => {
    const node = createTwoInputNode(AddNumbers, 0.1, 0.2);
    expect(node.number).toBeCloseTo(0.3);
  });

  test('serializes settings with toJson()', () => {
    const node = createNode(AddNumbers, { a: 10, b: 20 });
    const json = node.toJson();
    expect(json.settings.a).toBe(10);
    expect(json.settings.b).toBe(20);
    expect(json.className).toBe('AddNumbers');
  });
});


describe('SubtractNumbers', () => {
  test('subtracts two numbers', () => {
    const node = createTwoInputNode(SubtractNumbers, 10, 3);
    expect(node.number).toBe(7);
  });

  test('returns null when input is null', () => {
    const node = createTwoInputNode(SubtractNumbers, null, 5);
    expect(node.number).toBeNull();
  });

  test('handles negative result', () => {
    const node = createTwoInputNode(SubtractNumbers, 3, 10);
    expect(node.number).toBe(-7);
  });
});


describe('MultiplyNumbers', () => {
  test('multiplies two numbers', () => {
    const node = createTwoInputNode(MultiplyNumbers, 4, 5);
    expect(node.number).toBe(20);
  });

  test('multiplies by zero', () => {
    const node = createTwoInputNode(MultiplyNumbers, 100, 0);
    expect(node.number).toBe(0);
  });

  test('returns null when input is null', () => {
    const node = createTwoInputNode(MultiplyNumbers, null, 5);
    expect(node.number).toBeNull();
  });
});


describe('DivideNumbers', () => {
  test('divides two numbers', () => {
    const node = createTwoInputNode(DivideNumbers, 10, 2);
    expect(node.number).toBe(5);
  });

  test('divides by zero returns Infinity', () => {
    const node = createTwoInputNode(DivideNumbers, 10, 0);
    expect(node.number).toBe(Infinity);
  });

  test('returns null when input is null', () => {
    const node = createTwoInputNode(DivideNumbers, null, 5);
    expect(node.number).toBeNull();
  });

  test('handles decimal division', () => {
    const node = createTwoInputNode(DivideNumbers, 1, 3);
    expect(node.number).toBeCloseTo(0.3333, 3);
  });
});


describe('ModuloNumbers', () => {
  test('calculates modulo', () => {
    const node = createTwoInputNode(ModuloNumbers, 10, 3);
    expect(node.number).toBe(1);
  });

  test('returns null when input is null', () => {
    const node = createTwoInputNode(ModuloNumbers, null, 3);
    expect(node.number).toBeNull();
  });
});


describe('ExponentNumbers', () => {
  test('raises to power', () => {
    const node = createTwoInputNode(ExponentNumbers, 2, 3);
    expect(node.number).toBe(8);
  });

  test('zero exponent returns 1', () => {
    const node = createTwoInputNode(ExponentNumbers, 5, 0);
    expect(node.number).toBe(1);
  });

  test('returns null when input is null', () => {
    const node = createTwoInputNode(ExponentNumbers, null, 2);
    expect(node.number).toBeNull();
  });
});


describe('AbsoluteValue', () => {
  test('returns absolute value of negative number', () => {
    const node = createOneInputNode(AbsoluteValue, -5);
    expect(node.number).toBe(5);
  });

  test('returns absolute value of positive number', () => {
    const node = createOneInputNode(AbsoluteValue, 5);
    expect(node.number).toBe(5);
  });

  test('returns null when input is null', () => {
    const node = createOneInputNode(AbsoluteValue, null);
    expect(node.number).toBeNull();
  });
});


describe('Round', () => {
  test('rounds down', () => {
    const node = createOneInputNode(Round, 4.3);
    expect(node.number).toBe(4);
  });

  test('rounds up', () => {
    const node = createOneInputNode(Round, 4.7);
    expect(node.number).toBe(5);
  });

  test('rounds half up', () => {
    const node = createOneInputNode(Round, 4.5);
    expect(node.number).toBe(5);
  });

  test('returns null when input is null', () => {
    const node = createOneInputNode(Round, null);
    expect(node.number).toBeNull();
  });
});


describe('Floor', () => {
  test('floors positive number', () => {
    const node = createOneInputNode(Floor, 4.9);
    expect(node.number).toBe(4);
  });

  test('floors negative number', () => {
    const node = createOneInputNode(Floor, -4.1);
    expect(node.number).toBe(-5);
  });

  test('returns null when input is null', () => {
    const node = createOneInputNode(Floor, null);
    expect(node.number).toBeNull();
  });
});


describe('Ceil', () => {
  test('ceils positive number', () => {
    const node = createOneInputNode(Ceil, 4.1);
    expect(node.number).toBe(5);
  });

  test('ceils negative number', () => {
    const node = createOneInputNode(Ceil, -4.9);
    expect(node.number).toBe(-4);
  });

  test('returns null when input is null', () => {
    const node = createOneInputNode(Ceil, null);
    expect(node.number).toBeNull();
  });
});


describe('Min', () => {
  test('returns minimum of two numbers', () => {
    const node = createTwoInputNode(Min, 3, 7);
    expect(node.number).toBe(3);
  });

  test('handles equal numbers', () => {
    const node = createTwoInputNode(Min, 5, 5);
    expect(node.number).toBe(5);
  });

  test('returns null when input is null', () => {
    const node = createTwoInputNode(Min, null, 5);
    expect(node.number).toBeNull();
  });
});


describe('Max', () => {
  test('returns maximum of two numbers', () => {
    const node = createTwoInputNode(Max, 3, 7);
    expect(node.number).toBe(7);
  });

  test('handles equal numbers', () => {
    const node = createTwoInputNode(Max, 5, 5);
    expect(node.number).toBe(5);
  });

  test('returns null when input is null', () => {
    const node = createTwoInputNode(Max, null, 5);
    expect(node.number).toBeNull();
  });
});


describe('Sin', () => {
  test('calculates sine of 0', () => {
    const node = createOneInputNode(Sin, 0);
    expect(node.number).toBe(0);
  });

  test('calculates sine of PI/2', () => {
    const node = createOneInputNode(Sin, Math.PI / 2);
    expect(node.number).toBeCloseTo(1);
  });

  test('returns null when input is null', () => {
    const node = createOneInputNode(Sin, null);
    expect(node.number).toBeNull();
  });
});


describe('Cos', () => {
  test('calculates cosine of 0', () => {
    const node = createOneInputNode(Cos, 0);
    expect(node.number).toBe(1);
  });

  test('calculates cosine of PI', () => {
    const node = createOneInputNode(Cos, Math.PI);
    expect(node.number).toBeCloseTo(-1);
  });

  test('returns null when input is null', () => {
    const node = createOneInputNode(Cos, null);
    expect(node.number).toBeNull();
  });
});


describe('Atan2', () => {
  test('calculates atan2(1, 0)', () => {
    const node = createNode(Atan2);
    node.inputs[0].number = 0;  // x
    node.inputs[1].number = 1;  // y
    node.run(null);
    expect(node.number).toBeCloseTo(Math.atan2(1, 0));
  });

  test('returns null when input is null', () => {
    const node = createNode(Atan2);
    node.inputs[0].number = null;
    node.inputs[1].number = 1;
    node.run(null);
    expect(node.number).toBeNull();
  });
});


describe('Pi', () => {
  test('outputs Math.PI', () => {
    const node = createNode(Pi);
    node.run(null);
    expect(node.number).toBe(Math.PI);
  });
});


describe('SquareRoot', () => {
  test('calculates square root of 9', () => {
    const node = createOneInputNode(SquareRoot, 9);
    expect(node.number).toBe(3);
  });

  test('calculates square root of 2', () => {
    const node = createOneInputNode(SquareRoot, 2);
    expect(node.number).toBeCloseTo(Math.SQRT2);
  });

  test('returns null when input is null', () => {
    const node = createOneInputNode(SquareRoot, null);
    expect(node.number).toBeNull();
  });
});


describe('RandomNumber', () => {
  test('outputs a number between 0 and 1', () => {
    const node = createNode(RandomNumber);
    node.run(null);
    expect(node.number).toBeGreaterThanOrEqual(0);
    expect(node.number).toBeLessThan(1);
  });
});


describe('DegreesToRadians', () => {
  test('converts 180 degrees to PI', () => {
    const node = createOneInputNode(DegreesToRadians, 180);
    expect(node.number).toBeCloseTo(Math.PI);
  });

  test('converts 90 degrees to PI/2', () => {
    const node = createOneInputNode(DegreesToRadians, 90);
    expect(node.number).toBeCloseTo(Math.PI / 2);
  });

  test('returns null when input is null', () => {
    const node = createOneInputNode(DegreesToRadians, null);
    expect(node.number).toBeNull();
  });
});


describe('RadiansToDegrees', () => {
  test('converts PI to 180 degrees', () => {
    const node = createOneInputNode(RadiansToDegrees, Math.PI);
    expect(node.number).toBeCloseTo(180);
  });

  test('converts PI/2 to 90 degrees', () => {
    const node = createOneInputNode(RadiansToDegrees, Math.PI / 2);
    expect(node.number).toBeCloseTo(90);
  });

  test('returns null when input is null', () => {
    const node = createOneInputNode(RadiansToDegrees, null);
    expect(node.number).toBeNull();
  });
});


describe('Number (input node)', () => {
  test('outputs default number 1', () => {
    const node = createNode(NumberInput);
    node.run(null);
    expect(node.number).toBe(1);
  });

  test('outputs custom number from settings', () => {
    const node = createNode(NumberInput, { number: 42 });
    node.run(null);
    expect(node.number).toBe(42);
  });

  test('serializes number in toJson()', () => {
    const node = createNode(NumberInput, { number: 99 });
    const json = node.toJson();
    expect(json.settings.number).toBe(99);
  });
});


describe('Slider', () => {
  test('outputs default number', () => {
    const node = createNode(Slider);
    node.run(null);
    expect(node.number).toBe(1);
  });

  test('uses settings values', () => {
    const node = createNode(Slider, { number: 5, min: 0, max: 10, step: 0.5 });
    expect(node.min).toBe(0);
    expect(node.max).toBe(10);
    expect(node.step).toBe(0.5);
  });

  test('updates min/max/step from inputs', () => {
    const node = createNode(Slider, { number: 5, min: 0, max: 10, step: 1 });
    node.inputs[0].number = 2;  // min
    node.inputs[1].number = 20; // max
    node.inputs[2].number = 0.1; // step
    node.run(null);
    expect(node.min).toBe(2);
    expect(node.max).toBe(20);
    expect(node.step).toBe(0.1);
  });

  test('serializes in toJson()', () => {
    const node = createNode(Slider, { number: 5, min: 0, max: 10, step: 0.5 });
    const json = node.toJson();
    expect(json.settings.number).toBe(5);
    expect(json.settings.min).toBe(0);
    expect(json.settings.max).toBe(10);
    expect(json.settings.step).toBe(0.5);
  });
});

jest.useFakeTimers();
import { createMockGraph } from '../../../helpers/mockGraph.js';
import ColorInput from '../../../../classes/nodes/color/ColorInput.js';
import RGBInput from '../../../../classes/nodes/color/RGBInput.js';
import HSLInput from '../../../../classes/nodes/color/HSLInput.js';
import HSVInput from '../../../../classes/nodes/color/HSVInput.js';
import MixColors from '../../../../classes/nodes/color/MixColors.js';
import GetBrightness from '../../../../classes/nodes/color/GetBrightness.js';
import GetLuminance from '../../../../classes/nodes/color/GetLuminance.js';
import GetAlpha from '../../../../classes/nodes/color/GetAlpha.js';
import ComplimentColor from '../../../../classes/nodes/color/ComplimentColor.js';
import AnalogousColors from '../../../../classes/nodes/color/AnalogousColors.js';
import TriadColors from '../../../../classes/nodes/color/TriadColors.js';
import TetradColors from '../../../../classes/nodes/color/TetradColors.js';
import SplitComplimentColors from '../../../../classes/nodes/color/SplitComplimentColors.js';
import MonochromaticColors from '../../../../classes/nodes/color/MonochromaticColors.js';
import ColorAdjust from '../../../../classes/nodes/color/ColorAdjust.js';
const tinycolor = require('tinycolor2');

function createNode(NodeClass, settings = {}) {
  const graph = createMockGraph();
  return new NodeClass(NodeClass.name, graph, 100, 100, settings);
}


describe('ColorInput', () => {
  test('creates color from default #fff', () => {
    const node = createNode(ColorInput);
    node.run(null);
    expect(node.color).not.toBeNull();
    expect(node.color.toHex()).toBe('ffffff');
  });

  test('creates color from settings', () => {
    const node = createNode(ColorInput, { hue: '#ff0000' });
    node.run(null);
    expect(node.color.toHex()).toBe('ff0000');
  });

  test('serializes in toJson()', () => {
    const node = createNode(ColorInput);
    const json = node.toJson();
    expect(json.settings.string).toBe('#fff');
  });
});


describe('RGBInput', () => {
  test('creates color from default RGB values', () => {
    const node = createNode(RGBInput);
    node.run(null);
    expect(node.color).not.toBeNull();
    const rgb = node.color.toRgb();
    expect(rgb.r).toBe(255);
    expect(rgb.g).toBe(255);
    expect(rgb.b).toBe(255);
  });

  test('creates color from input numbers', () => {
    const node = createNode(RGBInput, { red: 128, green: 64, blue: 32, alpha: 0.5 });
    node.run(null);
    const rgb = node.color.toRgb();
    expect(rgb.r).toBe(128);
    expect(rgb.g).toBe(64);
    expect(rgb.b).toBe(32);
    expect(rgb.a).toBe(0.5);
  });

  test('clamps values to valid range', () => {
    const node = createNode(RGBInput, { red: 300, green: -10, blue: 128, alpha: 2 });
    node.run(null);
    const rgb = node.color.toRgb();
    expect(rgb.r).toBe(255);
    expect(rgb.g).toBe(0);
    expect(rgb.b).toBe(128);
    expect(rgb.a).toBe(1);
  });
});


describe('HSLInput', () => {
  test('creates color from HSL values', () => {
    const node = createNode(HSLInput, { hue: 0, saturation: 1, lightness: 0.5, alpha: 1 });
    node.run(null);
    expect(node.color).not.toBeNull();
    expect(node.color.toHex()).toBe('ff0000');
  });
});


describe('HSVInput', () => {
  test('creates color from HSV values', () => {
    const node = createNode(HSVInput, { hue: 0, saturation: 1, value: 1, alpha: 1 });
    node.run(null);
    expect(node.color).not.toBeNull();
    expect(node.color.toHex()).toBe('ff0000');
  });
});


describe('MixColors', () => {
  test('mixes two colors at 50%', () => {
    const node = createNode(MixColors, {
      colorA: '#000000',
      colorB: '#ffffff',
      amount: 0.5
    });
    node.run(null);
    expect(node.color).not.toBeNull();
    // At 50% mix of black and white, expect gray
    const rgb = node.color.toRgb();
    expect(rgb.r).toBeCloseTo(128, -1);
    expect(rgb.g).toBeCloseTo(128, -1);
    expect(rgb.b).toBeCloseTo(128, -1);
  });

  test('mixes at 0% returns first color', () => {
    const node = createNode(MixColors, {
      colorA: '#ff0000',
      colorB: '#0000ff',
      amount: 0
    });
    node.run(null);
    expect(node.color.toHex()).toBe('ff0000');
  });

  test('mixes at 100% returns second color', () => {
    const node = createNode(MixColors, {
      colorA: '#ff0000',
      colorB: '#0000ff',
      amount: 1
    });
    node.run(null);
    expect(node.color.toHex()).toBe('0000ff');
  });

  test('clamps amount to 0-1', () => {
    const node = createNode(MixColors, {
      colorA: '#ff0000',
      colorB: '#0000ff',
      amount: 5
    });
    node.run(null);
    // Amount is clamped to 1
    expect(node.color.toHex()).toBe('0000ff');
  });

  test('uses input connections for colors', () => {
    const node = createNode(MixColors, { amount: 0.5 });
    node.inputs[0].color = tinycolor('#ff0000');
    node.inputs[1].color = tinycolor('#0000ff');
    node.run(null);
    expect(node.color).not.toBeNull();
  });

  test('serializes in toJson()', () => {
    const node = createNode(MixColors, { amount: 0.7, colorA: '#f00', colorB: '#00f' });
    const json = node.toJson();
    expect(json.settings.amount).toBe(0.7);
  });
});


describe('GetBrightness', () => {
  test('returns brightness for white', () => {
    const node = createNode(GetBrightness);
    node.inputs[0].color = tinycolor('#ffffff');
    node.run(null);
    expect(node.number).toBe(255);
  });

  test('returns brightness for black', () => {
    const node = createNode(GetBrightness);
    node.inputs[0].color = tinycolor('#000000');
    node.run(null);
    expect(node.number).toBe(0);
  });

  test('handles no input color', () => {
    const node = createNode(GetBrightness);
    node.inputs[0].color = null;
    node.run(null);
    // Bug noted in plan: sets this.color = null instead of this.number = null
    // Testing the actual behavior
    expect(node.color).toBeNull();
  });
});


describe('GetLuminance', () => {
  test('returns luminance for white', () => {
    const node = createNode(GetLuminance);
    node.inputs[0].color = tinycolor('#ffffff');
    node.run(null);
    expect(node.number).toBeCloseTo(1, 1);
  });

  test('returns luminance for black', () => {
    const node = createNode(GetLuminance);
    node.inputs[0].color = tinycolor('#000000');
    node.run(null);
    expect(node.number).toBe(0);
  });
});


describe('GetAlpha', () => {
  test('returns alpha for fully opaque', () => {
    const node = createNode(GetAlpha);
    node.inputs[0].color = tinycolor('rgba(255, 0, 0, 1)');
    node.run(null);
    expect(node.number).toBe(1);
  });

  test('returns alpha for semi-transparent', () => {
    const node = createNode(GetAlpha);
    node.inputs[0].color = tinycolor('rgba(255, 0, 0, 0.5)');
    node.run(null);
    expect(node.number).toBe(0.5);
  });
});


describe('ComplimentColor', () => {
  test('returns complement of red', () => {
    const node = createNode(ComplimentColor);
    node.inputs[0].color = tinycolor('#ff0000');
    node.run(null);
    expect(node.color).not.toBeNull();
    // Complement of red is cyan
    expect(node.color.toHex()).toBe('00ffff');
  });
});


describe('AnalogousColors', () => {
  test('returns 6 analogous colors', () => {
    const node = createNode(AnalogousColors);
    node.inputs[0].color = tinycolor('#ff0000');
    node.run(null);
    expect(node.outputs).toHaveLength(6);
  });
});


describe('TriadColors', () => {
  test('returns 3 triad colors', () => {
    const node = createNode(TriadColors);
    node.inputs[0].color = tinycolor('#ff0000');
    node.run(null);
    expect(node.outputs).toHaveLength(3);
  });
});


describe('TetradColors', () => {
  test('returns 4 tetrad colors', () => {
    const node = createNode(TetradColors);
    node.inputs[0].color = tinycolor('#ff0000');
    node.run(null);
    expect(node.outputs).toHaveLength(4);
  });
});


describe('SplitComplimentColors', () => {
  test('returns 3 split complement colors', () => {
    const node = createNode(SplitComplimentColors);
    node.inputs[0].color = tinycolor('#ff0000');
    node.run(null);
    expect(node.outputs).toHaveLength(3);
  });
});


describe('MonochromaticColors', () => {
  test('returns 6 monochromatic colors', () => {
    const node = createNode(MonochromaticColors);
    node.inputs[0].color = tinycolor('#ff0000');
    node.run(null);
    expect(node.outputs).toHaveLength(6);
  });
});


describe('ColorAdjust', () => {
  test('adjusts hue (spin)', () => {
    const node = createNode(ColorAdjust, { hue: 180 });
    node.inputs[0].color = tinycolor('#ff0000');
    node.run(null);
    expect(node.color).not.toBeNull();
    // Spinning 180 degrees from red gives cyan
    expect(node.color.toHex()).toBe('00ffff');
  });

  test('passes through without adjustment', () => {
    const node = createNode(ColorAdjust, { hue: 0, saturation: 0, lightness: 0, brightness: 0 });
    node.inputs[0].color = tinycolor('#ff0000');
    node.run(null);
    expect(node.color.toHex()).toBe('ff0000');
  });
});

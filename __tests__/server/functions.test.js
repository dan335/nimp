const functions = require('../../server/functions.js');

describe('stringToSlug', () => {
  const { stringToSlug } = functions;

  test('converts spaces to hyphens', () => {
    expect(stringToSlug('Hello World')).toBe('hello-world');
  });

  test('trims leading and trailing spaces/hyphens', () => {
    expect(stringToSlug('  leading trailing  ')).toBe('leading-trailing');
  });

  test('replaces & with and', () => {
    expect(stringToSlug('Rock & Roll')).toBe('rock-and-roll');
  });

  test('replaces accented characters', () => {
    expect(stringToSlug('Café au lait')).toBe('cafe-au-lait');
  });

  test('collapses multiple dashes', () => {
    expect(stringToSlug('---multiple---dashes---')).toBe('multiple-dashes');
  });

  test('handles empty string', () => {
    expect(stringToSlug('')).toBe('');
  });

  test('converts to lowercase', () => {
    expect(stringToSlug('UPPERCASE')).toBe('uppercase');
  });

  test('preserves already valid slugs', () => {
    expect(stringToSlug('already-a-slug')).toBe('already-a-slug');
  });

  test('removes special characters', () => {
    expect(stringToSlug('hello!@#$%^*()world')).toBe('helloworld');
  });

  test('handles mixed accented characters', () => {
    expect(stringToSlug('über cool')).toBe('uber-cool');
  });
});

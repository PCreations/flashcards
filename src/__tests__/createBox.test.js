const { createBox } = require('../createBox');

describe('createBox', () => {
  test('should accept an object with required not empty string property "name"', () => {
    expect(() => createBox()).toThrowError('missing properties "name"');
    expect(() => createBox({ name: '' })).toThrowError('missing properties "name"');
    expect(() => createBox({ name: 'box name' })).not.toThrow();
  });
});

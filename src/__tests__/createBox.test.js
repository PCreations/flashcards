const { createBox } = require('../createBox');

describe('createBox', () => {
  test('should accept an object with required not empty string property "name"', () => {
    expect(() => createBox()).toThrowError('missing properties "name"');
    expect(() => createBox({ name: '' })).toThrowError('missing properties "name"');
    expect(() => createBox({ name: 'box name' })).not.toThrow();
  });
  test('should return an immutable object', () => {
    const box = createBox({ name: 'box name' });
    box.name = 'other box name';
    expect(box.name).toBe('box name');
  });
  test('should have five empty partitions by default', () => {
    const box = createBox({ name: 'box name' });
    expect(box.partitions).toEqual([[], [], [], [], []]);
  });
});

const { windowedRangeFive } = require('../windowedRangeFive');

describe('windowedRangeFive', () => {
  describe('should create a range between two numbers windowed between 1 and 5', () => {
    test('no arguments should return an empty array', () => {
      expect(windowedRangeFive()).toEqual([]);
    });
    test('one argument should return an array containing only this number', () => {
      expect(windowedRangeFive(0)).toEqual([0]);
    });
    test('first number is lower than second number', () => {
      expect(windowedRangeFive(1, 2)).toEqual([1, 2]);
      expect(windowedRangeFive(1, 3)).toEqual([1, 2, 3]);
      expect(windowedRangeFive(2, 4)).toEqual([2, 3, 4]);
    });
    test('first number is greater than second number', () => {
      expect(windowedRangeFive(3, 1)).toEqual([3, 4, 5, 1]);
      expect(windowedRangeFive(5, 4)).toEqual([5, 1, 2, 3, 4]);
    });
    test('two same arguments should return an array containing only this number', () => {
      expect(windowedRangeFive(1, 1)).toEqual([1]);
    });
  });
});

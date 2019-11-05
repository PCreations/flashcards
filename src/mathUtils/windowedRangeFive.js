const windowedRangeFive = (x, y) => {
  if (typeof x === 'undefined') {
    return [];
  }
  if (typeof y === 'undefined') {
    return [x];
  }
  if (x === y) {
    return [x];
  }
  if (x < y) {
    return new Array(y - x + 1).fill(x).map((value, index) => value + index);
  }
  return new Array(5 - x + y + 1).fill(x).map((value, index) => {
    const computedValue = value + index;
    return computedValue > 5 ? computedValue % 5 : computedValue;
  });
};

module.exports = {
  windowedRangeFive,
};

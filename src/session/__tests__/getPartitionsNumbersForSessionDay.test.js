const getIndexOfPartitionsToPickForSessionDay = day => {
  const partitions = [];
  if (day % 5 === 0) {
    partitions.push(4);
  }
  if (day % 4 === 0) {
    partitions.push(3);
  }
  if (day % 3 === 0) {
    partitions.push(2);
  }
  if (day % 2 === 0) {
    partitions.push(1);
  }
  return partitions.concat([0]);
};

describe('getIndexOfPartitionsToPickForSessionDay', () => {
  /**
   * Partition 0 every day
   * Partition 1 every 2 days
   * Partition 2 every 3 days
   * Partition 3 every 4 days
   * Partition 4 every 5 days
   *
   */
  describe('partition 0 every day', () => {
    test('day 1', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(1)).toContainEqual(0);
    });
    test('day 2', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(2)).toContainEqual(0);
    });
    test('day 15', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(150)).toContainEqual(0);
    });
  });
  describe('partition 1 every two days', () => {
    test('day 2', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(2)).toContainEqual(1);
    });
    test('day 3', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(3)).not.toContainEqual(1);
    });
    test('day 4', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(2)).toContainEqual(1);
    });
    test('day 12', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(12)).toContainEqual(1);
    });
  });
  describe('partition 2 every three days', () => {
    test('day 3', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(3)).toContainEqual(2);
    });
    test('day 6', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(6)).toContainEqual(2);
    });
    test('day 7', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(7)).not.toContainEqual(2);
    });
    test('day 27', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(27)).toContainEqual(2);
    });
  });
  describe('partition 3 every four days', () => {
    test('day 4', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(4)).toContainEqual(3);
    });
    test('day 8', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(8)).toContainEqual(3);
    });
    test('day 9', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(9)).not.toContainEqual(3);
    });
    test('day 36', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(36)).toContainEqual(3);
    });
  });
  describe('partition 4 every five days', () => {
    test('day 5', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(5)).toContainEqual(4);
    });
    test('day 10', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(10)).toContainEqual(4);
    });
    test('day 11', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(11)).not.toContainEqual(4);
    });
    test('day 100', () => {
      expect(getIndexOfPartitionsToPickForSessionDay(100)).toContainEqual(4);
    });
  });
});

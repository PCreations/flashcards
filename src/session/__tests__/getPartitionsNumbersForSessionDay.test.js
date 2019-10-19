const getIndexOfPartitionsToPickForSessionDay = day => [0];

describe('getIndexOfPartitionsToPickForSessionDay', () => {
  /**
   * Partition 0 every day
   * Partition 1 every 2 days
   * Partition 2 every 3 days
   * Partition 3 every 4 days
   * Partition 4 every 5 days
   */
  test('day 1', () => {
    expect(getIndexOfPartitionsToPickForSessionDay(1)).toEqual([0]);
  });
});

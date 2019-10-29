const { daysBetweenTwoDates } = require('../daysBetweenTwoDates');

describe('daysBetweenTwoDates', () => {
  test('it returns the correct number of days between date1 and date2', () => {
    const date1 = new Date('2019-11-01');
    const date2 = new Date('2019-10-27');
    expect(daysBetweenTwoDates(date1, date2)).toBe(4);
  });
});

const { daysBetweenTwoDates } = require('../../dateUtils/daysBetweenTwoDates');

const convertTodayDateToSessionDay = ({ startedAtDate, todayDate } = {}) => {
  return (daysBetweenTwoDates(todayDate, startedAtDate) % 5) + 1;
};

describe('convertTodayDateToSessionDay', () => {
  describe('days should be contained in a 1-5 range', () => {
    test('given startedAtDate is null, todayDate should be considered day 1', () => {
      expect(
        convertTodayDateToSessionDay({
          todayDate: new Date(),
        }),
      ).toBe(1);
    });
    describe('startedAtDate is 2019-10-20', () => {
      const startedAtDate = new Date('2019-10-20');
      test('todayDate is 2019-10-21', () => {
        expect(
          convertTodayDateToSessionDay({
            startedAtDate,
            todayDate: new Date('2019-10-21'),
          }),
        ).toBe(2);
      });
      test('todayDate is 2019-10-22', () => {
        expect(
          convertTodayDateToSessionDay({
            startedAtDate,
            todayDate: new Date('2019-10-22'),
          }),
        ).toBe(3);
      });
      test('todayDate is 2019-10-23', () => {
        expect(
          convertTodayDateToSessionDay({
            startedAtDate,
            todayDate: new Date('2019-10-23'),
          }),
        ).toBe(4);
      });
      test('todayDate is 2019-10-24', () => {
        expect(
          convertTodayDateToSessionDay({
            startedAtDate,
            todayDate: new Date('2019-10-24'),
          }),
        ).toBe(5);
      });
      test('todayDate is 2019-10-25', () => {
        expect(
          convertTodayDateToSessionDay({
            startedAtDate,
            todayDate: new Date('2019-10-25'),
          }),
        ).toBe(1);
      });
      test('todayDate is 2019-10-31', () => {
        expect(
          convertTodayDateToSessionDay({
            startedAtDate,
            todayDate: new Date('2019-10-31'),
          }),
        ).toBe(1);
      });
    });
  });
});

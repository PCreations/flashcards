const { convertTodayDateToSessionDay } = require('../convertTodayDateToSessionDay');

describe('convertTodayDateToSessionDay', () => {
  describe('days should be contained in a 1-5 range', () => {
    test('given startedAtDate is null, todayDate should be considered day 1', () => {
      expect(
        convertTodayDateToSessionDay({
          todayDate: new Date(),
        }),
      ).toBe(1);
    });
    test.each`
      todayDate                          | expectedSessionDay
      ${new Date('2019-10-21T00:00:00')} | ${2}
      ${new Date('2019-10-22T00:00:00')} | ${3}
      ${new Date('2019-10-23T00:00:00')} | ${4}
      ${new Date('2019-10-24T00:00:00')} | ${5}
      ${new Date('2019-10-25T00:00:00')} | ${1}
      ${new Date('2019-10-26T00:00:00')} | ${2}
      ${new Date('2019-10-27T00:00:00')} | ${3}
      ${new Date('2019-10-28T00:00:00')} | ${4}
      ${new Date('2019-10-29T00:00:00')} | ${5}
      ${new Date('2019-10-30T00:00:00')} | ${1}
      ${new Date('2019-11-01T00:00:00')} | ${3}
    `(
      'given the started at is 2019-10-20 and today date is $todayDate, expected session day should be $expectedSessionDay',
      ({ todayDate, expectedSessionDay }) => {
        const startedAtDate = new Date('2019-10-20T00:00:00');
        expect(
          convertTodayDateToSessionDay({
            startedAtDate,
            todayDate,
          }),
        ).toBe(expectedSessionDay);
      },
    );
  });
});

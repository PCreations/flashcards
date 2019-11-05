const { convertDateToSessionDay } = require('../convertDateToSessionDay');

describe('convertDateToSessionDay', () => {
  describe('days should be contained in a 1-5 range', () => {
    test('given startedAtDate is undefined, todayDate should be considered day 1', () => {
      expect(
        convertDateToSessionDay({
          dateToConvert: new Date(),
        }),
      ).toBe(1);
    });
    test('given dateToConvert is undefined, it should throw an error', () => {
      expect(() =>
        convertDateToSessionDay({
          startedAtDate: new Date(),
        }),
      ).toThrowErrorMatchingInlineSnapshot();
    });
    test.each`
      dateToConvert                      | expectedSessionDay
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
      'given the started at is 2019-10-20 and today date is $dateToConvert, expected session day should be $expectedSessionDay',
      ({ dateToConvert, expectedSessionDay }) => {
        const startedAtDate = new Date('2019-10-20T00:00:00');
        expect(
          convertDateToSessionDay({
            startedAtDate,
            dateToConvert,
          }),
        ).toBe(expectedSessionDay);
      },
    );
  });
});

const { leitnerSchedule } = require('../leitnerSchedule');

const partition = number => ({
  shouldBeIncludedForSessions(...sessions) {
    Array(64)
      .fill(0)
      .map((_, index) => ({
        session: index + 1,
        partitions: leitnerSchedule(index + 1),
      }))
      .forEach(({ session, partitions }) => {
        test(`session ${session} should ${
          sessions.includes(session) ? 'contain' : 'not contain'
        } partition ${number}`, () => {
          sessions.includes(session)
            ? expect(partitions).toContain(number)
            : expect(partitions).not.toContain(number);
        });
      });
  },
});

describe('Leitner schedule', () => {
  test.each`
    sessionNumber | partitions
    ${1}          | ${[2, 1]}
    ${2}          | ${[3, 1]}
    ${3}          | ${[2, 1]}
    ${4}          | ${[4, 1]}
    ${5}          | ${[2, 1]}
    ${6}          | ${[3, 1]}
    ${7}          | ${[2, 1]}
    ${8}          | ${[1]}
    ${9}          | ${[2, 1]}
    ${10}         | ${[3, 1]}
    ${11}         | ${[2, 1]}
    ${12}         | ${[5, 1]}
    ${13}         | ${[4, 2, 1]}
    ${14}         | ${[3, 1]}
    ${15}         | ${[2, 1]}
    ${16}         | ${[1]}
    ${17}         | ${[2, 1]}
    ${18}         | ${[3, 1]}
    ${19}         | ${[2, 1]}
    ${20}         | ${[4, 1]}
    ${21}         | ${[2, 1]}
    ${22}         | ${[3, 1]}
    ${23}         | ${[2, 1]}
    ${24}         | ${[6, 1]}
    ${25}         | ${[2, 1]}
    ${26}         | ${[3, 1]}
    ${27}         | ${[2, 1]}
    ${28}         | ${[5, 1]}
    ${29}         | ${[4, 2, 1]}
    ${30}         | ${[3, 1]}
    ${31}         | ${[2, 1]}
    ${32}         | ${[1]}
    ${33}         | ${[2, 1]}
    ${34}         | ${[3, 1]}
    ${35}         | ${[2, 1]}
    ${36}         | ${[4, 1]}
    ${37}         | ${[2, 1]}
    ${38}         | ${[3, 1]}
    ${39}         | ${[2, 1]}
    ${40}         | ${[1]}
    ${41}         | ${[2, 1]}
    ${42}         | ${[3, 1]}
    ${43}         | ${[2, 1]}
    ${44}         | ${[5, 1]}
    ${45}         | ${[4, 2, 1]}
    ${46}         | ${[3, 1]}
    ${47}         | ${[2, 1]}
    ${48}         | ${[1]}
    ${49}         | ${[2, 1]}
    ${50}         | ${[3, 1]}
    ${51}         | ${[2, 1]}
    ${52}         | ${[4, 1]}
    ${53}         | ${[2, 1]}
    ${54}         | ${[3, 1]}
    ${55}         | ${[2, 1]}
    ${56}         | ${[7, 1]}
    ${57}         | ${[2, 1]}
    ${58}         | ${[3, 1]}
    ${59}         | ${[6, 2, 1]}
    ${60}         | ${[5, 1]}
    ${61}         | ${[4, 2, 1]}
    ${62}         | ${[3, 1]}
    ${63}         | ${[2, 1]}
    ${64}         | ${[1]}
  `(
    'partitions $partitions should be returned on session $sessionNumber',
    ({ sessionNumber, partitions }) => {
      expect(leitnerSchedule(sessionNumber)).toEqual(partitions);
    },
  );
  partition(1).shouldBeIncludedForSessions(
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
  );
  partition(2).shouldBeIncludedForSessions(
    1,
    3,
    5,
    7,
    9,
    11,
    13,
    15,
    17,
    19,
    21,
    23,
    25,
    27,
    29,
    31,
    33,
    35,
    37,
    39,
    41,
    43,
    45,
    47,
    49,
    51,
    53,
    55,
    57,
    59,
    61,
    63,
  );
  partition(3).shouldBeIncludedForSessions(2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58, 62);
  partition(4).shouldBeIncludedForSessions(4, 13, 20, 29, 36, 45, 52, 61);
  partition(5).shouldBeIncludedForSessions(12, 28, 44, 60);
  partition(6).shouldBeIncludedForSessions(24, 59);
  partition(7).shouldBeIncludedForSessions(56);
});

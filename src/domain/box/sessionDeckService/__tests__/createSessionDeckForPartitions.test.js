const { flatten } = require('lodash');
const { createSessionDeckForPartitions } = require('../createSessionDeckForPartitions');

describe('create session deck', () => {
  describe(`given a box named "Capitals of the World" containing:
    | partition | id  | question                                | answer     |
    | 1         | aaa | What's the capital of France ?          | Paris      |
    | 1         | bbb | What's the capital of Italy ?           | Roma       |
    | 2         | ccc | What's the capital of the Netherlands ? | Amsterdam  |
    | 2         | ddd | What's the capital of Norway ?          | Oslo       |
    | 2         | eee | What's the capital of Croatia ?         | Zagreb     |
    | 3         | fff | What's the capital of Finland ?         | Helsinki   |
    | 4         | ggg | What's the capital of Sweden ?          | Stockholm  |
    | 4         | hhh | What's the capital of Hungary ?         | Budapest   |
    | 5         | iii | What's the capital of Luxembourg ?      | Luxembourg |
    | 6         | jjj | What's the capital of Spain ?           | Madrid     |
    | 6         | kkk | What's the capital of Denmark ?         | Copenhagen |
    | 7         | lll | What's the capital of Russia ?          | Moscow     |
  `, () => {
    test.each`
      session | lastCompletedSession | partitions
      ${1}    | ${0}                 | ${[2, 1]}
      ${2}    | ${0}                 | ${[3, 2, 1]}
      ${34}   | ${23}                | ${[6, 5, 4, 3, 2, 1]}
      ${58}   | ${55}                | ${[7, 3, 2, 1]}
      ${2}    | ${60}                | ${[4, 3, 2, 1]}
    `(
      'given last completed session is $lastCompletedSession, when session is $session, then the deck should contain flashcards from partitions $partitions',
      ({ lastCompletedSession, session, partitions }) => {
        const boxPartitions = [
          [
            { id: 'aaa', question: "What's the capital of France ?", answer: 'Paris' },
            { id: 'bbb', question: "What's the capital of Italy ?", answer: 'Roma' },
          ],
          [
            { id: 'ccc', question: "What's the capital of the Netherlands ?", answer: 'Amsterdam' },
            { id: 'ddd', question: "What's the capital of Norway ?", answer: 'Oslo' },
            { id: 'eee', question: "What's the capital of Croatia ?", answer: 'Zagreb' },
          ],
          [{ id: 'fff', question: "What's the capital of Finland ?", answer: 'Helsinki' }],
          [
            { id: 'ggg', question: "What's the capital of Sweden ?", answer: 'Stockholm' },
            { id: 'hhh', question: "What's the capital of Hungary ?", answer: 'Budapest' },
          ],
          [{ id: 'iii', question: "What's the capital of Luxembourg ?", answer: 'Luxembourg' }],
          [
            { id: 'jjj', question: "What's the capital of Spain ?", answer: 'Madrid' },
            { id: 'kkk', question: "What's the capital of Denmark ?", answer: 'Copenhagen' },
          ],
          [{ id: 'lll', question: "What's the capital of Russia ?", answer: 'Moscow' }],
        ];
        const createSessionDeck = createSessionDeckForPartitions(boxPartitions);
        expect(createSessionDeck({ session, lastCompletedSession })).toEqual(
          flatten(partitions.map(partition => boxPartitions[partition - 1])),
        );
      },
    );
  });
});

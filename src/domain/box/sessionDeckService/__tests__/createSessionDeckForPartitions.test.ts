import dayjs from 'dayjs';
import { flatten } from 'lodash';
import { PartitionNumber } from '../../partitions';
import { createSessionDeckForPartitions } from '../createSessionDeckForPartitions';
import { createPartitionsFromFlashcardsData } from '../../../../../testsUtils/helpers/dataCreators';

describe('create session deck', () => {
  describe(`given a box named "Capitals of the World" where the first session was started at 2019-04-01 and containing:
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
      sessionDate            | lastCompletedSessionDate | partitions
      ${dayjs('2019-04-01')} | ${undefined}             | ${[2, 1]}
      ${dayjs('2019-04-03')} | ${undefined}             | ${[3, 2, 1]}
      ${dayjs('2019-05-04')} | ${dayjs('2019-04-23')}   | ${[6, 5, 4, 3, 2, 1]}
      ${dayjs('2019-05-28')} | ${dayjs('2019-05-25')}   | ${[7, 3, 2, 1]}
      ${dayjs('2019-06-06')} | ${dayjs('2019-05-30')}   | ${[4, 3, 2, 1]}
    `(
      'given last completed session is $lastCompletedSession, when session is $session, then the deck should contain flashcards from partitions $partitions',
      ({ lastCompletedSessionDate, sessionDate, partitions }) => {
        const boxPartitions = createPartitionsFromFlashcardsData([
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
        ]);
        const createSessionDeck = createSessionDeckForPartitions(boxPartitions);
        expect(
          createSessionDeck({
            dateOfFirstSession: dayjs('2019-04-01').toDate(),
            sessionDate,
            lastCompletedSessionDate,
          }),
        ).toEqual(flatten(partitions.map((partition: PartitionNumber) => boxPartitions[partition])));
      },
    );
  });
});

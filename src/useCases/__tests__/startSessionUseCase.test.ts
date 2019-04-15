import { AuthenticationGateway } from '../../adapters/inMemory/authenticationGateway';
import { BoxRepository } from '../../adapters/inMemory/boxRepository';
import { Player } from '../../domain/player/player';
import { StartSessionUseCase } from '../startSessionUseCase';
import { createBox } from '../../../testsUtils/helpers/dataCreators';
import { flashcardsInPartitions, flashcardsInDeck } from '../../../testsUtils/helpers/dataViews';
import dayjs = require('dayjs');

describe('starting the first session in the box "Capitals of the World" of the player42', () => {
  describe(`given a box named "Capitals of the World" containing:
    | partition | id  | question                                | answer     |
    | 1         | bbb | What's the capital of Italy ?           | Roma       |
    | 1         | aaa | What's the capital of France ?          | Paris      |
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
    describe('and the player42 never played the box "Capitals of the World" before', () => {
      describe('when player42 starts a session for the box "Capitals of the World"', () => {
        test('then the selected deck should contains flashcards from partition 2 and 1', async () => {
          const authenticationGateway = AuthenticationGateway();
          const boxRepository = BoxRepository();
          await authenticationGateway.authenticate(Player.ofId('42'));
          const currentPlayer = authenticationGateway.getCurrentPlayer();
          const boxToSave = createBox({
            boxName: 'Capitals of the World',
            ownedByPlayerWithId: currentPlayer.id,
            partitions: [
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
            ],
          });
          await boxRepository.save(boxToSave);
          await StartSessionUseCase({ boxRepository, authenticationGateway }).handle({
            boxName: 'Capitals of the World',
            today: new Date(),
          });
          const box = await boxRepository.getBoxByName({
            boxName: 'Capitals of the World',
            playerId: currentPlayer.id,
          });
          expect(
            flashcardsInPartitions({
              box,
              partitions: [2, 1],
            }),
          ).toEqual(flashcardsInDeck({ deck: box.sessionDeck }));
        });
      });
    });
    describe('and the player42 has started the box "Capitals of the World" at 2019-04-01', () => {
      describe('when player42 starts a session for the box "Capitals of the World" the 2019-04-02', () => {
        test('then the selected deck should contains flashcards from partition 3 and 1', async () => {
          const authenticationGateway = AuthenticationGateway();
          const boxRepository = BoxRepository();
          await authenticationGateway.authenticate(Player.ofId('42'));
          const currentPlayer = authenticationGateway.getCurrentPlayer();
          const boxToSave = createBox({
            boxName: 'Capitals of the World',
            ownedByPlayerWithId: currentPlayer.id,
            partitions: [
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
            ],
          });
          await boxRepository.save(boxToSave);
          await StartSessionUseCase({ boxRepository, authenticationGateway }).handle({
            boxName: 'Capitals of the World',
            today: dayjs('2019-04-01').toDate(),
          });
          await StartSessionUseCase({ boxRepository, authenticationGateway }).handle({
            boxName: 'Capitals of the World',
            today: dayjs('2019-04-02').toDate(),
          });
          const box = await boxRepository.getBoxByName({
            boxName: 'Capitals of the World',
            playerId: currentPlayer.id,
          });
          expect(
            flashcardsInPartitions({
              box,
              partitions: [3, 1],
            }),
          ).toEqual(flashcardsInDeck({ deck: box.sessionDeck }));
        });
      });
      describe('and the player42 last session was the 2019-04-10', () => {
        describe('when player42 starts a session for the box "Capitals of the World" the 2019-04-13', () => {
          test('then the selected deck should contains flashcards from partition 5,4,2 and 1', async () => {
            const authenticationGateway = AuthenticationGateway();
            const boxRepository = BoxRepository();
            await authenticationGateway.authenticate(Player.ofId('42'));
            const currentPlayer = authenticationGateway.getCurrentPlayer();
            const boxToSave = createBox({
              boxName: 'Capitals of the World',
              ownedByPlayerWithId: currentPlayer.id,
              partitions: [
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
              ],
            });
            await boxRepository.save(boxToSave);
            await StartSessionUseCase({ boxRepository, authenticationGateway }).handle({
              boxName: 'Capitals of the World',
              today: dayjs('2019-04-01').toDate(),
            });
            await StartSessionUseCase({ boxRepository, authenticationGateway }).handle({
              boxName: 'Capitals of the World',
              today: dayjs('2019-04-02').toDate(),
            });
            await StartSessionUseCase({ boxRepository, authenticationGateway }).handle({
              boxName: 'Capitals of the World',
              today: dayjs('2019-04-03').toDate(),
            });
            await StartSessionUseCase({ boxRepository, authenticationGateway }).handle({
              boxName: 'Capitals of the World',
              today: dayjs('2019-04-04').toDate(),
            });
            await StartSessionUseCase({ boxRepository, authenticationGateway }).handle({
              boxName: 'Capitals of the World',
              today: dayjs('2019-04-05').toDate(),
            });
            await StartSessionUseCase({ boxRepository, authenticationGateway }).handle({
              boxName: 'Capitals of the World',
              today: dayjs('2019-04-06').toDate(),
            });
            await StartSessionUseCase({ boxRepository, authenticationGateway }).handle({
              boxName: 'Capitals of the World',
              today: dayjs('2019-04-07').toDate(),
            });
            await StartSessionUseCase({ boxRepository, authenticationGateway }).handle({
              boxName: 'Capitals of the World',
              today: dayjs('2019-04-08').toDate(),
            });
            await StartSessionUseCase({ boxRepository, authenticationGateway }).handle({
              boxName: 'Capitals of the World',
              today: dayjs('2019-04-09').toDate(),
            });
            await StartSessionUseCase({ boxRepository, authenticationGateway }).handle({
              boxName: 'Capitals of the World',
              today: dayjs('2019-04-10').toDate(),
            });
            await StartSessionUseCase({ boxRepository, authenticationGateway }).handle({
              boxName: 'Capitals of the World',
              today: dayjs('2019-04-13').toDate(),
            });
            const box = await boxRepository.getBoxByName({
              boxName: 'Capitals of the World',
              playerId: currentPlayer.id,
            });
            expect(
              flashcardsInPartitions({
                box,
                partitions: [5, 4, 2, 1],
              }),
            ).toEqual(flashcardsInDeck({ deck: box.sessionDeck }));
          });
        });
      });
    });
  });
});

import flatMap from 'lodash/flatMap';
import expect from 'expect';
import { Then } from 'cucumber';
import { SessionDeckQuery } from '../../src/queries/sessionDeckQuery';
import { CurrentFlashcardQuestionQuery } from '../../src/queries/currentFlashcardQuestionQuery';
import { PartitionNumber } from '../../src/domain/box/partitions';

Then(
  /^the session deck for the box "([\w\W]*)" should contain flashcards questions from partitions ([1-7]+(?:,[1-7])*)/,
  async function(boxName, comaSeparatedPartitions) {
    const { boxRepository, authenticationGateway } = this.dependencies;
    const sessionDeckQuery = SessionDeckQuery({ boxRepository });
    const playerId = authenticationGateway.getCurrentPlayer().id;
    const partitions: PartitionNumber[] = comaSeparatedPartitions
      .split(',')
      .map((stringNumber: string) => parseInt(stringNumber, 10));
    const box = await boxRepository.getBoxByName({
      playerId,
      boxName,
    });
    const expectedFlashcardsQuestionInPartitions = flatMap(partitions, partitionNumber =>
      box.partitions[partitionNumber].map(({ question }) => question),
    );
    const theFlashcardsInDeck = await sessionDeckQuery.execute({ boxName, playerId });
    expect(expectedFlashcardsQuestionInPartitions.length).toBeGreaterThan(0);
    expect(theFlashcardsInDeck.length).toBeGreaterThan(0);
    expect(theFlashcardsInDeck).toEqual(expectedFlashcardsQuestionInPartitions);
  },
);

Then('the first flashcard question to review for the box {string} should be {string}', async function(
  boxName,
  flashcardQuestion,
) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  const currentFlashcardQuestionQuery = CurrentFlashcardQuestionQuery({ boxRepository });
  const currentFlashcardQuestion = await currentFlashcardQuestionQuery.execute({
    boxName,
    playerId: authenticationGateway.getCurrentPlayer().id,
  });
  expect(currentFlashcardQuestion).toEqual(flashcardQuestion);
});

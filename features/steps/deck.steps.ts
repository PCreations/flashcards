import dayjs from 'dayjs';
import flatMap from 'lodash/flatMap';
import expect from 'expect';
import { Then, Given } from 'cucumber';
import { SessionDeckQuery } from '../../src/queries/sessionDeckQuery';
import { CurrentFlashcardQuestionQuery } from '../../src/queries/currentFlashcardQuestionQuery';
import { CurrentFlashcardAnswerQuery } from '../../src/queries/currentFlashcardAnswerQuery';
import { PartitionNumber } from '../../src/domain/box/partitions';
import { StartSessionUseCase } from '../../src/useCases/startSessionUseCase';

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

Given('the flashcard question to review for the box {string} is {string}', async function(
  boxName,
  currentlyReviewedQuestion,
) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  const startSessionUseCase = StartSessionUseCase({ boxRepository, authenticationGateway });
  let box = await boxRepository.getBoxByName({
    boxName,
    playerId: authenticationGateway.getCurrentPlayer().id,
  });
  while (
    !box.sessionsPartitions.find(partionNumber =>
      Boolean(
        ~box.partitions[partionNumber].findIndex(({ question }) => question === currentlyReviewedQuestion),
      ),
    )
  ) {
    await startSessionUseCase.handle({
      boxName,
      today: dayjs(box.lastStartedSessionDate)
        .add(1, 'day')
        .toDate(),
    });
    box = await boxRepository.getBoxByName({
      boxName,
      playerId: authenticationGateway.getCurrentPlayer().id,
    });
  }
});

Then('the answer of the current reviewed flashcard for the box {string} should be {string}', async function(
  boxName,
  answer,
) {
  const { boxRepository, authenticationGateway } = this.dependencies;
  const currentFlashcardAnswerQuery = CurrentFlashcardAnswerQuery({ boxRepository });
  const flashcardAnswer = await currentFlashcardAnswerQuery.execute({
    boxName,
    playerId: authenticationGateway.getCurrentPlayer().id,
  });
  expect(flashcardAnswer).toEqual(answer);
});

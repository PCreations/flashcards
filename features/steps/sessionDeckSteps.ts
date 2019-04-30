import { DefineStepFunction } from 'jest-cucumber';
import dayjs from 'dayjs';
import { SessionDeckQuery } from '../../src/queries/sessionDeckQuery';
import { flatMap, isEqual } from 'lodash';
import { PartitionNumber } from '../../src/domain/box/partitions';
import { Box, SessionFlashcard } from '../../src/domain/box/box';
import { StartSessionUseCase } from '../../src/useCases/startSessionUseCase';
import { CurrentFlashcardQuestionQuery } from '../../src/queries/currentFlashcardQuestionQuery';
import { DependenciesContainer } from '../dependencies';

export const sessionDeckSteps = {
  'then the session deck for the box "(.*)" should contain flashcards questions from partitions (.*)': (
    getTheBoxBeforeHavingStartedTheSession: () => Box,
    then: DefineStepFunction,
    depsContainer: DependenciesContainer,
  ) => {
    then(
      /^the session deck for the box "(.*)" should contain flashcards questions from partitions (.*)$/,
      async (boxName, commaSeparatedPartitions) => {
        const { boxRepository, authenticationGateway } = depsContainer.dependencies;
        const sessionDeckQuery = SessionDeckQuery({ boxRepository });
        const playerId = authenticationGateway.getCurrentPlayer().id;
        const partitions: PartitionNumber[] = commaSeparatedPartitions
          .split(',')
          .map((stringNumber: string) => parseInt(stringNumber, 10));
        const box = await boxRepository.getBoxByName({
          playerId,
          boxName,
        });
        const expectedFlashcardsQuestions = flatMap(partitions, partition =>
          getTheBoxBeforeHavingStartedTheSession()
            .partitions.get(partition)
            .map(flashcard => flashcard.question)
            .toArray(),
        );
        box.sessionFlashcards.map(sessionFlashcard => sessionFlashcard.flashcard.question).toArray();
        const theFlashcardsInDeck = await sessionDeckQuery.execute({ boxName, playerId });
        expect(expectedFlashcardsQuestions.length).toBeGreaterThan(0);
        expect(theFlashcardsInDeck.length).toBeGreaterThan(0);
        expect(theFlashcardsInDeck).toEqual(expectedFlashcardsQuestions);
      },
    );
  },
  'and the flashcards to review for the current session of the box "(.*)" are taken from partitions "(.*)"': (
    and: DefineStepFunction,
    depsContainer: DependenciesContainer,
    setCurrentReviewingFlashcard: (sessionFlashcard: SessionFlashcard) => void
  ) => {
    and(/^the flashcards to review for the current session of the box "(.*)" are taken from partitions "(.*)"$/, async (boxName, commaSeparatedPartitions) => {
      const { boxRepository, authenticationGateway } = depsContainer.dependencies;
      const startSessionUseCase = StartSessionUseCase({ boxRepository, authenticationGateway });
      const expectedPartitions = commaSeparatedPartitions
        .split(',')
        .map((stringNumber: string) => parseInt(stringNumber, 10)) as PartitionNumber[];
      let box = await boxRepository.getBoxByName({
        boxName,
        playerId: authenticationGateway.getCurrentPlayer().id,
      });
      while (!isEqual(box.sessionsPartitions, expectedPartitions)) {
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
      setCurrentReviewingFlashcard(box.sessionFlashcards.first());
    });
  },
  'and the flashcard question to review for the box "Capitals of the World" is "(.*)"': (
    getCurrentlyReviewedFlashcard: () => SessionFlashcard,
    and: DefineStepFunction,
  ) => {
    and(/^the flashcard question to review for the box "Capitals of the World" is "(.*)"$/, async (questionToReview) => {
      expect(getCurrentlyReviewedFlashcard().flashcard.question).toEqual(questionToReview);
    });
  },
  'and the currently reviewed flashcard for the box "(.*)" should now be at the end of the partition (\d)': (
    getCurrentlyReviewedFlashcard: () => SessionFlashcard,
    and: DefineStepFunction,
    depsContainer: DependenciesContainer
  ) => {
    and(/^the currently reviewed flashcard for the box "(.*)" should now be at the end of the partition (\d)$/, async (boxName, partitionNumber) => {
      const { boxRepository, authenticationGateway } = depsContainer.dependencies;
      const box = await boxRepository.getBoxByName({
        boxName,
        playerId: authenticationGateway.getCurrentPlayer().id,
      });
      expect(box.partitions.get(parseInt(partitionNumber, 10) as PartitionNumber).last()).toEqual(
        getCurrentlyReviewedFlashcard().flashcard,
      );
    });
  },
  'and the flashcard question to review for the box "(.*)" should be "(.*)"': (
    and: DefineStepFunction,
    depsContainer: DependenciesContainer
  ) => {
    and(/^the flashcard question to review for the box "(.*)" should be "(.*)"$/, async (boxName, expectedQuestionToReview) => {
      const { boxRepository, authenticationGateway } = depsContainer.dependencies;
      const currentFlashcardQuestionQuery = CurrentFlashcardQuestionQuery({ boxRepository });
      const currentFlashcardQuestion = await currentFlashcardQuestionQuery.execute({
        boxName,
        playerId: authenticationGateway.getCurrentPlayer().id,
      });
      expect(currentFlashcardQuestion).toEqual(expectedQuestionToReview);
    });
  }
};

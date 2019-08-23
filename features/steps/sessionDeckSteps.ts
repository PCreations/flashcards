import { DefineStepFunction } from 'jest-cucumber';
import dayjs from 'dayjs';
import { sessionDeckQuery as createSessionDeckQuery } from '../../src/queries/sessionDeckQuery';
import { flatMap, isEqual } from 'lodash';
import { PartitionNumber } from '../../src/domain/box/partitions';
import { Box, SessionFlashcard, startSession } from '../../src/domain/box/box';
import { currentFlashcardQuestionQuery as createCurrentFlashcardQuestionQuery } from '../../src/queries/currentFlashcardQuestionQuery';
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
        const {
          box: { getBoxByNameAndPlayerId },
          player: { getCurrentPlayerId },
        } = depsContainer.dependencies;
        const sessionDeckQuery = createSessionDeckQuery(getBoxByNameAndPlayerId);
        const playerId = getCurrentPlayerId();
        const partitions: PartitionNumber[] = commaSeparatedPartitions
          .split(',')
          .map((stringNumber: string) => parseInt(stringNumber, 10));
        const expectedFlashcardsQuestions = flatMap(partitions, partition =>
          getTheBoxBeforeHavingStartedTheSession()
            .partitions.get(partition)
            .map(flashcard => flashcard.question)
            .toArray(),
        );
        const theFlashcardsInDeck = await sessionDeckQuery({ boxName, playerId });
        expect(expectedFlashcardsQuestions.length).toBeGreaterThan(0);
        expect(theFlashcardsInDeck.length).toBeGreaterThan(0);
        expect(theFlashcardsInDeck).toEqual(expectedFlashcardsQuestions);
      },
    );
  },
  'and the flashcards to review for the current session of the box "(.*)" are taken from partitions "(.*)"': (
    and: DefineStepFunction,
    depsContainer: DependenciesContainer,
    setCurrentReviewingFlashcard: (sessionFlashcard: SessionFlashcard) => void,
  ) => {
    and(
      /^the flashcards to review for the current session of the box "(.*)" are taken from partitions "(.*)"$/,
      async (boxName, commaSeparatedPartitions) => {
        const {
          box: { getBoxByNameAndPlayerId, saveBox },
          player: { getCurrentPlayerId },
        } = depsContainer.dependencies;
        const expectedPartitions = commaSeparatedPartitions
          .split(',')
          .map((stringNumber: string) => parseInt(stringNumber, 10)) as PartitionNumber[];
        let box = await getBoxByNameAndPlayerId({
          boxName,
          playerId: getCurrentPlayerId(),
        });
        while (!isEqual(box.sessionsPartitions, expectedPartitions)) {
          const today = dayjs(box.lastStartedSessionDate || undefined)
            .add(1, 'day')
            .toDate();
          box = startSession(today)(box);
        }
        await saveBox(box);
        setCurrentReviewingFlashcard(box.sessionFlashcards.first());
      },
    );
  },
  'and the flashcard question to review for the box "Capitals of the World" is "(.*)"': (
    getCurrentlyReviewedFlashcard: () => SessionFlashcard,
    and: DefineStepFunction,
  ) => {
    and(
      /^the flashcard question to review for the box "Capitals of the World" is "(.*)"$/,
      async questionToReview => {
        expect(getCurrentlyReviewedFlashcard().flashcard.question).toEqual(questionToReview);
      },
    );
  },
  'and the currently reviewed flashcard for the box "(.*)" should now be at the end of the partition (d)': (
    getCurrentlyReviewedFlashcard: () => SessionFlashcard,
    and: DefineStepFunction,
    depsContainer: DependenciesContainer,
  ) => {
    and(
      /^the currently reviewed flashcard for the box "(.*)" should now be at the end of the partition (\d)$/,
      async (boxName, partitionNumber) => {
        const {
          box: { getBoxByNameAndPlayerId },
          player: { getCurrentPlayerId },
        } = depsContainer.dependencies;
        const box = await getBoxByNameAndPlayerId({
          boxName,
          playerId: getCurrentPlayerId(),
        });
        expect(box.partitions.get(parseInt(partitionNumber, 10) as PartitionNumber).last()).toEqual(
          getCurrentlyReviewedFlashcard().flashcard,
        );
      },
    );
  },
  'and the flashcard question to review for the box "(.*)" should be "(.*)"': (
    and: DefineStepFunction,
    depsContainer: DependenciesContainer,
  ) => {
    and(
      /^the flashcard question to review for the box "(.*)" should be "(.*)"$/,
      async (boxName, expectedQuestionToReview) => {
        const {
          box: { getBoxByNameAndPlayerId },
          player: { getCurrentPlayerId },
        } = depsContainer.dependencies;
        const currentFlashcardQuestionQuery = createCurrentFlashcardQuestionQuery(getBoxByNameAndPlayerId);
        const currentFlashcardQuestion = await currentFlashcardQuestionQuery({
          boxName,
          playerId: getCurrentPlayerId(),
        });
        expect(currentFlashcardQuestion).toEqual(expectedQuestionToReview);
      },
    );
  },
};

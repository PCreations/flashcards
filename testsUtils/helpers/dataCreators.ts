import { Box } from '../../src/domain/box/box';
import { Flashcard } from '../../src/domain/box/flashcard';
import { Partitions, PartitionNumber } from '../../src/domain/box/partitions';
import { SessionNumber } from '../../src/domain/box/sessionNumber';
import { Player } from '../../src/domain/player/player';

const addFlashcardsInPartition = (
  box: Box,
  flashcards: { id: string; answer: string; question: string }[],
  partitionIndex: number,
) =>
  flashcards.reduce(
    (theBox, { id, question, answer }) =>
      theBox
        .addFlashcard(
          Flashcard.ofQuestion(question)
            .withAnswer(answer)
            .withId(id),
        )
        .inPartition(((partitionIndex + 1) as any) as PartitionNumber),
    box,
  );

export const createBox = ({
  boxName,
  ownedByPlayerWithId,
  startedAt,
  partitions = [[]],
}: {
  boxName?: string;
  ownedByPlayerWithId?: string;
  startedAt?: Date;
  partitions?: { id: string; answer: string; question: string }[][];
} = {}) =>
  partitions.reduce(
    addFlashcardsInPartition,
    Box.named(boxName)
      .ownedBy(Player.ofId(ownedByPlayerWithId))
      .whereFirstSessionStartedAt(startedAt),
  );

type FlashcardDatatable = {
  hashes: () => {
    id: string;
    answer: string;
    question: string;
  }[];
};

export const createFlashcardsFromGherkinDatatable = (flashcardsDatatable: FlashcardDatatable) =>
  flashcardsDatatable.hashes().map(({ id, answer, question }) =>
    Flashcard.ofQuestion(question)
      .withAnswer(answer)
      .withId(id),
  );

const createFlashcard = ({ id, answer, question }: { id: string; answer: string; question: string }) =>
  Flashcard.ofQuestion(question)
    .withAnswer(answer)
    .withId(id);

export const createPartitionsFromFlashcardsData = (
  flashcardsData: {
    id: string;
    answer: string;
    question: string;
  }[][],
): Partitions => ({
  1: flashcardsData[0].map(createFlashcard),
  2: flashcardsData[1].map(createFlashcard),
  3: flashcardsData[2].map(createFlashcard),
  4: flashcardsData[3].map(createFlashcard),
  5: flashcardsData[4].map(createFlashcard),
  6: flashcardsData[5].map(createFlashcard),
  7: flashcardsData[6].map(createFlashcard),
});

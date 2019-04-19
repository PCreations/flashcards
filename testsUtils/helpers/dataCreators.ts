import flow from 'lodash/fp/flow';
import {
  createBox as createDomainBox,
  named,
  ownedBy,
  whereFirstSessionStartedAt,
  addFlashcard,
} from '../../src/domain/box/box';
import {
  Flashcard,
  createFlashcard as createDomainFlashcard,
  ofQuestion,
  withAnswer,
} from '../../src/domain/box/flashcard';
import { Partitions, PartitionNumber } from '../../src/domain/box/partitions';
import { Player } from '../../src/domain/player/player';

const addFlashcardsInPartition = (flashcards: Flashcard[], partition: PartitionNumber) =>
  flow(flashcards.map(flashcard => addFlashcard({ flashcard, partition })));

const withFlashcardsInPartitions = (partitions: Flashcard[][]) =>
  flow(
    partitions.map((flashcards, partitionIndex) =>
      addFlashcardsInPartition(flashcards, (partitionIndex + 1) as PartitionNumber),
    ),
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
  partitions?: { answer: string; question: string }[][];
} = {}) =>
  createDomainBox(
    named(boxName),
    ownedBy(Player.ofId(ownedByPlayerWithId)),
    whereFirstSessionStartedAt(startedAt),
    withFlashcardsInPartitions(partitions),
  );

type FlashcardDatatable = {
  hashes: () => {
    answer: string;
    question: string;
  }[];
};

const createFlashcard = ({ answer, question }: { answer: string; question: string }) =>
  createDomainFlashcard(ofQuestion(question), withAnswer(answer));

export const createFlashcardsFromGherkinDatatable = (flashcardsDatatable: FlashcardDatatable) =>
  flashcardsDatatable.hashes().map(createFlashcard);

export const createPartitionsFromFlashcardsData = (
  flashcardsData: {
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

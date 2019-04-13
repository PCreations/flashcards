import { Box } from '../../src/domain/box/box';
import { PartitionNumber } from '../../src/domain/box/partitions';
import { Flashcard } from '../../src/domain/box/flashcard';

export const flashcardsInPartitions = ({ box, partitions }: { box: Box; partitions: PartitionNumber[] }) =>
  box.getFlashcardsInPartitions(...partitions).map(({ id, question, answer }) => ({ id, question, answer }));

export const flashcardsInDeck = ({ deck }: { deck: Flashcard[] }) =>
  deck.map(({ id, question, answer }) => ({ id, question, answer }));

import { Flashcard } from './flashcard';

export type PartitionNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Partitions = { [n in PartitionNumber]: Flashcard[] };

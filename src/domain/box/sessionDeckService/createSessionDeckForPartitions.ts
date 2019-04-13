import { flow, flatMap } from 'lodash/fp';
import { getPartitionsNumbers } from './getPartitionsNumbers';
import { Partitions } from '../partitions';

export const createSessionDeckForPartitions = (partitions: Partitions) =>
  flow(
    getPartitionsNumbers,
    flatMap(partitionNumber => partitions[partitionNumber]),
  );

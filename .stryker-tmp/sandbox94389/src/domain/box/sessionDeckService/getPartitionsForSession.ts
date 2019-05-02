import { uniq, orderBy, identity, flatMap, flow } from 'lodash/fp';
import { PartitionNumber } from '../partitions';
import { leitnerSchedule } from './leitnerSchedule';
import { sessionRange } from './sessionRange';

const orderPartitionsNumbersByDescOrder = (partitionsNumbers: PartitionNumber[]) =>
  orderBy(identity, 'desc', partitionsNumbers);

const uniqPartitionsNumbers = (partitionsNumbers: PartitionNumber[]) => uniq(partitionsNumbers);

export const getPartitionsForSession = flow(
  sessionRange,
  flatMap(leitnerSchedule),
  orderPartitionsNumbersByDescOrder,
  uniqPartitionsNumbers,
);

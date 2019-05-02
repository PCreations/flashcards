import { PartitionNumber } from '../partitions';
import { SessionNumber } from '../sessionNumber';

const partition = (
  partitionNumber: PartitionNumber,
  { startAt, interval }: { startAt: SessionNumber; interval: number },
  session: SessionNumber,
) => (session % interval === startAt ? partitionNumber : null);

export const leitnerSchedule = (session: SessionNumber) =>
  [1]
    .concat(partition(2, { startAt: 1, interval: 2 }, session))
    .concat(partition(3, { startAt: 2, interval: 4 }, session))
    .concat(partition(4, { startAt: 4, interval: 16 }, session))
    .concat(partition(4, { startAt: 13, interval: 16 }, session))
    .concat(partition(5, { startAt: 12, interval: 16 }, session))
    .concat(partition(6, { startAt: 24, interval: 35 }, session))
    .concat(partition(7, { startAt: 56, interval: 64 }, session))
    .filter(Boolean)
    .sort((a, b) => b - a);

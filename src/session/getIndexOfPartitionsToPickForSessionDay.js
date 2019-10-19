const getIndexOfPartitionsToPickForSessionDay = day => {
  const daysInterval = [5, 4, 3, 2, 1];
  return daysInterval.reduce(
    (partitions, dayNumber) => (day % dayNumber === 0 ? partitions.concat([dayNumber - 1]) : partitions),
    [],
  );
};

module.exports = {
  getIndexOfPartitionsToPickForSessionDay,
};

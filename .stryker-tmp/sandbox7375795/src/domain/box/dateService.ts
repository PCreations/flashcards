export const DateService = ({ getToday }: { getToday: () => Date }) =>
  Object.freeze({
    getToday,
  });

export type DateService = ReturnType<typeof DateService>;

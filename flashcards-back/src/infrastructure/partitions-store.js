const createPartitionsNotFoundError = boxId =>
  new Error(`Can't find partitions for box ${boxId}`);

const create = ({ firestore, partitionsData } = {}) => {
  let init = Promise.resolve();
  if (typeof partitionsData !== "undefined") {
    const [[boxId, partitions]] = Object.entries(partitionsData);
    init = firestore
      .collection("partitions")
      .doc(boxId)
      .set(
        partitions.reduce(
          (partitionsMap, flashcards, index) => ({
            ...partitionsMap,
            [index + 1]: flashcards
          }),
          {}
        )
      );
  }
  return {
    async getAll(boxId) {
      await init;
      let doc;
      try {
        doc = await firestore
          .collection("partitions")
          .doc(boxId)
          .get();
      } catch (err) {
        throw new Error(`Error getting document : ${err.message}`);
      }
      if (!doc.exists) {
        throw createPartitionsNotFoundError(boxId);
      }
      return Object.values(doc.data());
    },
    async save({ boxId, partitionsData }) {
      await init;
      await firestore
        .collection("partitions")
        .doc(boxId)
        .set(
          partitionsData.reduce(
            (partitionsMap, flashcards, index) => ({
              ...partitionsMap,
              [index + 1]: flashcards
            }),
            {}
          )
        );
    }
  };
};

const createInMemory = ({ partitionsData = {} } = {}) => {
  const store = partitionsData;
  return {
    async getAll(boxId) {
      if (typeof store[boxId] === "undefined") {
        throw createPartitionsNotFoundError(boxId);
      }
      return store[boxId];
    },
    async save({ boxId, partitionsData }) {
      store[boxId] = partitionsData;
    },
    _store: store
  };
};

module.exports = {
  create,
  createInMemory
};

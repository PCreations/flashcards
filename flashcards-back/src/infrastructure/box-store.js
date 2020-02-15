const { createBox } = require("../domain/box");

const createPartitionsNotFoundError = boxId =>
  new Error(`Can't find box ${boxId}`);

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
    async get(boxId) {
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
      return createBox({
        id: boxId,
        partitions: Object.values(doc.data())
      });
    },
    async save(box = createBox()) {
      await init;
      await firestore
        .collection("partitions")
        .doc(box.id)
        .set(
          box.partitions.reduce(
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
    async get(boxId) {
      if (typeof store[boxId] === "undefined") {
        throw createPartitionsNotFoundError(boxId);
      }
      return createBox({
        id: boxId,
        partitions: store[boxId]
      });
    },
    async save(box = createBox()) {
      store[box.id] = box.partitions;
    },
    _store: store
  };
};

module.exports = {
  create,
  createInMemory
};

const uuidv1 = require("uuid/v1");
const { createBox } = require("../domain/box");

const createPartitionsNotFoundError = boxId =>
  new Error(`Can't find box ${boxId}`);

const BoxStore = ({ firestore, uuid }) => ({
  async get(boxId) {
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
    return firestore
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
  },
  getNextFlashcardId() {
    return uuid();
  }
});

const create = ({ firestore }) => BoxStore({ firestore, uuid: uuidv1 });

const createInMemory = ({ partitionsByBoxId, nextFlashcardId } = {}) =>
  BoxStore({
    firestore: createNullFirestore(partitionsByBoxId),
    uuid: () => nextFlashcardId
  });

const createNullFirestore = (partitionsByBoxId = {}) => {
  const store = Object.keys(partitionsByBoxId).reduce(
    (boxes, boxId) => ({
      ...boxes,
      [boxId]: partitionsByBoxId[boxId].reduce(
        (partitions, flashcards, index) => ({
          ...partitions,
          [index + 1]: flashcards
        }),
        {}
      )
    }),
    {}
  );
  return {
    collection() {
      return {
        doc(boxId) {
          return {
            async get() {
              return {
                exists: typeof store[boxId] !== "undefined",
                data() {
                  return store[boxId];
                }
              };
            },
            async set(partitions) {
              store[boxId] = partitions;
            }
          };
        }
      };
    }
  };
};

module.exports = {
  create,
  createInMemory
};

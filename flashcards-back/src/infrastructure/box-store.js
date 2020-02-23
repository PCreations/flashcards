const uuidv1 = require("uuid/v1");
const { createBox } = require("../domain/box");

const createBoxNotFoundError = boxId => new Error(`Can't find box ${boxId}`);

const boxToFirestoreBoxData = box => ({
  sessionDay: box.sessionDay,
  sessionScore: box.sessionScore,
  partitions: box.partitions.concat([box.archivedFlashcards]).reduce(
    (partitionsMap, partition, index) => ({
      ...partitionsMap,
      [index]: partition
    }),
    {}
  )
});

const BoxStore = ({ firestore, uuid }) => ({
  async get(boxId) {
    let boxDocument;
    try {
      boxDocument = await firestore
        .collection("boxes")
        .doc(boxId)
        .get();
    } catch (err) {
      throw new Error(`Error getting document : ${err.message}`);
    }
    if (!boxDocument.exists) {
      throw createBoxNotFoundError(boxId);
    }
    const { partitions: partitionsMap, ...boxRest } = boxDocument.data();
    return createBox({
      id: boxId,
      partitions: Object.values(partitionsMap),
      ...boxRest
    });
  },
  async save(box = createBox()) {
    return firestore
      .collection("boxes")
      .doc(box.id)
      .set(boxToFirestoreBoxData(box));
  },
  getNextFlashcardId() {
    return uuid();
  }
});

const create = ({ firestore }) => BoxStore({ firestore, uuid: uuidv1 });

const createInMemory = ({ box, nextFlashcardId } = {}) =>
  BoxStore({
    firestore: createNullFirestore(box),
    uuid: () => nextFlashcardId
  });

const createNullFirestore = box => {
  const store = {};

  if (box) {
    store[box.id] = boxToFirestoreBoxData(box);
  }

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
            set(boxData) {
              boxData; //?
              store[boxId] = boxData;
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

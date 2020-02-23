const uuidv1 = require("uuid/v1");
const { createBox } = require("../domain/box");

const createBoxNotFoundError = boxId => new Error(`Can't find box ${boxId}`);

const PARTITION_COLLECTION_NAME = "partition";

const getBoxDocumentFields = box => ({
  sessionDay: box.sessionDay,
  sessionScore: box.sessionScore
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
    try {
      const partitions = await Promise.all(
        [1, 2, 3, 4, 5].map(partitionNumber =>
          firestore
            .collection("boxes")
            .doc(boxId)
            .collection(`${PARTITION_COLLECTION_NAME}${partitionNumber}`)
            .get()
            .then(snapshot => {
              const flashcards = [];
              snapshot.forEach(doc => flashcards.push(doc.data()));
              return flashcards;
            })
        )
      );
      return createBox({
        id: boxId,
        partitions,
        ...getBoxDocumentFields(boxDocument.data())
      });
    } catch (err) {
      err.stack; //?
      throw new Error(err.message);
    }
  },
  async save(box = createBox()) {
    const batch = firestore.batch();
    batch.set(
      firestore.collection("boxes").doc(box.id),
      getBoxDocumentFields(box)
    );
    box.partitions.forEach((partition, index) => {
      const partitionRef = firestore
        .collection("boxes")
        .doc(box.id)
        .collection(`${PARTITION_COLLECTION_NAME}${index + 1}`);
      partition.forEach(({ id, question, answer }) => {
        batch.set(partitionRef.doc(id), { id, question, answer });
      });
    });
    return batch.commit();
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
  const toFlashcardsMap = partition =>
    partition.reduce(
      (map, flashcard) => ({
        ...map,
        [flashcard.id]: flashcard
      }),
      {}
    );
  const store = {};
  const saveBoxInStore = box => {
    store[box.id] = {
      partitions: {
        partition1: toFlashcardsMap(box.partitions[0]),
        partition2: toFlashcardsMap(box.partitions[1]),
        partition3: toFlashcardsMap(box.partitions[2]),
        partition4: toFlashcardsMap(box.partitions[3]),
        partition5: toFlashcardsMap(box.partitions[4])
      },
      boxFields: getBoxDocumentFields(box)
    };
  };

  const ensureBoxInStore = boxId => {
    if (!store[boxId]) {
      saveBoxInStore(createBox({ id: boxId }));
    }
    return store[boxId];
  };

  if (box) saveBoxInStore(box);

  return {
    batch() {
      const documents = [];
      return {
        set(doc, setParams) {
          documents.push([doc, setParams]);
        },
        commit() {
          documents.forEach(([doc, setParams]) => doc.set(setParams));
        }
      };
    },
    collection() {
      return {
        doc(boxId) {
          return {
            async get() {
              return {
                exists: typeof store[boxId] !== "undefined",
                data() {
                  return getBoxDocumentFields(store[boxId].boxFields);
                }
              };
            },
            set(boxFields) {
              ensureBoxInStore(boxId).boxFields = getBoxDocumentFields(
                boxFields
              );
            },
            collection(partitionName) {
              return {
                doc() {
                  return {
                    set(flashcard) {
                      ensureBoxInStore(boxId).partitions[partitionName][
                        flashcard.id
                      ] = flashcard;
                    }
                  };
                },
                async get() {
                  const flashcards = Object.values(
                    store[boxId].partitions[partitionName]
                  );
                  return {
                    forEach(callback) {
                      flashcards.forEach(flashcard =>
                        callback({
                          data() {
                            return flashcard;
                          }
                        })
                      );
                    }
                  };
                }
              };
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

const firebase = require("@firebase/testing");

const BoxStore = require("../box-store");
const { createBox } = require("../../domain/box");

const partitionsData = [
  [
    {
      id: "1",
      question: "What is the first planet of our solar system ?",
      answer: "Mercury"
    },
    {
      id: "2",
      question: "What is the second planet of our solar system ?",
      answer: "Venus"
    }
  ],
  [
    {
      id: "3",
      question: "What is the third planet of our solar system ?",
      answer: "Earth"
    }
  ],
  [
    {
      id: "4",
      question: "What is the fourth planet of our solar system ?",
      answer: "Mars"
    },
    {
      id: "5",
      question: "What is the fith planet of our solar system ?",
      answer: "Jupiter"
    }
  ],
  [
    {
      id: "6",
      question: "What is the sixth planet of our solar system ?",
      answer: "Saturn"
    }
  ],
  [
    {
      id: "7",
      question: "What is the seventh planet of our solar system ?",
      answer: "Uranus"
    },
    {
      id: "8",
      question: "What is the eighth planet of our solar system ?",
      answer: "Neptune"
    }
  ]
];

const setUpFirestoreData = firestore =>
  firestore
    .collection("boxes")
    .doc("testId")
    .set({
      sessionDay: 1,
      sessionScore: 5,
      partitions: partitionsData.reduce(
        (partitionsMap, partition, index) => ({
          ...partitionsMap,
          [index]: partition
        }),
        {}
      )
    });

describe("BoxStore", () => {
  describe("firestore", () => {
    let firebaseApp, projectId;
    beforeAll(async () => {
      projectId = `${Math.floor(Math.random() * new Date())}`;
      firebaseApp = firebase.initializeAdminApp({
        projectId
      });
      return setUpFirestoreData(firebaseApp.firestore());
    });
    it("should get a box", async () => {
      const boxStore = BoxStore.create({
        firestore: firebaseApp.firestore()
      });
      const box = await boxStore.get("testId");

      expect(box.partitions).toEqual(partitionsData);
      expect(box.sessionScore).toEqual(5);
    });
    it("should throw an error if box can't be retrieved", async () => {
      expect.assertions(1);
      const boxStore = BoxStore.create({
        firestore: firebaseApp.firestore()
      });
      return boxStore.get("erroneousId").catch(err => {
        expect(err.message).toEqual("Can't find box erroneousId");
      });
    });
    it("should save box", async () => {
      const boxStore = BoxStore.create({
        firestore: firebaseApp.firestore()
      });
      await boxStore.save(
        createBox({
          id: "testId",
          partitions: partitionsData,
          sessionDay: 2,
          sessionScore: 4
        })
      );
      const retrievedBox = await boxStore.get("testId");
      expect(retrievedBox.partitions).toEqual(partitionsData);
      expect(retrievedBox.sessionDay).toEqual(2);
      expect(retrievedBox.sessionScore).toEqual(4);
    });
    it("should get the next flashcard id as a string", async () => {
      const boxStore = BoxStore.create({
        firestore: firebaseApp.firestore()
      });
      const nextFlashcardId = boxStore.getNextFlashcardId();
      expect(typeof nextFlashcardId).toBe("string");
    });
    afterAll(async () => {
      await Promise.all(firebase.apps().map(app => app.delete()));
      await firebase.clearFirestoreData({
        projectId
      });
    });
  });
  describe("in memory", () => {
    it("should return the given partitions data", async () => {
      const boxStore = BoxStore.createInMemory({
        box: createBox({
          id: "testId",
          partitions: partitionsData
        })
      });
      const box = await boxStore.get("testId");
      expect(box.partitions).toEqual(partitionsData);
    });
    it("should fail fast if box does not exist in stubbed data", async () => {
      const boxStore = BoxStore.createInMemory();
      await expect(boxStore.get("nonExistingId")).rejects;
    });
    it("should save box", async () => {
      const boxStore = BoxStore.createInMemory();
      await boxStore.save(
        createBox({
          id: "testId2",
          partitions: partitionsData,
          sessionDay: 2,
          sessionScore: 5
        })
      );
      const box = await boxStore.get("testId2");
      expect(box.partitions).toEqual(partitionsData);
      expect(box.sessionDay).toEqual(2);
      expect(box.sessionScore).toEqual(5);
    });
    it("should return the pre-defined next flashcard id", () => {
      const boxStore = BoxStore.createInMemory({ nextFlashcardId: "id42" });
      expect(boxStore.getNextFlashcardId()).toBe("id42");
    });
  });
});

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
      answer: "Neptune",
      partition: 5
    }
  ]
];

describe("BoxStore", () => {
  describe("firestore", () => {
    let firebaseApp, projectId;
    beforeAll(async () => {
      projectId = `${Math.floor(Math.random() * new Date())}`;
      firebaseApp = firebase.initializeAdminApp({
        projectId
      });
    });
    it("should get a box", async () => {
      const boxStore = BoxStore.create({
        firestore: firebaseApp.firestore(),
        partitionsData: {
          testId: partitionsData
        }
      });
      const box = await boxStore.get("testId");

      expect(box.partitions).toEqual(partitionsData);
    });
    it("should throw an error if box can't be retrieved", async () => {
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
        createBox({ id: "testId2", partitions: partitionsData })
      );
      const retrievedBox = await boxStore.get("testId2");
      expect(retrievedBox.partitions).toEqual(partitionsData);
    });
    afterAll(async () => {
      await Promise.all(firebase.apps().map(app => app.delete()));
      await firebase.clearFirestoreData();
    });
  });
  describe("in memory", () => {
    it("should get a box", async () => {
      const boxStore = BoxStore.createInMemory({
        partitionsData: {
          testId: partitionsData
        }
      });
      const box = await boxStore.get("testId");
      expect(box.partitions).toEqual(partitionsData);
    });
    it("should throw an error if box can't be retrieved", async () => {
      const boxStore = BoxStore.createInMemory();
      return boxStore.get("erroneousId").catch(err => {
        expect(err.message).toEqual("Can't find box erroneousId");
      });
    });
    it("should save partitions", async () => {
      const boxStore = BoxStore.createInMemory({
        partitionsData: {
          testId: partitionsData
        }
      });
      await boxStore.save(
        createBox({ id: "testId2", partitions: partitionsData })
      );
      const box = await boxStore.get("testId2");
      expect(box.partitions).toEqual(partitionsData);
    });
  });
});

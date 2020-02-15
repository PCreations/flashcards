const firebase = require("@firebase/testing");

const PartitionsStore = require("../partitions-store");

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

describe("PartitionsStore", () => {
  describe("firestore", () => {
    let firebaseApp, projectId;
    beforeAll(async () => {
      projectId = `${Math.floor(Math.random() * new Date())}`;
      firebaseApp = firebase.initializeAdminApp({
        projectId
      });
    });
    it("should get all partitions", async () => {
      const partitionsStore = PartitionsStore.create({
        firestore: firebaseApp.firestore(),
        partitionsData: {
          testId: partitionsData
        }
      });
      const partitions = await partitionsStore.getAll("testId");

      expect(partitions).toEqual(partitionsData);
    });
    it("should throw an error if partitions can't be retrieved", async () => {
      const partitionsStore = PartitionsStore.create({
        firestore: firebaseApp.firestore()
      });
      return partitionsStore.getAll("erroneousId").catch(err => {
        expect(err.message).toEqual(
          "Can't find partitions for box erroneousId"
        );
      });
    });
    it("should save partitions", async () => {
      const partitionsStore = PartitionsStore.create({
        firestore: firebaseApp.firestore()
      });
      await partitionsStore.save({ boxId: "testId2", partitionsData });
      const retrievedPartitions = await partitionsStore.getAll("testId2");
      expect(retrievedPartitions).toEqual(partitionsData);
    });
    afterAll(async () => {
      await Promise.all(firebase.apps().map(app => app.delete()));
      await firebase.clearFirestoreData();
    });
  });
  describe("in memory", () => {
    it("should get all partitions", async () => {
      const partitionsStore = PartitionsStore.createInMemory({
        partitionsData: {
          testId: partitionsData
        }
      });
      const partitions = await partitionsStore.getAll("testId");
      expect(partitions).toEqual(partitionsData);
    });
    it("should throw an error if partitions can't be retrieved", async () => {
      const partitionsStore = PartitionsStore.createInMemory();
      return partitionsStore.getAll("erroneousId").catch(err => {
        expect(err.message).toEqual(
          "Can't find partitions for box erroneousId"
        );
      });
    });
    it("should save partitions", async () => {
      const partitionsStore = PartitionsStore.createInMemory({
        partitionsData: {
          testId: partitionsData
        }
      });
      await partitionsStore.save({ boxId: "testId2", partitionsData });
      const retrievedPartitions = await partitionsStore.getAll("testId2");
      expect(retrievedPartitions).toEqual(partitionsData);
    });
  });
});

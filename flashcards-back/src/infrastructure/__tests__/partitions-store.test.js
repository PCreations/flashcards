const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.join(
  __dirname,
  "./firebase-service-account.json"
);

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
    let firestore, testApp, testId;
    beforeEach(async () => {
      testId = `test_${Math.floor(Math.random() * new Date())}`;
      testApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath)
      });
      firestore = admin.firestore();
      return firestore
        .collection("partitions")
        .doc(testId)
        .set(
          partitionsData.reduce(
            (partitionsMap, flashcards, index) => ({
              ...partitionsMap,
              [index + 1]: flashcards
            }),
            {}
          )
        );
    });
    it("getAll", async () => {
      const partitionsStore = PartitionsStore.create(firestore);
      const partitions = await partitionsStore.getAll(testId);

      expect(partitions).toEqual(partitionsData);
    });
    afterEach(async () => {
      await firestore
        .collection("partitions")
        .doc(testId)
        .delete();
      return testApp.delete();
    });
  });
  describe("in memory", () => {
    it("getPartitions", async () => {
      const partitionsStore = PartitionsStore.createInMemory({
        testId: partitionsData
      });
      const partitions = await partitionsStore.getAll("testId");
      expect(partitions).toEqual(partitionsData);
    });
  });
});

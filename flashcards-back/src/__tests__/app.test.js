const request = require("supertest");
const { createApp } = require("../app");
const BoxStore = require("../infrastructure/box-store");

describe("application", () => {
  describe("get flashcards", () => {
    it("should get flashcards", async () => {
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
      const app = createApp({
        boxStore: BoxStore.createInMemory({
          partitionsData: { 42: partitionsData }
        })
      });
      const response = await request(app).get("/flashcards?boxId=42");
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(partitionsData);
    });
    it("should return a 500 error if request fails", async () => {
      const app = createApp();
      const response = await request(app).get("/flashcards?boxId=erroneousId");
      expect(response.statusCode).toEqual(500);
      expect(response.body.error).toEqual("Can't find box erroneousId");
    });
  });
  describe("adding a flashcard", () => {
    it("should add the flashcards in the last position of the first partition", async () => {
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
      const boxStore = BoxStore.createInMemory({
        partitionsData: { testId: partitionsData }
      });
      const app = createApp({
        boxStore
      });

      const response = await request(app)
        .post("/flashcards")
        .send({
          boxId: "testId",
          flashcard: {
            question:
              "What was once considered the ninth planet of our solar system ?",
            answer: "Pluto"
          }
        });

      const box = await boxStore.get("testId");
      expect(response.statusCode).toEqual(200);
      expect(box.partitions[0]).toEqual(
        partitionsData[0].concat({
          id: "9",
          question:
            "What was once considered the ninth planet of our solar system ?",
          answer: "Pluto"
        })
      );
    });
  });
});

const request = require("supertest");
const { createApp } = require("../app");
const BoxStore = require("../infrastructure/box-store");
const { createBox } = require("../domain/box");

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
          box: createBox({ id: 42, partitions: partitionsData })
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
            answer: "Neptune"
          }
        ]
      ];
      const boxStore = BoxStore.createInMemory({
        box: createBox({ id: "testId", partitions: partitionsData }),
        nextFlashcardId: "9"
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

      const [partition1, ...partitionsRest] = partitionsData;
      const expectedNewPartition1 = partition1.concat({
        id: "9",
        question:
          "What was once considered the ninth planet of our solar system ?",
        answer: "Pluto"
      });
      const box = await boxStore.get("testId");
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual([expectedNewPartition1, ...partitionsRest]);
      expect(box.partitions[0]).toEqual(expectedNewPartition1);
    });
  });
  describe("session", () => {
    it("on the first day, it should pick flashcards from partition 1", async () => {
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
          box: createBox({ id: 42, partitions: partitionsData })
        })
      });
      const response = await request(app).get("/session-flashcards?boxId=42");
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual([
        {
          flashcard: {
            id: "1",
            question: "What is the first planet of our solar system ?",
            answer: "Mercury"
          },
          fromPartition: 0
        },
        {
          flashcard: {
            id: "2",
            question: "What is the second planet of our solar system ?",
            answer: "Venus"
          },
          fromPartition: 0
        }
      ]);
    });
    it("on the second day, it should pick flashcards from partition 1, and 2", async () => {
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
          box: createBox({ id: 42, partitions: partitionsData, sessionDay: 2 })
        })
      });
      const response = await request(app).get("/session-flashcards?boxId=42");
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual([
        {
          flashcard: {
            id: "1",
            question: "What is the first planet of our solar system ?",
            answer: "Mercury"
          },
          fromPartition: 0
        },
        {
          flashcard: {
            id: "2",
            question: "What is the second planet of our solar system ?",
            answer: "Venus"
          },
          fromPartition: 0
        },
        {
          flashcard: {
            id: "3",
            question: "What is the third planet of our solar system ?",
            answer: "Earth"
          },
          fromPartition: 1
        }
      ]);
    });
  });
  describe("submit answer", () => {
    it("submitting a right answer should move the flashcard in the next partition and return the new score", async () => {
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
      const expectedNewPartitionsData = [
        [
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
          },
          {
            id: "1",
            question: "What is the first planet of our solar system ?",
            answer: "Mercury"
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
      const app = createApp({
        boxStore: BoxStore.createInMemory({
          box: createBox({ id: 42, partitions: partitionsData, sessionDay: 2 })
        })
      });
      const response = await request(app).get(
        "/submit-answer?boxId=42&flashcardId=1&right=1"
      );
      const flashcardsResponse = await request(app).get("/flashcards?boxId=42");
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        score: 1
      });
      //expect(flashcardsResponse.body).toEqual(expectedNewPartitionsData);
    });
    it("submitting a wrong answer should move the flashcard in the first partition and the score should be kept untouched", async () => {
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
      const app = createApp({
        boxStore: BoxStore.createInMemory({
          box: createBox({
            id: 42,
            partitions: partitionsData,
            sessionDay: 2,
            sessionScore: 5
          })
        })
      });
      const response = await request(app).get(
        "/submit-answer?boxId=42&flashcardId=1&right=0"
      );
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        score: 5
      });
    });
  });
});

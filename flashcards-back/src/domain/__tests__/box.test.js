const { createBox } = require("../box");

describe("box", () => {
  it("should create a box with empty values by default", () => {
    const box = createBox({ id: "testId" });
    expect(box.id).toBe("testId");
    expect(box.partitions).toEqual([[], [], [], [], []]);
    expect(box.sessionDay).toBe(1);
    expect(box.sessionScore).toBe(0);
  });
  it("should create a box with given arguments", () => {
    const partitions = [
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
    const box = createBox({
      id: "testId",
      partitions,
      sessionDay: 2,
      sessionScore: 5
    });
    expect(box.id).toBe("testId");
    expect(box.partitions).toEqual(partitions);
    expect(box.sessionDay).toEqual(2);
    expect(box.sessionScore).toEqual(5);
  });
  it("should add a flashcard in last position of the first partition", () => {
    const [partition1, ...partitionsRest] = [
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
    const box = createBox({
      id: "testId",
      partitions: [partition1, ...partitionsRest]
    });
    const editedBox = box.addFlashcard({
      id: "9",
      question:
        "What was once considered the ninth planet of our solar system ?",
      answer: "Pluto"
    });
    expect(editedBox.partitions).toEqual([
      partition1.concat({
        id: "9",
        question:
          "What was once considered the ninth planet of our solar system ?",
        answer: "Pluto"
      }),
      ...partitionsRest
    ]);
  });
  describe("session flashcards", () => {
    const partitions = [
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
    it("should always contains the flashcards from partition 1", () => {
      const expectedSessionFlashcards = [
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
      ];
      expect(
        createBox({ partitions, sessionDay: 1 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 2 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 3 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 4 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 5 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
    });
    it("should contains the flashcards from partition 2 every two days", () => {
      const expectedSessionFlashcards = [
        {
          flashcard: {
            id: "3",
            question: "What is the third planet of our solar system ?",
            answer: "Earth"
          },
          fromPartition: 1
        }
      ];
      expect(
        createBox({ partitions, sessionDay: 2 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 4 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 6 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 8 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 10 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
    });
    it("should contains the flashcards from partition 3 every three days", () => {
      const expectedSessionFlashcards = [
        {
          flashcard: {
            id: "4",
            question: "What is the fourth planet of our solar system ?",
            answer: "Mars"
          },
          fromPartition: 2
        },
        {
          flashcard: {
            id: "5",
            question: "What is the fith planet of our solar system ?",
            answer: "Jupiter"
          },
          fromPartition: 2
        }
      ];
      expect(
        createBox({ partitions, sessionDay: 3 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 6 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 9 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 12 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 15 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
    });
    it("should contains the flashcards from partition 4 every four days", () => {
      const expectedSessionFlashcards = [
        {
          flashcard: {
            id: "6",
            question: "What is the sixth planet of our solar system ?",
            answer: "Saturn"
          },
          fromPartition: 3
        }
      ];
      expect(
        createBox({ partitions, sessionDay: 4 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 8 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 12 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 16 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 20 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
    });
    it("should contains the flashcards from partition 5 every five days", () => {
      const expectedSessionFlashcards = [
        {
          flashcard: {
            id: "7",
            question: "What is the seventh planet of our solar system ?",
            answer: "Uranus"
          },
          fromPartition: 4
        },
        {
          flashcard: {
            id: "8",
            question: "What is the eighth planet of our solar system ?",
            answer: "Neptune"
          },
          fromPartition: 4
        }
      ];
      expect(
        createBox({ partitions, sessionDay: 5 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 10 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 15 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 20 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
      expect(
        createBox({ partitions, sessionDay: 25 }).sessionFlashcards
      ).toEqual(expect.arrayContaining(expectedSessionFlashcards));
    });
  });
  describe("submitting answer", () => {
    it("should increment the session score when submitting a right answer", () => {
      const partitions = [
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
      const box = createBox({
        id: "testId",
        sessionScore: 5,
        partitions
      });
      const editedBox = box.submitAnswer({
        flashcardId: "1",
        isAnswerRight: true
      });
      expect(editedBox.sessionScore).toEqual(6);
    });
    it("should move the flashcard to the next partition when submitting a right answer", () => {
      const partitions = [
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
      const expectedPartitions = [
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
      const box = createBox({
        id: "testId",
        partitions
      });
      const editedBox = box.submitAnswer({
        flashcardId: "1",
        isAnswerRight: true
      });
      expect(editedBox.partitions).toEqual(expectedPartitions);
    });
    it("should not increment the session score when submitting a wrong answer", () => {
      const partitions = [
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
      const box = createBox({
        id: "testId",
        sessionScore: 5,
        partitions
      });
      const editedBox = box.submitAnswer({
        flashcardId: "1",
        isAnswerRight: false
      });
      expect(editedBox.sessionScore).toEqual(5);
    });
    it("should move back the flashcard in the first partition when submitting a wrong answer", () => {
      const partitions = [
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
      const expectedPartitions = [
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
          },
          {
            id: "7",
            question: "What is the seventh planet of our solar system ?",
            answer: "Uranus"
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
            id: "8",
            question: "What is the eighth planet of our solar system ?",
            answer: "Neptune"
          }
        ]
      ];
      const box = createBox({
        id: "testId",
        partitions
      });
      const editedBox = box.submitAnswer({
        flashcardId: "7",
        isAnswerRight: false
      });
      expect(editedBox.partitions).toEqual(expectedPartitions);
    });
  });
});

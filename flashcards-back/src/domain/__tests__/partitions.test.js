const { createPartitions } = require("../partitions");

describe("partitions", () => {
  it("create immutable partitions from array and completes missing partition", () => {
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
      ]
    ];
    const partitionsDataCopy = [
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
      ]
    ];
    const expectedPartitionsData = partitionsDataCopy.concat([[], [], [], []]);
    const partitions = createPartitions(partitionsData);
    const partitionsArray = partitions.toArray();
    expect(partitionsArray).toEqual(expectedPartitionsData);
    partitionsArray[1] = [1, 2, 3];
    expect(partitions.toArray()).toEqual(expectedPartitionsData);
    partitionsData[1] = [4, 5, 6];
    expect(partitions.toArray()).toEqual(expectedPartitionsData);
    partitionsData[1][0] = { foo: "bar" };
    expect(partitions.toArray()).toEqual(expectedPartitionsData);
  });
  describe("add flashcard", () => {
    it("happy path", () => {
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
      const partitions = createPartitions(partitionsData);
      const newPartitions = partitions.addFlashcard({
        partition: 0,
        flashcard: {
          id: "9",
          question:
            "What was once considered the ninth planet of our solar system ?",
          answer: "Pluto"
        }
      });
      expect(newPartitions.toArray()[0]).toEqual(
        partitionsData[0].concat({
          id: "9",
          question:
            "What was once considered the ninth planet of our solar system ?",
          answer: "Pluto"
        })
      );
    });
    it("should fail if a flashcard with this question already exists in the partition", () => {
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
      const partitions = createPartitions(partitionsData);
      expect(() => {
        partitions.addFlashcard({
          partition: 0,
          flashcard: {
            id: "9",
            question: "What is the second planet of our solar system ?"
          }
        });
      }).toThrowError("A flashcard with this question already exists");
    });
    it("should fail if the partition is out of bound", () => {
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
      const partitions = createPartitions(partitionsData);
      expect(() => {
        partitions.addFlashcard({
          partition: -1,
          flashcard: {
            id: "9",
            question: "What is the second planet of our solar system ?"
          }
        });
      }).toThrowError(
        "Partition should be comprised in between 0 and 5, received -1"
      );
      expect(() => {
        partitions.addFlashcard({
          partition: 6,
          flashcard: {
            id: "9",
            question: "What is the second planet of our solar system ?"
          }
        });
      }).toThrowError(
        "Partition should be comprised in between 0 and 5, received 6"
      );
    });
  });
  describe("move flashcard", () => {
    it("should move the flashcard with the given id to the destination partition", () => {
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
      const expectedPartitionsData = [
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
          },
          {
            id: "4",
            question: "What is the fourth planet of our solar system ?",
            answer: "Mars"
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
        ],
        []
      ];
      const partitions = createPartitions(partitionsData);
      const newPartitions = partitions.moveFlashcard({
        id: "4",
        toPartitionIndex: 3
      });
      expect(newPartitions.toArray()).toEqual(expectedPartitionsData);
    });
    it("should fail if the destination partition is out of bounds", () => {
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
      const partitions = createPartitions(partitionsData);
      expect(() =>
        partitions.moveFlashcard({
          id: "4",
          toPartitionIndex: -1
        })
      ).toThrowError(
        "Partition should be comprised in between 0 and 5, received -1"
      );
      expect(() =>
        partitions.moveFlashcard({
          id: "4",
          toPartitionIndex: 6
        })
      ).toThrowError(
        "Partition should be comprised in between 0 and 5, received 6"
      );
    });
    it("should fail if the flashcard is not found", () => {
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
      const partitions = createPartitions(partitionsData);
      expect(() =>
        partitions.moveFlashcard({
          id: "nonExisting",
          toPartitionIndex: 2
        })
      ).toThrowError("Flashcard with id nonExisting was not found");
    });
  });
  it("should move flashcard to its next partition", () => {
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
    const expectedPartitionsData = [
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
        }
      ],
      [
        {
          id: "6",
          question: "What is the sixth planet of our solar system ?",
          answer: "Saturn"
        },
        {
          id: "5",
          question: "What is the fith planet of our solar system ?",
          answer: "Jupiter"
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
      ],
      []
    ];
    const partitions = createPartitions(partitionsData);
    const newPartitions = partitions.moveFlashcardToItsNextPartition({
      id: "5"
    });
    expect(newPartitions.toArray()).toEqual(expectedPartitionsData);
  });
});

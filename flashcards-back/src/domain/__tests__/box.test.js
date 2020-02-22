const { createBox } = require("../box");

describe("box", () => {
  it("should create a box with empty partitions by default", () => {
    const box = createBox({ id: "testId" });
    expect(box.id).toBe("testId");
    expect(box.partitions).toEqual([[], [], [], [], []]);
    expect(box.sessionDay).toBe(1);
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
    const box = createBox({ id: "testId", partitions, sessionDay: 2 });
    expect(box.id).toBe("testId");
    expect(box.partitions).toEqual(partitions);
    expect(box.sessionDay).toEqual(2);
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
});

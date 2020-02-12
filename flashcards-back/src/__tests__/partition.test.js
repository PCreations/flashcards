const { createPartition } = require("../partition");

describe("partition", () => {
  it("creates a partition with given flashcards", () => {
    const flashcards = [
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
    ];
    const partition = createPartition(flashcards);
    expect(partition.flashcards).toEqual(flashcards);
  });
  it("should add flashcard in the partition at the last position", () => {
    const flashcards = [
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
    ];
    const partition = createPartition(flashcards);
    const addedFlashcard = {
      id: "3",
      question: "What is the third planet of our solar system ?",
      answer: "Earth"
    };
    const editedPartition = partition.addFlashcard(addedFlashcard);
    expect(editedPartition.flashcards[2]).toEqual(addedFlashcard);
  });
});

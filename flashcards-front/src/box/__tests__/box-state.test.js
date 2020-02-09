import {
  boxStateReducer,
  getPartitions,
  arePartitionsLoading,
  arePartitionsLoaded,
  getFetchPartitionsError,
  fetchPartitionsStarted,
  fetchPartitionsFinished,
  flashcardAdded,
  defaultState
} from "../box-state";

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

describe("box state", () => {
  test("the selectors should return the correct default state", () => {
    const state = boxStateReducer();
    expect(getPartitions(state)).toEqual([[], [], [], [], []]);
    expect(arePartitionsLoading(state)).toBe(false);
    expect(arePartitionsLoaded(state)).toBe(false);
  });
  test("fetchPartitionsStarted should set the loading state to true", () => {
    const state = boxStateReducer(undefined, fetchPartitionsStarted());
    expect(arePartitionsLoading(state)).toBe(true);
  });
  test("fetchPartitionsFinished should set the loading state to false the loaded state to true and populate the partitions if there is no error", () => {
    const state = boxStateReducer(
      {
        ...defaultState,
        loading: true
      },
      fetchPartitionsFinished(partitionsData)
    );
    expect(arePartitionsLoading(state)).toBe(false);
    expect(arePartitionsLoaded(state)).toBe(true);
    expect(getPartitions(state)).toEqual(partitionsData);
  });
  test("fetchPartitionsFinished should set the loading state to false and the loaded state to true and set the error state to true if there is an error", () => {
    const state = boxStateReducer(
      {
        ...defaultState,
        loading: true
      },
      fetchPartitionsFinished(null, "error message")
    );
    expect(arePartitionsLoading(state)).toBe(false);
    expect(arePartitionsLoaded(state)).toBe(true);
    expect(getFetchPartitionsError(state)).toBe("error message");
    expect(getPartitions(state)).toEqual(defaultState.partitions);
  });
  test("flashcardAdded should add the flashcard in the first partition", () => {
    const addedFlashcard = {
      id: "9",
      question:
        "What was long considered the ninth planet of our solar system ?"
    };
    const state = boxStateReducer(
      {
        ...defaultState,
        partitions: partitionsData
      },
      flashcardAdded(addedFlashcard)
    );
    expect(getPartitions(state)).toEqual([
      [...partitionsData[0], addedFlashcard],
      partitionsData[1],
      partitionsData[2],
      partitionsData[3],
      partitionsData[4]
    ]);
  });
});

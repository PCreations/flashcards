import {
  boxStateReducer,
  getPartitions,
  arePartitionsLoading,
  arePartitionsLoaded,
  getFetchPartitionsError,
  isAddFlashcardRequestLoading,
  fetchPartitionsStarted,
  fetchPartitionsFinished,
  addFlashcardRequestStarted,
  addFlashcardRequestEnded,
  getAddFlashcardRequestError,
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
    expect(isAddFlashcardRequestLoading(state)).toBe(false);
  });
  describe("fetchPartitions", () => {
    test("fetchPartitionsStarted should set the loading state to true", () => {
      const state = boxStateReducer(undefined, fetchPartitionsStarted());
      expect(arePartitionsLoading(state)).toBe(true);
    });
    test("fetchPartitionsFinished should set the loading state to false the loaded state to true and populate the partitions if there is no error", () => {
      const state = boxStateReducer(
        {
          ...defaultState,
          box: {
            ...defaultState.box,
            status: "loading"
          }
        },
        fetchPartitionsFinished({ partitions: partitionsData })
      );
      expect(arePartitionsLoading(state)).toBe(false);
      expect(arePartitionsLoaded(state)).toBe(true);
      expect(getPartitions(state)).toEqual(partitionsData);
    });
    test("fetchPartitionsFinished should set the loading state to false and the loaded state to true and set the error state to true if there is an error", () => {
      const state = boxStateReducer(
        {
          ...defaultState,
          box: {
            ...defaultState.box,
            status: "loading"
          }
        },
        fetchPartitionsFinished({ error: "error message" })
      );
      expect(arePartitionsLoading(state)).toBe(false);
      expect(arePartitionsLoaded(state)).toBe(true);
      expect(getFetchPartitionsError(state)).toBe("error message");
      expect(getPartitions(state)).toEqual(defaultState.box.data);
    });
  });
  describe("addFlashcardRequest", () => {
    test("addFlashcardRequestStarted should lead to isAddFlashcardRequestLoading to be true", () => {
      const state = boxStateReducer(undefined, addFlashcardRequestStarted());
      expect(isAddFlashcardRequestLoading(state)).toBe(true);
    });
    test("addFlashcardRequestEnded should update the partitions with the given response if there is no error and isAddFlashcardRequestLoading should return false", () => {
      const newPartitionsData = [...partitionsData];
      newPartitionsData[0] = [
        ...newPartitionsData[0],
        {
          id: "9",
          question:
            "What was long considered the ninth planet of our solar system ?",
          answer: "Pluto"
        }
      ];

      const state = boxStateReducer(
        {
          ...defaultState,
          box: {
            data: partitionsData,
            status: "success"
          }
        },
        addFlashcardRequestEnded({ partitions: newPartitionsData })
      );

      expect(getPartitions(state)).toEqual(newPartitionsData);
      expect(isAddFlashcardRequestLoading(state)).toBe(false);
    });
    test("addFlashcardRequestEnded should set the addFlashcardRequestError with the given error and set the addFlashcardRequestStatus to ERRORED", () => {
      const state = boxStateReducer(
        {
          ...defaultState,
          addFlashcardRequest: {
            ...defaultState.addFlashcardRequest,
            status: "loading"
          }
        },
        addFlashcardRequestEnded({ error: "some error has occured" })
      );

      expect(getAddFlashcardRequestError(state)).toEqual(
        "some error has occured"
      );
      expect(isAddFlashcardRequestLoading(state)).toBe(false);
    });
  });
});

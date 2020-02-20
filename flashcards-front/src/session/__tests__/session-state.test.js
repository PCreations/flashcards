import {
  defaultState,
  sessionStateReducer,
  getCurrentQuestion,
  getCurrentAnswer,
  areFlashcardsLoading,
  getFlashcardsRequestError,
  getScore,
  areFlashcardsLoaded,
  flashcardsRequestStarted,
  flashcardsRequestEnded
} from "../session-state";

describe("session state", () => {
  it("correct default session state", () => {
    const sessionState = sessionStateReducer();
    expect(getCurrentQuestion(sessionState)).toBeUndefined();
    expect(getCurrentAnswer(sessionState)).toBeUndefined();
    expect(areFlashcardsLoading(sessionState)).toEqual(false);
    expect(getFlashcardsRequestError(sessionState)).toEqual(null);
    expect(getScore(sessionState)).toEqual(0);
    expect(areFlashcardsLoaded(sessionState)).toEqual(false);
  });
  it("flashcards are loading when the flashcards request has started", () => {
    const sessionState = sessionStateReducer(
      undefined,
      flashcardsRequestStarted()
    );
    expect(areFlashcardsLoading(sessionState)).toBe(true);
  });
  it("set the flashcards when the flashcards request succeeds ; the flashcards are not loading anymore", () => {
    const sessionFlashcards = [
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
    ];
    const sessionState = sessionStateReducer(
      {
        ...defaultState,
        flashcards: {
          ...defaultState.flashcards,
          status: "loading"
        }
      },
      flashcardsRequestEnded({ flashcards: sessionFlashcards })
    );
    expect(getCurrentQuestion(sessionState)).toEqual(
      sessionFlashcards[0].flashcard.question
    );
    expect(getCurrentAnswer(sessionState)).toEqual(
      sessionFlashcards[0].flashcard.answer
    );
    expect(areFlashcardsLoading(sessionState)).toBe(false);
  });
  it("set the flashcards error when the flashcards request fails ; the flashcards are not loading anymore", () => {
    const sessionState = sessionStateReducer(
      {
        ...defaultState,
        flashcards: {
          ...defaultState.flashcards,
          status: "loading"
        }
      },
      flashcardsRequestEnded({ error: "an error occured" })
    );
    expect(getFlashcardsRequestError(sessionState)).toEqual("an error occured");
    expect(areFlashcardsLoading(sessionState)).toBe(false);
  });
  it("flashcards should be considered loading wheter the request has succeeded or failed", () => {
    expect(
      areFlashcardsLoaded({
        ...defaultState,
        flashcards: {
          ...defaultState.flashcards,
          status: "success"
        }
      })
    ).toBe(true);
    expect(
      areFlashcardsLoaded({
        ...defaultState,
        flashcards: {
          ...defaultState.flashcards,
          status: "fail"
        }
      })
    ).toBe(true);
  });
});

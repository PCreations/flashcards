import {
  defaultState,
  sessionStateReducer,
  getCurrentQuestion,
  getCurrentAnswer,
  getCurrentFlashcardId,
  areFlashcardsLoading,
  getFlashcardsRequestError,
  getScore,
  areFlashcardsLoaded,
  shouldShowAnswer,
  isSessionOver,
  flashcardsRequestStarted,
  flashcardsRequestEnded,
  showAnswerRequested,
  submitAnswerRequestEnded
} from "../session-state";

describe("session state", () => {
  it("correct default session state", () => {
    const sessionState = sessionStateReducer();
    expect(getCurrentQuestion(sessionState)).toBeUndefined();
    expect(getCurrentAnswer(sessionState)).toBeUndefined();
    expect(getCurrentFlashcardId(sessionState)).toBeUndefined();
    expect(areFlashcardsLoading(sessionState)).toEqual(false);
    expect(getFlashcardsRequestError(sessionState)).toEqual(null);
    expect(getScore(sessionState)).toEqual(0);
    expect(areFlashcardsLoaded(sessionState)).toEqual(false);
    expect(shouldShowAnswer(sessionState)).toEqual(false);
    expect(isSessionOver(sessionState)).toEqual(false);
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
      flashcardsRequestEnded({ data: sessionFlashcards })
    );
    expect(getCurrentQuestion(sessionState)).toEqual(
      sessionFlashcards[0].flashcard.question
    );
    expect(getCurrentAnswer(sessionState)).toEqual(
      sessionFlashcards[0].flashcard.answer
    );
    expect(getCurrentFlashcardId(sessionState)).toEqual(
      sessionFlashcards[0].flashcard.id
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
  it("should show answer when show answer is requested", () => {
    const sessionState = sessionStateReducer(undefined, showAnswerRequested());
    expect(shouldShowAnswer(sessionState)).toBe(true);
  });
  it("the current flashcard should now be the second one when submit answer request has succeeded ; the show answer should be now false", () => {
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
          data: sessionFlashcards,
          status: "success"
        },
        score: {
          ...defaultState.score,
          status: "loading"
        },
        showAnswer: true
      },
      submitAnswerRequestEnded({ data: 2 })
    );

    expect(getCurrentQuestion(sessionState)).toEqual(
      sessionFlashcards[1].flashcard.question
    );
    expect(getCurrentAnswer(sessionState)).toEqual(
      sessionFlashcards[1].flashcard.answer
    );
    expect(getCurrentFlashcardId(sessionState)).toEqual(
      sessionFlashcards[1].flashcard.id
    );
    expect(shouldShowAnswer(sessionState)).toBe(false);
  });
  it("the session should be considered over if there is no more flashcards", () => {
    const sessionState = sessionStateReducer({
      ...defaultState,
      flashcards: {
        ...defaultState.flashcards,
        status: "success"
      }
    });
    expect(isSessionOver(sessionState)).toBe(true);
  });
});

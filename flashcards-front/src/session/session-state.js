import { createRequestState } from "../request";

const SHOW_ANSWER_REQUESTED = "SHOW_ANSWER_REQUESTED";

const flashcardsRequestState = createRequestState({
  requestName: "[session] - flashcards request",
  defaultData: []
});

export const defaultState = {
  flashcards: flashcardsRequestState.defaultState,
  score: 0,
  showAnswer: false
};

const showAnswerReducer = (showAnswer, action) => {
  if (!showAnswer && action.type === SHOW_ANSWER_REQUESTED) {
    return true;
  }
  return showAnswer;
};

export const sessionStateReducer = (sessionState = defaultState, action) => {
  if (!action) return sessionState;
  return {
    flashcards: flashcardsRequestState.requestReducer(
      sessionState.flashcards,
      action
    ),
    score: sessionState.score,
    showAnswer: showAnswerReducer(sessionState.showAnswer, action)
  };
};

const createFlashcardsSelector = selector => state => {
  return selector(state.flashcards);
};

const getSessionFlashcards = createFlashcardsSelector(
  flashcardsRequestState.getData
);

export const getCurrentQuestion = sessionState => {
  const flashcards = getSessionFlashcards(sessionState);
  return (
    flashcards[0] && flashcards[0].flashcard && flashcards[0].flashcard.question
  );
};

export const getCurrentAnswer = sessionState => {
  const flashcards = getSessionFlashcards(sessionState);
  return (
    flashcards[0] && flashcards[0].flashcard && flashcards[0].flashcard.answer
  );
};

export const areFlashcardsLoading = createFlashcardsSelector(
  flashcardsRequestState.isRequestLoading
);

export const getFlashcardsRequestError = createFlashcardsSelector(
  flashcardsRequestState.getRequestError
);

export const getScore = sessionState => sessionState.score;

export const areFlashcardsLoaded = createFlashcardsSelector(
  flashcardsRequestState.hasRequestEnded
);

export const shouldShowAnswer = sessionState => sessionState.showAnswer;

export const flashcardsRequestStarted = flashcardsRequestState.requestStarted;

export const flashcardsRequestEnded = flashcardsRequestState.requestEnded;

export const showAnswerRequested = () => ({
  type: SHOW_ANSWER_REQUESTED
});

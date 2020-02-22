import { createRequestState } from "../request";

const SHOW_ANSWER_REQUESTED = "SHOW_ANSWER_REQUESTED";

const flashcardsRequestState = createRequestState({
  requestName: "[session] - flashcards request",
  defaultData: []
});

const submitAnswerRequestState = createRequestState({
  requestName: "[session] - submit answer request",
  defaultData: 0
});

export const defaultState = {
  flashcards: flashcardsRequestState.defaultState,
  score: submitAnswerRequestState.defaultState,
  showAnswer: false
};

const showAnswerReducer = (showAnswer, action) => {
  if (!showAnswer && action.type === SHOW_ANSWER_REQUESTED) {
    return true;
  }
  if (showAnswer && action.type === submitAnswerRequestState.REQUEST_ENDED) {
    return false;
  }
  return showAnswer;
};

const flashcardsReducer = (flashcards, action) => {
  const nextState = flashcardsRequestState.requestReducer(flashcards, action);
  if (action.type === submitAnswerRequestState.REQUEST_ENDED && !action.error) {
    return {
      ...nextState,
      data: nextState.data.slice(1)
    };
  }
  return nextState;
};

export const sessionStateReducer = (sessionState = defaultState, action) => {
  if (!action) return sessionState;
  return {
    flashcards: flashcardsReducer(sessionState.flashcards, action),
    score: submitAnswerRequestState.requestReducer(sessionState.score, action),
    showAnswer: showAnswerReducer(sessionState.showAnswer, action)
  };
};

const createFlashcardsSelector = selector => state => {
  return selector(state.flashcards);
};

const createSubmitAnswerRequestSelector = selector => state =>
  selector(state.score);

const getSessionFlashcards = createFlashcardsSelector(
  flashcardsRequestState.getData
);

const getCurrentFlashcard = sessionState => {
  const flashcards = getSessionFlashcards(sessionState);
  const flashcard =
    flashcards[0] && flashcards[0].flashcard && flashcards[0].flashcard;
  return flashcard ? flashcard : {};
};

export const getCurrentQuestion = sessionState =>
  getCurrentFlashcard(sessionState).question;

export const getCurrentAnswer = sessionState =>
  getCurrentFlashcard(sessionState).answer;

export const getCurrentFlashcardId = sessionState =>
  getCurrentFlashcard(sessionState).id;

export const areFlashcardsLoading = createFlashcardsSelector(
  flashcardsRequestState.isRequestLoading
);

export const getFlashcardsRequestError = createFlashcardsSelector(
  flashcardsRequestState.getRequestError
);
export const areFlashcardsLoaded = createFlashcardsSelector(
  flashcardsRequestState.hasRequestEnded
);

export const getScore = createSubmitAnswerRequestSelector(
  submitAnswerRequestState.getData
);

export const isSubmitAnswerRequestLoading = createSubmitAnswerRequestSelector(
  submitAnswerRequestState.isRequestLoading
);

export const shouldShowAnswer = sessionState => sessionState.showAnswer;

export const isSessionOver = sessionState =>
  areFlashcardsLoaded(sessionState) &&
  getSessionFlashcards(sessionState).length === 0;

export const flashcardsRequestStarted = flashcardsRequestState.requestStarted;

export const flashcardsRequestEnded = flashcardsRequestState.requestEnded;

export const submitAnswerRequestStarted =
  submitAnswerRequestState.requestStarted;

export const submitAnswerRequestEnded = submitAnswerRequestState.requestEnded;

export const showAnswerRequested = () => ({
  type: SHOW_ANSWER_REQUESTED
});

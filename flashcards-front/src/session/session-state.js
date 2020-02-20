const FLASHCARDS_REQUEST_STARTED =
  "[session] - the flashcards request has started";
const FLASHCARDS_REQUEST_ENDED = "[session] - the flashcards request has ended";

const IDLE_STATUS = "idle";
const LOADING_STATUS = "loading";
const SUCCESS_STATUS = "success";
const FAIL_STATUS = "fail";

export const defaultState = {
  flashcards: {
    status: IDLE_STATUS,
    data: [],
    error: null
  },
  score: 0
};

const idleFlashcardsReducer = (flashcards, action) => {
  if (action.type === FLASHCARDS_REQUEST_STARTED) {
    return {
      ...flashcards,
      status: LOADING_STATUS
    };
  }
  return flashcards;
};

const loadingFlashcardsReducer = (flashcards, action) => {
  if (action.type === FLASHCARDS_REQUEST_ENDED) {
    return action.error
      ? {
          ...flashcards,
          error: action.error,
          status: FAIL_STATUS
        }
      : {
          ...flashcards,
          data: action.payload.flashcards,
          status: SUCCESS_STATUS
        };
  }
  return flashcards;
};

const flashcardsReducer = (flashcards, action) => {
  switch (flashcards.status) {
    case IDLE_STATUS:
      return idleFlashcardsReducer(flashcards, action);
    case LOADING_STATUS:
      return loadingFlashcardsReducer(flashcards, action);
    default:
      return flashcards;
  }
};

export const sessionStateReducer = (sessionState = defaultState, action) => {
  if (!action) return sessionState;
  return {
    flashcards: flashcardsReducer(sessionState.flashcards, action),
    score: sessionState.score
  };
};

export const getCurrentQuestion = sessionState =>
  sessionState.flashcards.data[0] &&
  sessionState.flashcards.data[0].flashcard &&
  sessionState.flashcards.data[0].flashcard.question;

export const getCurrentAnswer = sessionState =>
  sessionState.flashcards.data[0] &&
  sessionState.flashcards.data[0].flashcard &&
  sessionState.flashcards.data[0].flashcard.answer;

export const areFlashcardsLoading = sessionState =>
  sessionState.flashcards.status === LOADING_STATUS;

export const getFlashcardsRequestError = sessionState =>
  sessionState.flashcards.error;

export const getScore = sessionState => sessionState.score;

export const areFlashcardsLoaded = sessionState =>
  sessionState.flashcards.status === SUCCESS_STATUS ||
  sessionState.flashcards.status === FAIL_STATUS;

export const flashcardsRequestStarted = () => ({
  type: FLASHCARDS_REQUEST_STARTED
});

export const flashcardsRequestEnded = ({ flashcards, error }) => ({
  type: FLASHCARDS_REQUEST_ENDED,
  ...(error
    ? {
        error
      }
    : {
        payload: {
          flashcards
        }
      })
});

const FETCH_PARTITIONS_STARTED = "FETCH_PARTITIONS_STARTED";
const FETCH_PARTITIONS_FINISHED = "FETCH_PARTITIONS_FINISHED";
const ADD_FLASHCARD_REQUEST_STARTED = "ADD_FLASHCARD_REQUEST_STARTED";
const ADD_FLASHCARD_REQUEST_ENDED = "ADD_FLASHCARD_REQUEST_ENDED";

export const AddFlashcardRequestStatus = {
  NEVER_STARTED: "NEVER_STARTED",
  PENDING: "PENDING",
  SUCCEEDED: "SUCCEEDED",
  ERRORED: "ERRORED"
};

export const defaultState = {
  partitions: [[], [], [], [], []],
  loading: false,
  loaded: false,
  fetchPartitionsError: undefined,
  addFlashcardRequestStatus: AddFlashcardRequestStatus.NEVER_STARTED,
  addFlashcardRequestError: undefined
};

// reducer
export const boxStateReducer = (state = defaultState, action) => {
  if (!action) return state;
  switch (action.type) {
    case FETCH_PARTITIONS_STARTED:
      return {
        ...state,
        loading: true
      };
    case FETCH_PARTITIONS_FINISHED:
      return {
        ...state,
        loading: false,
        loaded: true,
        ...(action.error
          ? {
              fetchPartitionsError: action.error
            }
          : {
              partitions: action.payload.partitions
            })
      };
    case ADD_FLASHCARD_REQUEST_STARTED:
      return {
        ...state,
        addFlashcardRequestStatus: AddFlashcardRequestStatus.PENDING
      };
    case ADD_FLASHCARD_REQUEST_ENDED:
      return action.error
        ? {
            ...state,
            addFlashcardRequestError: action.error,
            addFlashcardRequestStatus: AddFlashcardRequestStatus.ERRORED
          }
        : {
            ...state,
            partitions: action.payload.partitions,
            addFlashcardRequestStatus: AddFlashcardRequestStatus.SUCCEEDED
          };
    default:
      return state;
  }
};

// actions creator
export const fetchPartitionsStarted = () => ({
  type: FETCH_PARTITIONS_STARTED
});

export const fetchPartitionsFinished = ({ partitions, error }) => ({
  type: FETCH_PARTITIONS_FINISHED,
  ...(error
    ? {
        error
      }
    : {
        payload: {
          partitions
        }
      })
});

export const addFlashcardRequestStarted = () => ({
  type: ADD_FLASHCARD_REQUEST_STARTED
});

export const addFlashcardRequestEnded = ({ partitions, error }) => ({
  type: ADD_FLASHCARD_REQUEST_ENDED,
  ...(error
    ? {
        error
      }
    : {
        payload: {
          partitions
        }
      })
});

// selectors
export const getPartitions = boxState => boxState.partitions;

export const getFetchPartitionsError = boxState =>
  boxState.fetchPartitionsError;

export const arePartitionsLoading = boxState => boxState.loading;

export const arePartitionsLoaded = boxState => boxState.loaded;

export const addFlashcardRequestStatus = boxState =>
  boxState.addFlashcardRequestStatus;

export const getAddFlashcardRequestError = boxState =>
  boxState.addFlashcardRequestError;

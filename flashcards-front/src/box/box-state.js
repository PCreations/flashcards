const FETCH_PARTITIONS_STARTED = "FETCH_PARTITIONS_STARTED";
const FETCH_PARTITIONS_FINISHED = "FETCH_PARTITIONS_FINISHED";
const FLASHCARD_ADDED = "FLASHCARD_ADDED";

export const defaultState = {
  partitions: [[], [], [], [], []],
  loading: false,
  loaded: false,
  fetchPartitionsError: undefined
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
    case FLASHCARD_ADDED:
      return {
        ...state,
        partitions: [
          [...state.partitions[0], action.payload.flashcard],
          state.partitions[1],
          state.partitions[2],
          state.partitions[3],
          state.partitions[4]
        ]
      };
    default:
      return state;
  }
};

// actions creator
export const fetchPartitionsStarted = () => ({
  type: FETCH_PARTITIONS_STARTED
});

export const fetchPartitionsFinished = (partitionsData, error) => ({
  type: FETCH_PARTITIONS_FINISHED,
  ...(error
    ? {
        error
      }
    : {
        payload: {
          partitions: partitionsData
        }
      })
});

export const flashcardAdded = flashcard => ({
  type: FLASHCARD_ADDED,
  payload: {
    flashcard
  }
});

// selectors
export const getPartitions = boxState => boxState.partitions;

export const getFetchPartitionsError = boxState =>
  boxState.fetchPartitionsError;

export const arePartitionsLoading = boxState => boxState.loading;

export const arePartitionsLoaded = boxState => boxState.loaded;

const FETCH_PARTITIONS_STARTED = "FETCH_PARTITIONS_STARTED";
const FETCH_PARTITIONS_FINISHED = "FETCH_PARTITIONS_FINISHED";
const ADD_FLASHCARD_REQUEST_STARTED = "ADD_FLASHCARD_REQUEST_STARTED";
const ADD_FLASHCARD_REQUEST_ENDED = "ADD_FLASHCARD_REQUEST_ENDED";

const IDLE_STATUS = "idle";
const LOADING_STATUS = "loading";
const SUCCESS_STATUS = "success";
const FAILURE_STATUS = "failure";

export const defaultState = {
  partitions: {
    status: IDLE_STATUS,
    data: [[], [], [], [], []],
    error: null
  },
  addFlashcardRequest: {
    status: IDLE_STATUS,
    error: null
  }
};

const idlePartitionsReducer = (partitions, action) => {
  if (action.type === FETCH_PARTITIONS_STARTED) {
    return {
      ...partitions,
      status: LOADING_STATUS
    };
  }
  return partitions;
};

const loadingPartitionsReducer = (partitions, action) => {
  if (action.type === FETCH_PARTITIONS_FINISHED) {
    return action.error
      ? {
          ...partitions,
          status: FAILURE_STATUS,
          error: action.error
        }
      : {
          ...partitions,
          status: SUCCESS_STATUS,
          data: action.payload.partitions
        };
  }
  return partitions;
};

const successPartitionsReducer = (partitions, action) => {
  if (action.type === ADD_FLASHCARD_REQUEST_ENDED && !action.error) {
    return {
      ...partitions,
      data: action.payload.partitions
    };
  }
  return partitions;
};

const partitionsReducer = (partitions, action) => {
  switch (partitions.status) {
    case IDLE_STATUS:
      return idlePartitionsReducer(partitions, action);
    case LOADING_STATUS:
      return loadingPartitionsReducer(partitions, action);
    case SUCCESS_STATUS:
      return successPartitionsReducer(partitions, action);

    default:
      return partitions;
  }
};

const idleOrSuccessAddFlashcardRequestReducer = (
  addFlashcardRequest,
  action
) => {
  if (action.type === ADD_FLASHCARD_REQUEST_STARTED) {
    return {
      ...addFlashcardRequest,
      status: LOADING_STATUS
    };
  }
  return addFlashcardRequest;
};

const loadingAddFlashcardRequestReducer = (addFlashcardRequest, action) => {
  if (action.type === ADD_FLASHCARD_REQUEST_ENDED) {
    return action.error
      ? {
          ...addFlashcardRequest,
          status: FAILURE_STATUS,
          error: action.error
        }
      : {
          ...addFlashcardRequest,
          status: SUCCESS_STATUS
        };
  }
  return addFlashcardRequest;
};

const addFlashcardRequestReducer = (addFlashcardRequest, action) => {
  switch (addFlashcardRequest.status) {
    case IDLE_STATUS:
    case SUCCESS_STATUS:
      return idleOrSuccessAddFlashcardRequestReducer(
        addFlashcardRequest,
        action
      );
    case LOADING_STATUS:
      return loadingAddFlashcardRequestReducer(addFlashcardRequest, action);
    default:
      return addFlashcardRequest;
  }
};

// reducer
export const boxStateReducer = (state = defaultState, action) => {
  if (!action) return state;
  return {
    partitions: partitionsReducer(state.partitions, action),
    addFlashcardRequest: addFlashcardRequestReducer(
      state.addFlashcardRequest,
      action
    )
  };
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
export const getPartitions = boxState => boxState.partitions.data;

export const getFetchPartitionsError = boxState => boxState.partitions.error;

export const arePartitionsLoading = boxState =>
  boxState.partitions.status === LOADING_STATUS;

export const arePartitionsLoaded = boxState =>
  boxState.partitions.status !== IDLE_STATUS;

export const isAddFlashcardRequestLoading = boxState =>
  boxState.addFlashcardRequest.status === LOADING_STATUS;

export const getAddFlashcardRequestError = boxState =>
  boxState.addFlashcardRequest.error;

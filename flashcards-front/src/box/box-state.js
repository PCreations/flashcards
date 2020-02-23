import { createRequestState } from "../request";

const boxRequestState = createRequestState({
  requestName: "[box] - box request",
  defaultData: {
    partitions: [[], [], [], [], []],
    archivedFlashcards: []
  }
});

const addFlashcardRequestState = createRequestState({
  requestName: "[box] - add flashcard request",
  defaultData: null
});

export const defaultState = {
  box: boxRequestState.defaultState,
  addFlashcardRequest: addFlashcardRequestState.defaultState
};

const boxReducer = (box, action) => {
  const newState = boxRequestState.requestReducer(box, action);
  if (action.type === addFlashcardRequestState.REQUEST_ENDED && !action.error) {
    return {
      ...newState,
      data: {
        ...newState.data,
        partitions: action.payload.data
      }
    };
  }
  return newState;
};

// reducer
export const boxStateReducer = (state = defaultState, action) => {
  if (!action) return state;
  return {
    box: boxReducer(state.box, action),
    addFlashcardRequest: addFlashcardRequestState.requestReducer(
      state.addFlashcardRequest,
      action
    )
  };
};

// actions creator
export const fetchPartitionsStarted = boxRequestState.requestStarted;

export const fetchPartitionsFinished = ({
  partitions,
  archivedFlashcards,
  error
}) =>
  boxRequestState.requestEnded({
    data: { partitions, archivedFlashcards },
    error
  });

export const addFlashcardRequestStarted =
  addFlashcardRequestState.requestStarted;

export const addFlashcardRequestEnded = ({ partitions, error }) =>
  addFlashcardRequestState.requestEnded({ data: partitions, error });

const createBoxSelector = selector => state => selector(state.box);
const createAddFlashcardRequestSelector = selector => state =>
  selector(state.addFlashcardRequest);

// selectors
export const getPartitions = state =>
  createBoxSelector(boxRequestState.getData)(state).partitions;

export const getArchivedFlashcards = state =>
  createBoxSelector(boxRequestState.getData)(state).archivedFlashcards;

export const getFetchPartitionsError = createBoxSelector(
  boxRequestState.getRequestError
);

export const arePartitionsLoading = createBoxSelector(
  boxRequestState.isRequestLoading
);

export const arePartitionsLoaded = createBoxSelector(
  boxRequestState.hasRequestEnded
);

export const isAddFlashcardRequestLoading = createAddFlashcardRequestSelector(
  addFlashcardRequestState.isRequestLoading
);

export const getAddFlashcardRequestError = createAddFlashcardRequestSelector(
  addFlashcardRequestState.getRequestError
);

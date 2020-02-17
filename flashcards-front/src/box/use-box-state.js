import { useReducer, useCallback } from "react";
import {
  boxStateReducer,
  defaultState,
  getPartitions,
  getFetchPartitionsError,
  arePartitionsLoading,
  addFlashcardRequestStatus,
  getAddFlashcardRequestError,
  fetchPartitionsStarted,
  fetchPartitionsFinished,
  addFlashcardRequestStarted,
  addFlashcardRequestEnded
} from "./box-state";

const actionDispatcher = (dispatch, action) => (...args) =>
  dispatch(action(...args));

export const useBoxState = () => {
  const [state, dispatch] = useReducer(boxStateReducer, defaultState);

  return {
    partitions: getPartitions(state),
    fetchPartitionsError: getFetchPartitionsError(state),
    arePartitionsLoading: arePartitionsLoading(state),
    addFlashcardRequestStatus: addFlashcardRequestStatus(state),
    addFlashcardRequestError: getAddFlashcardRequestError(state),
    fetchPartitionsStarted: useCallback(
      actionDispatcher(dispatch, fetchPartitionsStarted),
      []
    ),
    fetchPartitionFinished: useCallback(
      actionDispatcher(dispatch, fetchPartitionsFinished),
      []
    ),
    addFlashcardRequestStarted: useCallback(
      actionDispatcher(dispatch, addFlashcardRequestStarted),
      []
    ),
    addFlashcardRequestEnded: useCallback(
      actionDispatcher(dispatch, addFlashcardRequestEnded),
      []
    )
  };
};

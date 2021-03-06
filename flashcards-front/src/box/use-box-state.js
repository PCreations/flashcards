import { useReducer, useCallback } from "react";
import {
  boxStateReducer,
  defaultState,
  getPartitions,
  getArchivedFlashcards,
  getFetchPartitionsError,
  arePartitionsLoading,
  isAddFlashcardRequestLoading,
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
    archivedFlashcards: getArchivedFlashcards(state),
    fetchPartitionsError: getFetchPartitionsError(state),
    arePartitionsLoading: arePartitionsLoading(state),
    isAddFlashcardRequestLoading: isAddFlashcardRequestLoading(state),
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

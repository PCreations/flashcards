import { useReducer, useCallback } from "react";
import {
  boxStateReducer,
  defaultState,
  getPartitions,
  getFetchPartitionsError,
  arePartitionsLoading,
  fetchPartitionsStarted,
  fetchPartitionsFinished,
  flashcardAdded
} from "./box-state";

export const useBoxState = () => {
  const [state, dispatch] = useReducer(boxStateReducer, defaultState);

  return {
    partitions: getPartitions(state),
    fetchPartitionsError: getFetchPartitionsError(state),
    arePartitionsLoading: arePartitionsLoading(state),
    fetchPartitionsStarted: useCallback(
      () => dispatch(fetchPartitionsStarted()),
      []
    ),
    fetchPartitionFinished: useCallback(
      (partitionsData, error) =>
        dispatch(fetchPartitionsFinished(partitionsData, error)),
      []
    ),
    flashcardAdded: useCallback(
      flashcard => dispatch(flashcardAdded(flashcard)),
      []
    )
  };
};

import React, { useEffect } from "react";
import axios from "axios";
import { getConfig } from "./config";
import { useFlashcardFormState, AddFlashcardForm } from "./add-flashcard-form";
import { FlashcardList } from "./flashcard-list";
import { useBoxState } from "./box/use-box-state";

const apiRootUrl = getConfig().API_ROOT_URL;

export const Box = () => {
  const {
    open: openForm,
    isOpened: isFormOpened,
    submit: submitForm
  } = useFlashcardFormState();

  const {
    arePartitionsLoading,
    arePartitionsLoaded,
    fetchPartitionsStarted,
    fetchPartitionFinished,
    partitions
  } = useBoxState();

  useEffect(() => {
    if (!arePartitionsLoaded) {
      fetchPartitionsStarted();
      axios
        .get(`${apiRootUrl}/flashcards`)
        .then(res => res.data)
        .then(fetchPartitionFinished)
        .catch(err => fetchPartitionFinished(undefined, err.message));
    }
  }, [arePartitionsLoaded, fetchPartitionsStarted, fetchPartitionFinished]);

  return (
    <div>
      <FlashcardList loading={arePartitionsLoading} partitions={partitions} />
      {isFormOpened ? (
        <AddFlashcardForm onSubmit={submitForm} />
      ) : (
        <button onClick={openForm}>Add a flashcard</button>
      )}
      {}
    </div>
  );
};

/**
 * Box state :
 * - fetch flashcards
 * - add flashcard
 * - delete flashcard
 * - update flashcard
 */

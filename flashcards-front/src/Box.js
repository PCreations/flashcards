import React, { useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./auth-context";
import { getConfig } from "./config";
import { useFlashcardFormState, AddFlashcardForm } from "./add-flashcard-form";
import { FlashcardList } from "./flashcard-list";
import { useBoxState } from "./box/use-box-state";
import { AddFlashcardRequestStatus } from "./box/box-state";

const apiRootUrl = getConfig().API_ROOT_URL;

export const Box = () => {
  const idToken = useContext(AuthContext);

  const {
    open: openForm,
    isOpened: isFormOpened,
    submit: closeForm
  } = useFlashcardFormState();

  const {
    arePartitionsLoading,
    arePartitionsLoaded,
    fetchPartitionsStarted,
    fetchPartitionFinished,
    addFlashcardRequestStarted,
    addFlashcardRequestEnded,
    addFlashcardRequestStatus,
    addFlashcardRequestError,
    partitions
  } = useBoxState();

  useEffect(() => {
    if (!arePartitionsLoaded) {
      fetchPartitionsStarted();
      axios
        .get(`${apiRootUrl}/flashcards?boxId=test`, {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        })
        .then(res => res.data)
        .then(partitions => fetchPartitionFinished({ partitions }))
        .catch(err => fetchPartitionFinished({ error: err.message }));
    }
  }, [
    arePartitionsLoaded,
    fetchPartitionsStarted,
    idToken,
    fetchPartitionFinished
  ]);

  const handleSubmit = useCallback(
    ({ question, answer }) => {
      if (addFlashcardRequestStatus !== AddFlashcardRequestStatus.PENDING) {
        closeForm({ question, answer });
        addFlashcardRequestStarted();
        console.log("starting POST request ", `${apiRootUrl}/flashcards`);
        axios
          .post(`${apiRootUrl}/flashcards`, {
            boxId: "test",
            flashcard: {
              question,
              answer
            }
          })
          .then(res => res.data)
          .then(partitions => {
            console.log("Received partitions", partitions);
            if (!partitions) {
              addFlashcardRequestEnded({ error: "no partitions received" });
            } else {
              addFlashcardRequestEnded({ partitions });
            }
          })
          .catch(err => addFlashcardRequestEnded({ error: err.message }));
      }
    },
    [
      addFlashcardRequestStatus,
      addFlashcardRequestStarted,
      addFlashcardRequestEnded,
      closeForm
    ]
  );

  return (
    <div>
      <FlashcardList loading={arePartitionsLoading} partitions={partitions} />
      {isFormOpened ? (
        <AddFlashcardForm onSubmit={handleSubmit} />
      ) : (
        <button onClick={openForm}>Add a flashcard</button>
      )}
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

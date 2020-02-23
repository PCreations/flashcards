import React, { useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./auth-context";
import { getConfig } from "./config";
import { useFlashcardFormState, AddFlashcardForm } from "./add-flashcard-form";
import { FlashcardList } from "./flashcard-list";
import { useBoxState } from "./box/use-box-state";

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
    isAddFlashcardRequestLoading,
    addFlashcardRequestError,
    partitions,
    archivedFlashcards
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
        .then(({ partitions, archivedFlashcards }) =>
          fetchPartitionFinished({ partitions, archivedFlashcards })
        )
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
      if (!isAddFlashcardRequestLoading) {
        closeForm({ question, answer });
        addFlashcardRequestStarted();
        console.log("starting POST request ", `${apiRootUrl}/flashcards`);
        axios
          .post(
            `${apiRootUrl}/flashcards`,
            {
              boxId: "test",
              flashcard: {
                question,
                answer
              }
            },
            {
              headers: {
                Authorization: `Bearer ${idToken}`
              }
            }
          )
          .then(res => res.data)
          .then(partitions => {
            addFlashcardRequestEnded({ partitions });
          })
          .catch(err => {
            if (!err.response) {
              throw err;
            } else {
              addFlashcardRequestEnded({ error: err.response.data.error });
            }
          });
      }
    },
    [
      isAddFlashcardRequestLoading,
      addFlashcardRequestStarted,
      idToken,
      addFlashcardRequestEnded,
      closeForm
    ]
  );

  return (
    <div>
      {addFlashcardRequestError && <strong>{addFlashcardRequestError}</strong>}
      <FlashcardList
        loading={arePartitionsLoading}
        partitions={partitions}
        archivedFlashcards={archivedFlashcards}
      />
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

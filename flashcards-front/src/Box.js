import React from "react";
import { useFlashcardFormState, AddFlashcardForm } from "./add-flashcard-form";
import { Partition } from "./partition";

export const Box = () => {
  const {
    open: openForm,
    isOpened: isFormOpened,
    submit: submitForm,
    question
  } = useFlashcardFormState();
  return (
    <div>
      <Partition partitionNumber="1" flashcards={[{ question }]} />
      {isFormOpened ? (
        <AddFlashcardForm onSubmit={submitForm} />
      ) : (
        <button onClick={openForm}>Add a flashcard</button>
      )}
      {}
    </div>
  );
};

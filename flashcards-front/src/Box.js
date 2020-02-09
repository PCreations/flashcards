import React from "react";
import { useFlashcardFormState, AddFlashcardForm } from "./add-flashcard-form";
import { Partition } from "./partition";
import { FlashcardList } from "./flashcard-list";

export const Box = () => {
  const {
    open: openForm,
    isOpened: isFormOpened,
    submit: submitForm,
    question
  } = useFlashcardFormState();
  return (
    <div>
      <FlashcardList />
      {isFormOpened ? (
        <AddFlashcardForm onSubmit={submitForm} />
      ) : (
        <button onClick={openForm}>Add a flashcard</button>
      )}
      {}
    </div>
  );
};

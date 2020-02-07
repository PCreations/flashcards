import React from "react";
import { useFlashcardFormState } from "./add-flashcard-form/use-flashcard-form-state";
import { AddFlashcardForm } from "./add-flashcard-form/add-flashcard-form";

export const Box = () => {
  const {
    open: openForm,
    isOpened: isFormOpened,
    submit: submitForm,
    question
  } = useFlashcardFormState();
  return (
    <div>
      <section>
        <strong>Partition 1</strong>
        {question && (
          <ul>
            <li>{question}</li>
          </ul>
        )}
      </section>
      {isFormOpened ? (
        <AddFlashcardForm onSubmit={submitForm} />
      ) : (
        <button onClick={openForm}>Add a flashcard</button>
      )}
      {}
    </div>
  );
};

import React, { useCallback, useRef } from "react";

export const AddFlashcardForm = ({ onSubmit }) => {
  const questionInput = useRef();
  const answerInput = useRef();
  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      onSubmit({
        question: questionInput.current.value,
        answer: answerInput.current.value
      });
    },
    [onSubmit, questionInput, answerInput]
  );
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="question" ref={questionInput} />
      <input type="text" placeholder="answer" ref={answerInput} />
      <input type="submit" value="add" />
    </form>
  );
};

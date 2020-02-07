import { useState, useCallback } from "react";

export const useFlashcardFormState = ({
  isOpened: defaultIsOpened = false,
  question: defaultQuestion = "",
  answer: defaultAnswer = ""
} = {}) => {
  const [isOpened, setOpened] = useState(defaultIsOpened);
  const [question, setQuestion] = useState(defaultQuestion);
  const [answer, setAnswer] = useState(defaultAnswer);

  const open = useCallback(() => setOpened(true), []);
  const submit = useCallback(({ question, answer }) => {
    setQuestion(question);
    setAnswer(answer);
    setOpened(false);
  }, []);

  return {
    isOpened,
    question,
    answer,
    open,
    submit
  };
};

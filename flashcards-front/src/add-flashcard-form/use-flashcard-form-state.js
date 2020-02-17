import { useState, useCallback } from "react";

export const useFlashcardFormState = ({
  isOpened: defaultIsOpened = false
} = {}) => {
  const [isOpened, setOpened] = useState(defaultIsOpened);
  const open = useCallback(() => setOpened(true), []);
  const submit = useCallback(() => {
    setOpened(false);
  }, []);

  return {
    isOpened,
    open,
    submit
  };
};

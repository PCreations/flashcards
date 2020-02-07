import { renderHook, act } from "@testing-library/react-hooks";
import { useFlashcardFormState } from "../use-flashcard-form-state";

describe("useFlashcardFormState", () => {
  test("form should not be opened by default", () => {
    const { result } = renderHook(useFlashcardFormState);
    expect(result.current.isOpened).toBe(false);
  });
  test("form can be opened", () => {
    const { result } = renderHook(useFlashcardFormState);
    act(() => {
      result.current.open();
    });
    expect(result.current.isOpened).toBe(true);
  });
  test("form can be closed given it is opened", () => {
    const { result } = renderHook(() =>
      useFlashcardFormState({ isOpened: true })
    );
    expect(result.current.isOpened).toBe(true);
    act(() => {
      result.current.close();
    });
    expect(result.current.isOpened).toBe(false);
  });
  test("question and answer can be submited thus closing the form", () => {
    const { result } = renderHook(() =>
      useFlashcardFormState({ isOpened: true })
    );
    act(() => {
      result.current.submit({
        question: "What is the hottest planet of our solar system ?",
        answer: "Venus"
      });
    });
    expect(result.current.question).toBe(
      "What is the hottest planet of our solar system ?"
    );
    expect(result.current.answer).toBe("Venus");
    expect(result.current.isOpened).toBe(false);
  });
  test("accepts a default state", () => {
    const { result } = renderHook(() =>
      useFlashcardFormState({
        isOpened: false,
        question: "What is the hottest planet of our solar system ?",
        answer: "Venus"
      })
    );
    const { isOpened, question, answer } = result.current;
    expect({ isOpened, question, answer }).toEqual({
      isOpened: false,
      question: "What is the hottest planet of our solar system ?",
      answer: "Venus"
    });
  });
});

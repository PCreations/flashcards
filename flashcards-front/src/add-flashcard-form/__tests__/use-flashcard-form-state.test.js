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
  test("question and answer can be submited thus closing the form", () => {
    const { result } = renderHook(() =>
      useFlashcardFormState({ isOpened: true })
    );
    act(() => {
      result.current.submit();
    });
    expect(result.current.isOpened).toBe(false);
  });
  test("accepts a default state", () => {
    const { result } = renderHook(() =>
      useFlashcardFormState({
        isOpened: false
      })
    );
    const { isOpened } = result.current;
    expect({ isOpened }).toEqual({
      isOpened: false
    });
  });
});

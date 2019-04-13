export const FlashcardIdentityService = ({ getNextFlashcardId }: { getNextFlashcardId: () => string }) =>
  Object.freeze({
    getNextFlashcardId,
  });

export type FlashcardIdentityService = ReturnType<typeof FlashcardIdentityService>;

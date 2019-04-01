const FlashcardIdentityService = ({ getNextFlashcardId = () => String() }) =>
  Object.freeze({
    getNextFlashcardId,
  });

module.exports = {
  FlashcardIdentityService,
};

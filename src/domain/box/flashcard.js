const Flashcard = ({ id = String(), answer = String(), question = String() } = {}) =>
  Object.freeze({
    ofQuestion(aQuestion = String()) {
      return Flashcard({ answer, question: aQuestion });
    },
    withAnswer(anAnswer = String()) {
      return Flashcard({ answer: anAnswer, question });
    },
    withId(anId = String()) {
      return Flashcard({ id: anId, answer, question });
    },
    id,
    question,
    answer,
  });

module.exports = {
  Flashcard: Flashcard(),
};

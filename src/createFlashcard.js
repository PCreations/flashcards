const createFlashcard = ({ answer = '', question = '' } = {}) => {
  const missingProperties = [];
  if (!answer) missingProperties.push('"answer"');
  if (!question) missingProperties.push('"question"');
  if (missingProperties.length > 0) {
    throw new Error(`missing properties : ${missingProperties.join(', ')}`);
  }
  return Object.freeze({
    answer,
    question,
  });
};

module.exports = {
  createFlashcard,
};

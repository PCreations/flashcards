const createStep = (stepPattern, createStepFunction) => ({
  [stepPattern](stepDeps) {
    return [new RegExp(stepPattern), createStepFunction(stepDeps)];
  },
});

module.exports = {
  createStep,
};

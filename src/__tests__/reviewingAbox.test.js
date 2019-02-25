describe('given 3 boxes [c1...c5][][] and box1 being reviewed and c1 being the selected card', () => {
  describe('when a correct answer is given to c1', () => {
    test('then the 3 boxes should be [c2...c5][c1][]', () => {});
  });
  describe('when a bad answer is given to c1', () => {
    test('then 3 boxes should remain unchanged', () => {});
  });
});

describe('given 3 boxes [c2...c5][c1][] and box2 being reviewed and c1 being the selected card', () => {
  describe('when a correct answer is given to c1', () => {
    test('then the 3 boxes should be [c2...c5][][c1]', () => {});
  });
  describe('when a bad answer is given to c1', () => {
    test('then 3 boxes should be [c1...c5][][]', () => {});
  });
});

describe('given 3 boxes [c2...c5][][c1] and box3 being reviewed and c1 being the selected card', () => {
  describe('when a correct answer is given to c1', () => {
    test('then the 3 boxes should be [c2...c5][][] and c1 being archived', () => {});
  });
  describe('when a bad answer is given to c1', () => {
    test('then 3 boxes should be [c1...c5][][]', () => {});
  });
});

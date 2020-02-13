const create = firestore => ({
  async getAll(boxId) {
    let doc;
    try {
      doc = await firestore
        .collection("partitions")
        .doc(boxId)
        .get();
    } catch (err) {
      throw new Error("Error getting document", err);
    }
    if (!doc.exists) {
      throw new Error(`Can't find partitions for box ${boxId}`);
    }
    return Object.values(doc.data());
  }
});

const createInMemory = (partitionsData = []) => ({
  async getAll() {
    return partitionsData;
  }
});

module.exports = {
  create,
  createInMemory
};

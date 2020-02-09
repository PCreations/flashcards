import React from "react";
import { Partition } from "./partition";

export const FlashcardList = ({ loading, partitions }) => {
  return loading ? (
    <p>loading...</p>
  ) : (
    partitions.map((flashcards, partitionIndex) => (
      <Partition
        key={partitionIndex}
        partitionNumber={partitionIndex + 1}
        flashcards={flashcards}
      />
    ))
  );
};

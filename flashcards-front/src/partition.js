import React from "react";

export const Partition = ({ partitionNumber = 1, flashcards = [] } = {}) => (
  <section>
    <strong>Partition {partitionNumber}</strong>
    <ul>
      {flashcards.map(({ question }, index) => (
        <li key={index}>{question}</li> // we use index because we don't have id yet
      ))}
    </ul>
  </section>
);

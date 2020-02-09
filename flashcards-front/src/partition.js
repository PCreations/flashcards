import React from "react";

export const Partition = ({ partitionNumber = 1, flashcards = [] } = {}) => (
  <section>
    <strong>Partition {partitionNumber}</strong>
    <ul>
      {flashcards.map(({ question, id }) => (
        <li key={id}>{question}</li>
      ))}
    </ul>
  </section>
);

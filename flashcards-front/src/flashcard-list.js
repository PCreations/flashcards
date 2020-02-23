import React from "react";
import { Partition } from "./partition";

export const FlashcardList = ({ loading, partitions, archivedFlashcards }) => {
  return loading ? (
    <p>loading...</p>
  ) : (
    <>
      {partitions.map((flashcards, partitionIndex) => (
        <Partition
          key={partitionIndex}
          partitionNumber={partitionIndex + 1}
          flashcards={flashcards}
        />
      ))}
      {archivedFlashcards.length > 0 && (
        <section>
          <strong>Archived flashcards</strong>
          <ul>
            {archivedFlashcards.map(({ question, id }) => (
              <li key={id}>
                {question}
                <span role="img" aria-label="check">
                  ✅
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getConfig } from "./config";
import { Partition } from "./partition";

const apiRootUrl = getConfig().API_ROOT_URL;

export const FlashcardList = () => {
  const [flashcardsByPartition, setFlashcardsByPartition] = useState([]);
  useEffect(() => {
    axios
      .get(`${apiRootUrl}/flashcards`)
      .then(res => res.data)
      .then(setFlashcardsByPartition);
  }, []);
  return flashcardsByPartition.map((flashcards, partitionIndex) => (
    <Partition
      key={partitionIndex}
      partitionNumber={partitionIndex + 1}
      flashcards={flashcards}
    />
  ));
};

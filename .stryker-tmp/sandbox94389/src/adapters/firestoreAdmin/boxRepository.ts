import * as admin from 'firebase-admin';
import flatMap from 'lodash/flatMap';
import { BoxRepository as BaseBoxRepository } from '../../domain/box/boxRepository';
import { Box, SessionFlashcard } from '../../domain/box/box';
import { mapPartitions, PartitionNumber, addFlashcardInPartition } from '../../domain/box/partitions';
import { Flashcard } from '../../domain/box/flashcard';
import { Stack, Set } from 'immutable';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://flashcards-7c174.firebaseio.com"
});

const firestore = admin.firestore();

const getBoxId = ({ random, boxName, playerId }: { random: number; boxName: string; playerId: string }) => `test#${random}-${playerId}-${boxName}`;

export const BoxRepository = () => {
  const random = Math.random()
  return BaseBoxRepository({
    async save(box) {
      const { startedAt, lastStartedSessionDate, ...boxToSave } = box.toJS();
      const savedBox = {
        ...boxToSave,
        ...(typeof startedAt === 'undefined' ? {} : { startedAt }),
        ...(typeof lastStartedSessionDate === 'undefined' ? {} : { lastStartedSessionDate }),
      }
      await firestore.
        collection('boxes')
        .doc(getBoxId({ random, boxName: box.name, playerId: box.playerId }))
        .set(savedBox);
      return true;
    },
    async getBoxByName({ boxName, playerId }) {
      return firestore.collection('boxes').doc(getBoxId({ random, boxName, playerId })).get()
        .then(doc => {
          return doc.exists ? Box({
            ...doc.data(),
            partitions: mapPartitions(
              ...flatMap(Object.keys(doc.data().partitions), partitionNumber => doc.data().partitions[partitionNumber].map((flashcard: { question: string; answer: string; }) => addFlashcardInPartition({
                partition: parseInt(partitionNumber, 10) as PartitionNumber,
                flashcard: Flashcard(flashcard)
              }))))(),
            sessionFlashcards: Stack<SessionFlashcard>(doc.data().sessionFlashcards.map(({ flashcard, fromPartition }: SessionFlashcard) => ({ flashcard: Flashcard(flashcard), fromPartition }))),
            archivedFlashcards: Set<Flashcard>(doc.data().archivedFlashcards.map(Flashcard)),
            startedAt: !doc.data().startedAt ? undefined : doc.data().startedAt.toDate(),
            lastStartedSessionDate: !doc.data().lastStartedSessionDate ? undefined : doc.data().lastStartedSessionDate.toDate()
          }) : undefined;
        });
    }
  });
}

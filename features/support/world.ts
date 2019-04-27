import { setWorldConstructor } from 'cucumber';
import { Dependencies, DependenciesPath } from '../../testsUtils/dependencies';
import { Flashcard } from '../../src/domain/box/flashcard';
import { SessionFlashcard } from '../../src/domain/box/box';

export class FlashcardsWorld {
  dependenciesPath: DependenciesPath;
  dependencies: Dependencies;
  currentlyReviewingFlashcard: Flashcard;
  constructor({ parameters }: { parameters: { dependenciesPath: DependenciesPath } }) {
    this.dependenciesPath = parameters.dependenciesPath;
  }
}

setWorldConstructor(FlashcardsWorld);

declare module 'cucumber' {
  interface World {
    dependenciesPath: DependenciesPath;
    dependencies: Dependencies;
    currentlyReviewingFlashcard: SessionFlashcard;
  }
}

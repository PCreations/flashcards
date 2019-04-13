import { setWorldConstructor } from 'cucumber';
import { Dependencies, DependenciesPath } from '../../testsUtils/dependencies';

export class FlashcardsWorld {
  dependenciesPath: DependenciesPath;
  dependencies: Dependencies;
  constructor({ parameters }: { parameters: { dependenciesPath: DependenciesPath } }) {
    this.dependenciesPath = parameters.dependenciesPath;
  }
}

setWorldConstructor(FlashcardsWorld);

declare module 'cucumber' {
  interface World {
    dependenciesPath: DependenciesPath;
    dependencies: Dependencies;
  }
}

import { Authenticate, GetCurrentPlayerId } from '../src/domain/player/authentication';
import { GetBoxByNameAndPlayerId, SaveBox, GetAllBoxesOwnedBy } from '../src/domain/box/repository';
import { DateService } from '../src/domain/box/dateService';

type TestDependencies = {
  player: {
    authenticate: Authenticate;
    getCurrentPlayerId: GetCurrentPlayerId;
  };
  box: {
    getBoxByNameAndPlayerId: GetBoxByNameAndPlayerId;
    saveBox: SaveBox;
    getAllBoxesOwnedBy: GetAllBoxesOwnedBy;
  };
  dateService?: DateService;
};

export type DependenciesContainer = {
  dependencies: TestDependencies;
};

const playerDepsPath = process.env.PLAYER_DEPS;
const boxDepsPath = process.env.BOX_DEPS;

const getDependencies = async (): Promise<TestDependencies> => {
  const {
    createAdapters: createPlayerAdapters,
  }: {
    createAdapters: () => TestDependencies['player'];
  } = await import(`../${playerDepsPath}`);
  const {
    createAdapters: createBoxAdapters,
  }: {
    createAdapters: () => TestDependencies['box'];
  } = await import(`../${boxDepsPath}`);
  const player = createPlayerAdapters();
  const box = createBoxAdapters();
  return {
    get player() {
      return player;
    },
    get box() {
      return box;
    },
  };
};

export const createDepsContainer = () => {
  let dependencies: TestDependencies;
  return {
    get dependencies() {
      return dependencies;
    },
    set dependencies(deps) {
      dependencies = deps;
    },
    async loadDependencies() {
      dependencies = await getDependencies();
    },
  };
};

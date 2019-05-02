import { AuthenticationGateway } from "../src/domain/player/authenticationGateway";
import { BoxRepository } from "../src/domain/box/boxRepository";
import { DateService } from "../src/domain/box/dateService";

type TestDependencies = {
  authenticationGateway: AuthenticationGateway;
  boxRepository: BoxRepository;
  dateService?: DateService;
};

export type DependenciesContainer = {
  dependencies: TestDependencies;
}

const authenticationGatewayPath = process.env.AUTHENTICATION_GATEWAY;
const boxRepositoryPath = process.env.BOX_REPOSITORY;

const getDependencies = async (): Promise<TestDependencies> => {
  const {
    AuthenticationGateway,
  }: {
    AuthenticationGateway: () => TestDependencies['authenticationGateway'];
  } = await import(`../${authenticationGatewayPath}`);
  const {
    BoxRepository,
  }: { BoxRepository: () => TestDependencies['boxRepository'] } = await import(`../${boxRepositoryPath}`);
  const authenticationGateway = AuthenticationGateway();
  const boxRepository = BoxRepository();
  return {
    get authenticationGateway() { return authenticationGateway; },
    get boxRepository() { return boxRepository; },
  };
}

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
    }
  }
}
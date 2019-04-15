import { BoxRepository } from '../src/domain/box/boxRepository';
import { AuthenticationGateway } from '../src/domain/player/authenticationGateway';
import { DateService } from '../src/domain/box/dateService';

export type DependenciesPath = {
  authenticationGateway: string;
  boxRepository: string;
};

export type Dependencies = {
  authenticationGateway: AuthenticationGateway;
  boxRepository: BoxRepository;
  dateService?: DateService;
};

import { BoxRepository } from '../domain/box/boxRepository';

export const StartSessionUseCase = ({ boxRepository }: { boxRepository: BoxRepository }) => ({
  handle({ boxName }: { boxName: string }) {},
});

export type StartSessionUseCase = ReturnType<typeof StartSessionUseCase>;

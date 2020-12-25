import { createContext, useContext } from 'react';
import AuthRepository from './AuthRepository';
import SessionRepository from './SessionRepository';
import ClientRepository from './ClientRepository';
import TrainingRepository from './TrainingRepository';

export interface RepoContextValues {
  clientRepo: ClientRepository;
  sessionRepo: SessionRepository;
  trainingRepo: TrainingRepository;
  authRepo: AuthRepository;
}

export const RepoContext = createContext<RepoContextValues | undefined>(undefined);

export function useRepos() {
  const repos = useContext(RepoContext);
  if (!repos) {
    throw new Error('must be wrapped in a RepoContext.Provider');
  }

  return repos;
}

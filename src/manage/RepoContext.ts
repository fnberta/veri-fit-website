import React, { useContext } from 'react';
import SessionRepository from './SessionRepository';
import UserRepository from './UserRepository';
import TrainingRepository from './TrainingRepository';

export interface RepoContextValues {
  userRepo: UserRepository;
  sessionRepo: SessionRepository;
  trainingRepo: TrainingRepository;
}

export const RepoContext = React.createContext<RepoContextValues | undefined>(undefined);

export function useRepos() {
  const repos = useContext(RepoContext);
  if (!repos) {
    throw new Error('must be wrapped in a RepoContext.Provider');
  }

  return repos;
}

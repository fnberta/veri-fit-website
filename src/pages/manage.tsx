import React, { useEffect, useState } from 'react';
import initRepositories from '../manage/firebase';
import ManageApp from '../manage/ManageApp';
import { RepoContext, RepoContextValues } from '../manage/repositories/RepoContext';

const ManagePage: React.FC = () => {
  const [repos, setRepos] = useState<RepoContextValues>();

  useEffect(() => {
    initRepositories().then(setRepos);
  }, []);

  if (!repos) {
    return null;
  }

  return (
    <RepoContext.Provider value={repos}>
      <ManageApp />
    </RepoContext.Provider>
  );
};

export default ManagePage;

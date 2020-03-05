import { Link, Redirect, Router } from '@reach/router';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import Layout from '../components/Layout';
import Clients from './Clients';
import { UserCredential } from './firebase';
import { useRepos } from './repositories/RepoContext';
import Trainings from './Trainings';
import Navbar from '../components/Navbar';

const ManageApp: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [logInResult, setLoginResult] = useState<UserCredential>();
  const { authRepo } = useRepos();

  useEffect(() => authRepo.observeAuthState(user => setLoggedIn(user != null)), [authRepo]);
  useEffect(() => {
    authRepo.getRedirectResult().then(setLoginResult);
  }, [authRepo]);

  if (!logInResult || !loggedIn) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="w-1/2 bg-white p-4 rounded shadow">
          {!loggedIn && (
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl">Willkommen!</h1>
              <Button
                className="mt-4"
                size="large"
                color="orange"
                loading={!logInResult}
                onClick={() => authRepo.signIn()}
              >
                Login with Google
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const today = DateTime.local();
  return (
    <Layout title="Verwalten">
      <div className="h-full w-full flex flex-col overflow-hidden">
        <Navbar variant="dark">
          <Link to="manage/clients">Kunden</Link>
          <Link to="manage/trainings">Trainings</Link>
        </Navbar>
        <Router className="flex-auto flex overflow-hidden" basepath="/manage">
          <Clients className="flex-auto" path="clients/*clientId" />
          <Trainings className="flex-auto" path="trainings/:year/:week" />
          <Redirect
            default={true}
            noThrow={true}
            from="/"
            to={`/manage/trainings/${today.weekYear}/${today.weekNumber}`}
          />
        </Router>
      </div>
    </Layout>
  );
};

export default ManageApp;

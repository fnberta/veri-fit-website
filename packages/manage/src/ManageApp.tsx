import { Link, Redirect, Route, Switch } from 'react-router-dom';
import { DateTime } from 'luxon';
import { messageSW, Workbox } from 'workbox-window';
import React, { useEffect, useState } from 'react';
import type { auth } from 'firebase';
import { Button } from '@veri-fit/common-ui';
import Clients from './clients/Clients';
import { useRepos } from './repositories/RepoContext';
import Trainings from './trainings/Trainings';
import Navbar from './Navbar';

function registerServiceWorker(): Workbox {
  const wb = new Workbox('/service-worker.js');
  let registration: ServiceWorkerRegistration | undefined;

  const showSkipWaitingPrompt = () => {
    const yes = window.confirm('Reload?');
    if (yes) {
      if (registration && registration.waiting) {
        messageSW(registration.waiting, { type: 'SKIP_WAITING' });
      }
    }
  };

  wb.addEventListener('waiting', showSkipWaitingPrompt);
  wb.addEventListener('externalwaiting', showSkipWaitingPrompt);
  wb.addEventListener('controlling', (e) => {
    if (e.isUpdate) {
      // an updated  service worker has taken control, reload the page
      window.location.reload();
    }
  });
  wb.addEventListener('externalactivated', () => {
    // an external service worker has been activated, reload the page
    window.location.reload();
  });

  wb.register().then((reg) => {
    registration = reg;
  });

  return wb;
}

const ManageApp: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [logInResult, setLoginResult] = useState<auth.UserCredential>();
  const { authRepo } = useRepos();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }
  }, []);
  useEffect(() => authRepo.observeAuthState((user) => setLoggedIn(user != null)), [authRepo]);
  useEffect(() => {
    authRepo.getRedirectResult().then(setLoginResult);
  }, [authRepo]);

  if (!logInResult || !loggedIn) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="w-1/2 bg-white p-4 rounded shadow">
          {!loggedIn && (
            <header className="flex flex-col items-center justify-center">
              <h1 className="text-3xl font-semibold">Willkommen!</h1>
              <Button
                className="mt-4"
                size="large"
                color="orange"
                loading={!logInResult}
                onClick={() => authRepo.signIn()}
              >
                Login with Google
              </Button>
            </header>
          )}
        </div>
      </div>
    );
  }

  const today = DateTime.local();
  return (
    <>
      <Navbar variant="dark">
        <Link to="/clients">Kunden</Link>
        <Link to="/trainings">Trainings</Link>
      </Navbar>
      <Switch>
        <Route path="/clients/:clientId?">
          <Clients className="flex-auto" />
        </Route>
        <Route path="/trainings/:year?/:week?">
          <Trainings className="flex-auto" />
        </Route>
        <Redirect to={`/trainings/${today.weekYear}/${today.weekNumber}`} />
      </Switch>
    </>
  );
};

export default ManageApp;

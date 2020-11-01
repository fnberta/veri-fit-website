import { Redirect, Route, Switch } from 'react-router-dom';
import { DateTime } from 'luxon';
import { messageSW, Workbox } from 'workbox-window';
import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { Button } from '@veri-fit/common-ui';
import Clients from './clients/Clients';
import { useRepos } from './repositories/RepoContext';
import Trainings from './trainings/Trainings';
import Navbar, { NavbarLink } from './Navbar';

function registerServiceWorker(): Workbox {
  const wb = new Workbox('/service-worker.js');
  let registration: ServiceWorkerRegistration | undefined;

  const showSkipWaitingPrompt = () => {
    const yes = window.confirm('Eine neue Version ist verfügbar. Klicke auf "ok" um diese zu laden.');
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

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [logInResult, setLoginResult] = useState<firebase.auth.UserCredential>();
  const { authRepo } = useRepos();

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
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
        {!loggedIn && (
          <header
            style={{ width: '30rem' }}
            className="p-8 flex flex-col items-center justify-center bg-white rounded shadow space-y-6"
          >
            <h1 className="text-3xl">Willkommen zurück!</h1>
            <Button className="self-stretch" color="orange" loading={!logInResult} onClick={() => authRepo.signIn()}>
              <span className="uppercase tracking-wider">Login</span>
            </Button>
          </header>
        )}
      </div>
    );
  }

  const today = DateTime.local();
  return (
    <>
      <Navbar className="flex-shrink-0">
        <NavbarLink to="/clients">Kunden</NavbarLink>
        <NavbarLink to="/trainings">Trainings</NavbarLink>
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

export default App;

import { Redirect, Route, Switch } from 'react-router-dom';
import { DateTime } from 'luxon';
import { Workbox } from 'workbox-window';
import React, { FC, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { Button } from '@veri-fit/common-ui';
import Clients from './clients/Clients';
import { useRepos } from './repositories/RepoContext';
import Trainings from './trainings/Trainings';
import Navbar, { NavbarLink } from './Navbar';

async function registerServiceWorker(): Promise<Workbox> {
  const wb = new Workbox('/service-worker.js');

  wb.addEventListener('waiting', () => {
    const yes = window.confirm('Eine neue Version ist verfügbar. Klicke auf "ok" um diese zu laden.');
    if (yes) {
      wb.messageSkipWaiting();
    }
  });
  wb.addEventListener('controlling', (e) => {
    if (e.isUpdate) {
      // an updated  service worker has taken control, reload the page
      window.location.reload();
    }
  });

  await wb.register();
  return wb;
}

const App: FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [logInResult, setLoginResult] = useState<firebase.auth.UserCredential>();
  const { authRepo } = useRepos();

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      registerServiceWorker().catch((e) => {
        // eslint-disable-next-line no-console
        console.error('registering service worker failed with', e);
      });
    }
  }, []);
  useEffect(() => authRepo.observeAuthState((user) => setLoggedIn(user != null)), [authRepo]);
  useEffect(() => {
    authRepo
      .getRedirectResult()
      .then(setLoginResult)
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error('social login failed with', e);
      });
  }, [authRepo]);

  if (!loggedIn) {
    return (
      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
        <header
          style={{ maxWidth: '30rem' }}
          className="w-full p-8 flex flex-col items-center justify-center bg-white rounded shadow space-y-6"
        >
          <h1 className="text-3xl">Willkommen zurück!</h1>
          <Button
            className="self-stretch"
            colorScheme="orange"
            loading={!logInResult}
            onClick={() => authRepo.signIn()}
          >
            <span className="uppercase tracking-wider">Login</span>
          </Button>
        </header>
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

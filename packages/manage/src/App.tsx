import { Redirect, Route, Switch } from 'react-router-dom';
import { DateTime } from 'luxon';
import { Workbox } from 'workbox-window';
import React, { FC, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import { Button } from '@veri-fit/common-ui';
import Clients from './clients/Clients';
import { useRepos } from './repositories/RepoContext';
import Trainings from './trainings/Trainings';

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

type AuthState = { type: 'initial' } | { type: 'loggedOut' } | { type: 'loggedIn'; user: firebase.User };

const App: FC = () => {
  const [authState, setAuthState] = useState<AuthState>({ type: 'initial' });
  const { authRepo } = useRepos();

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      registerServiceWorker().catch((e) => {
        // eslint-disable-next-line no-console
        console.error('registering service worker failed with', e);
      });
    }
  }, []);
  useEffect(
    () =>
      authRepo.observeAuthState((user) => {
        if (user) {
          setAuthState({ type: 'loggedIn', user });
        } else {
          setAuthState({ type: 'loggedOut' });
        }
      }),
    [authRepo],
  );

  if (authState.type !== 'loggedIn') {
    return (
      <div className="flex-1 p-6 bg-gray-100 flex items-center justify-center">
        <header
          style={{ maxWidth: '30rem' }}
          className="w-full p-8 flex flex-col items-center justify-center bg-white rounded shadow space-y-6"
        >
          <h1 className="text-3xl">Willkommen zurück!</h1>
          <Button
            className="self-stretch"
            colorScheme="orange"
            loading={authState.type === 'initial'}
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
    <Switch>
      <Route path="/clients/:clientId?" upTarget="/clients">
        <Clients />
      </Route>
      <Route path="/trainings/:year?/:week?">
        <Trainings />
      </Route>
      <Redirect to={`/trainings/${today.weekYear}/${today.weekNumber}`} />
    </Switch>
  );
};

export default App;

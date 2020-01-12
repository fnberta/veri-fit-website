import styled from '@emotion/styled';
import { Redirect, Router, Link } from '@reach/router';
import React, { useEffect, useState } from 'react';
import Button from '../components/bulma/Button';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar2';
import { ManagePageQuery } from '../generatedGraphQL';
import Clients from '../manage/Clients';
import initFirebase, { getGoogleAuthProvider } from '../manage/firebase';
import AuthRepository from '../manage/repositories/AuthRepository';
import ClientRepository from '../manage/repositories/ClientRepository';
import { RepoContext, RepoContextValues } from '../manage/repositories/RepoContext';
import SessionRepository from '../manage/repositories/SessionRepository';
import TrainingRepository from '../manage/repositories/TrainingRepository';
import Trainings from '../manage/Trainings';

const firebaseApp = initFirebase();
const db = firebaseApp.firestore();
const functions = firebaseApp.functions();
const auth = firebaseApp.auth();
auth.useDeviceLanguage();
const clientRepo = new ClientRepository(db);
const sessionRepo = new SessionRepository(db, functions);
const trainingRepo = new TrainingRepository(db);
const authRepo = new AuthRepository(auth, getGoogleAuthProvider());

const repos: RepoContextValues = {
  clientRepo,
  sessionRepo,
  trainingRepo,
  authRepo,
};

export interface Props {
  data: ManagePageQuery;
}

const PlainButton = styled.button({
  border: 'none',
  font: 'inherit',
  background: 'none',
  cursor: 'pointer',
  '&:hover': {
    color: '#fd892c',
  },
});

const ManagePage: React.FC<Props> = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [logInResult, setLoginResult] = useState();

  useEffect(() => authRepo.observeAuthState(user => setLoggedIn(user != null)), []);
  useEffect(() => {
    authRepo.getRedirectResult().then(setLoginResult);
  }, []);

  if (!logInResult) {
    return <div>loading…</div>;
  }

  if (!loggedIn) {
    return (
      <div>
        <Button text="Login with Google" intent="primary" onClick={() => authRepo.signIn()} />
      </div>
    );
  }

  return (
    <RepoContext.Provider value={repos}>
      <Layout title="Verwalten">
        <Navbar fixed={true} logo={<img src={require('../images/logo_blue.png')} title="Veri-Fit" alt="Veri-Fit" />}>
          <Link to="manage/clients">Kunden</Link>
          <Link to="manage/trainings">Trainings</Link>
          <PlainButton onClick={() => authRepo.singOut()}>Ausloggen</PlainButton>
        </Navbar>
        <Router>
          <Clients path="manage/clients" />
          <Clients path="manage/clients/:clientId" />
          <Trainings path="manage/trainings" />
          <Redirect default={true} noThrow={true} from="/" to="manage/trainings" />
        </Router>
      </Layout>
    </RepoContext.Provider>
  );
};

export default ManagePage;

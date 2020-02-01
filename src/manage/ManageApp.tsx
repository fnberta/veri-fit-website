import styled from '@emotion/styled';
import { Link, Redirect, Router } from '@reach/router';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import Button from '../components/bulma/Button';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar2';
import Clients from './Clients';
import { useRepos } from './repositories/RepoContext';
import Trainings from './Trainings';

const PlainButton = styled.button({
  border: 'none',
  font: 'inherit',
  background: 'none',
  cursor: 'pointer',
  '&:hover': {
    color: '#fd892c',
  },
});

const ManageApp: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [logInResult, setLoginResult] = useState();
  const { authRepo } = useRepos();

  useEffect(() => authRepo.observeAuthState(user => setLoggedIn(user != null)), [authRepo]);
  useEffect(() => {
    authRepo.getRedirectResult().then(setLoginResult);
  }, [authRepo]);

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

  const today = DateTime.local();
  return (
    <Layout title="Verwalten">
      <Navbar fixed={true} logo={<img src={require('../images/logo_blue.png')} title="Veri-Fit" alt="Veri-Fit" />}>
        <Link to="manage/clients">Kunden</Link>
        <Link to="manage/trainings">Trainings</Link>
        <PlainButton onClick={() => authRepo.singOut()}>Ausloggen</PlainButton>
      </Navbar>
      <Router basepath="/manage">
        <Clients path="clients" />
        <Clients path="clients/:clientId" />
        <Trainings path="trainings/:year/:week" />
        <Redirect default={true} noThrow={true} from="/" to={`/manage/trainings/${today.year}/${today.weekNumber}`} />
      </Router>
    </Layout>
  );
};

export default ManageApp;

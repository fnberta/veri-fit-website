import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import App from './App';
import { RepoContext } from './repositories/RepoContext';
import ClientRepository from './repositories/ClientRepository';
import SessionRepository from './repositories/SessionRepository';
import TrainingRepository from './repositories/TrainingRepository';
import AuthRepository from './repositories/AuthRepository';
import ErrorBoundary from './ErrorBoundary';

import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';
import './index.css';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'veri-fit.firebaseapp.com',
  databaseURL: 'https://veri-fit.firebaseio.com',
  projectId: 'veri-fit',
  storageBucket: '',
  messagingSenderId: '955308028827',
  appId: '1:955308028827:web:e561450b497b3a257d673e',
};

const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
auth.useDeviceLanguage();
const db = app.firestore();
const functions = app.functions();

if (window.location.hostname === 'localhost') {
  // auth.useEmulator('http://localhost:9099')
  db.useEmulator('localhost', 8080);
  functions.useEmulator('localhost', 5001);
}

const clientRepo = new ClientRepository(db);
const sessionRepo = new SessionRepository(db, functions);
const trainingRepo = new TrainingRepository(db);
const authRepo = new AuthRepository(auth, new firebase.auth.GoogleAuthProvider());
const repos = {
  clientRepo,
  sessionRepo,
  trainingRepo,
  authRepo,
};

const root = (
  <BrowserRouter>
    <RepoContext.Provider value={repos}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </RepoContext.Provider>
  </BrowserRouter>
);

render(root, window.document.getElementById('root'));

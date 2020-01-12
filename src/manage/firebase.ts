import { firestore, functions, auth, User as FirebaseUser } from 'firebase';
import AuthRepository from './repositories/AuthRepository';
import ClientRepository from './repositories/ClientRepository';
import { RepoContextValues } from './repositories/RepoContext';
import SessionRepository from './repositories/SessionRepository';
import TrainingRepository from './repositories/TrainingRepository';

export type Firestore = firestore.Firestore;
export type Functions = functions.Functions;
export type Auth = auth.Auth;
export type HttpsCallable = functions.HttpsCallable;
export type AuthProvider = auth.GoogleAuthProvider;
export type User = FirebaseUser;

const firebaseConfig = {
  apiKey: 'AIzaSyBoigzCLWt04NFAVZz6f41APTszUPzuWJM',
  authDomain: 'veri-fit.firebaseapp.com',
  databaseURL: 'https://veri-fit.firebaseio.com',
  projectId: 'veri-fit',
  storageBucket: '',
  messagingSenderId: '955308028827',
  appId: '1:955308028827:web:e561450b497b3a257d673e',
};

export default async function initRepositories(): Promise<RepoContextValues> {
  const [firebase] = await Promise.all([
    import('firebase/app'),
    import('firebase/firestore'),
    import('firebase/functions'),
    import('firebase/auth'),
  ]);

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const functions = firebaseApp.functions();
  const auth = firebaseApp.auth();
  auth.useDeviceLanguage();
  const clientRepo = new ClientRepository(db);
  const sessionRepo = new SessionRepository(db, functions);
  const trainingRepo = new TrainingRepository(db);
  const authRepo = new AuthRepository(auth, new firebase.auth.GoogleAuthProvider());
  return {
    clientRepo,
    sessionRepo,
    trainingRepo,
    authRepo,
  };
}

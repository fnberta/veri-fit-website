import AuthRepository from './repositories/AuthRepository';
import ClientRepository from './repositories/ClientRepository';
import { RepoContextValues } from './repositories/RepoContext';
import SessionRepository from './repositories/SessionRepository';
import TrainingRepository from './repositories/TrainingRepository';

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
  const auth = firebaseApp.auth();
  auth.useDeviceLanguage();
  const db = firebaseApp.firestore();
  const functions = firebaseApp.functions();

  if (window.location.hostname === 'localhost') {
    db.settings({
      host: 'localhost:8080',
      ssl: false,
    });
    functions.useFunctionsEmulator('http://localhost:5001');
  }

  const clientRepo = new ClientRepository(db);
  const sessionRepo = new SessionRepository(db, functions, firebase.firestore.FieldValue.delete);
  const trainingRepo = new TrainingRepository(db);
  const authRepo = new AuthRepository(auth, new firebase.auth.GoogleAuthProvider());
  return {
    clientRepo,
    sessionRepo,
    trainingRepo,
    authRepo,
  };
}

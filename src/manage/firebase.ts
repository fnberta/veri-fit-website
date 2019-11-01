import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/functions';

export type Firestore = firebase.firestore.Firestore;
export type Functions = firebase.functions.Functions;
export type DocumentSnapshot = firebase.firestore.DocumentSnapshot;
export type HttpsCallable = firebase.functions.HttpsCallable;

const firebaseConfig = {
  apiKey: 'AIzaSyBoigzCLWt04NFAVZz6f41APTszUPzuWJM',
  authDomain: 'veri-fit.firebaseapp.com',
  databaseURL: 'https://veri-fit.firebaseio.com',
  projectId: 'veri-fit',
  storageBucket: '',
  messagingSenderId: '955308028827',
  appId: '1:955308028827:web:e561450b497b3a257d673e',
};

export default function initFirebase(): firebase.app.App {
  return firebase.initializeApp(firebaseConfig);
}

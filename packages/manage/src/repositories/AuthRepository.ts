import firebase from 'firebase/app';

export default class AuthRepository {
  constructor(private readonly auth: firebase.auth.Auth, private readonly provider: firebase.auth.AuthProvider) {}

  async signIn() {
    await this.auth.signInWithRedirect(this.provider);
  }

  getRedirectResult() {
    return this.auth.getRedirectResult();
  }

  async signOut() {
    await this.auth.signOut();
  }

  observeAuthState(onChange: (user: firebase.User | null) => void): firebase.Unsubscribe {
    return this.auth.onAuthStateChanged(onChange);
  }
}

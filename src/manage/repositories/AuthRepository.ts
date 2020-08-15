import { auth, Unsubscribe, User } from 'firebase';

export default class AuthRepository {
  constructor(private readonly auth: auth.Auth, private readonly provider: auth.AuthProvider) {}

  async signIn() {
    await this.auth.signInWithRedirect(this.provider);
  }

  getRedirectResult() {
    return this.auth.getRedirectResult();
  }

  async singOut() {
    await this.auth.signOut();
  }

  observeAuthState(onChange: (user: User | null) => void): Unsubscribe {
    return this.auth.onAuthStateChanged(onChange);
  }
}

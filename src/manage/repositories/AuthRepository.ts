import { Unsubscribe, User } from 'firebase';
import { Auth, AuthProvider } from '../firebase';

export default class AuthRepository {
  constructor(private readonly auth: Auth, private readonly provider: AuthProvider) {}

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

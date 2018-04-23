import React from 'react';
import { noop } from 'utils/noop';

interface AuthContext {
  onLogin(): void;
  onLogout(): void;
  authError: boolean;
  fetchStatus: 'none' | 'loading' | 'error';
  user: any;
}

const defaultValue: AuthContext = {
  onLogin: noop,
  onLogout: noop,
  user: null,
  fetchStatus: 'none',
  authError: null,
};

const { Consumer, Provider } = React.createContext(defaultValue);

class AuthProvider extends React.Component<{}, AuthContext> {
  public static Consumer = Consumer;

  private onLogin = () => {
    this.setState(() => ({
      user: {},
    }));
  };

  private onLogout = () => {
    this.setState(() => ({
      user: null,
    }));
  };

  public state: AuthContext = {
    user: null,
    onLogin: this.onLogin,
    onLogout: this.onLogout,
    fetchStatus: 'none',
    authError: null,
  };

  public render() {
    const { children } = this.props;
    return <Provider value={this.state}>{children}</Provider>;
  }
}

export { AuthProvider };

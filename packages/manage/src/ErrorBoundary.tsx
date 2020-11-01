import React from 'react';

export interface Props {
  children: React.ReactNode;
}

export interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('uncaught error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Oops! Something went wrong :(</h1>;
    }

    return this.props.children;
  }
}

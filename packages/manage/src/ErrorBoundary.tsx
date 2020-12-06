import React, { Component, ErrorInfo, ReactNode } from 'react';

export interface Props {
  children: ReactNode;
}

export interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
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

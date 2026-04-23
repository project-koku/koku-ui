import { Button, EmptyState, EmptyStateActions, EmptyStateBody, EmptyStateFooter } from '@patternfly/react-core';
import { messages } from 'i18n/messages';
import React from 'react';
import { useIntl } from 'react-intl';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

const ErrorBoundaryFallback: React.FC<{ error: Error | null; onReset: () => void }> = ({ error, onReset }) => {
  const intl = useIntl();
  return (
    <EmptyState titleText={intl.formatMessage(messages.errorBoundaryTitle)} headingLevel="h2">
      <EmptyStateBody>{error?.message || intl.formatMessage(messages.errorBoundaryUnexpected)}</EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Button variant="primary" onClick={onReset}>
            {intl.formatMessage(messages.errorBoundaryTryAgain)}
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

ErrorBoundaryFallback.displayName = 'ErrorBoundaryFallback';

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static displayName = 'ErrorBoundary';

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  state: ErrorBoundaryState = { hasError: false, error: null };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // eslint-disable-next-line no-console -- ErrorBoundary: log to console for debugging
    console.error('Sources UI error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryFallback error={this.state.error} onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}

export { ErrorBoundary };

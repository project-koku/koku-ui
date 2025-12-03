import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { intl as realIntl } from '@koku-ui/i18n/i18n';
import { EmptyStateVariant } from '@patternfly/react-core';
import { ErrorState, SourceStepErrorStateBase, SourcesModalErrorStateBase } from './errorState';

const onRefresh = jest.fn();

// Create a lightweight intl stub to avoid circular structure in mock formatting of message params
const intl: any = {
  ...realIntl,
  formatMessage: ({ defaultMessage, id }) => defaultMessage || id,
};

describe('costModels/components/errorState extra', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('ErrorState renders with title, description and action', () => {
    render(
      <ErrorState
        variant={EmptyStateVariant.lg}
        actionButton={<button>act</button>}
        description={<div>desc</div>}
        title="title"
      />
    );
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('desc')).toBeInTheDocument();
    expect(screen.getByText('act')).toBeInTheDocument();
  });

  test('SourceStepErrorStateBase invokes onRefresh on button click', () => {
    render(<SourceStepErrorStateBase intl={intl} onRefresh={onRefresh} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onRefresh).toHaveBeenCalled();
  });

  test('SourcesModalErrorStateBase invokes onRefresh on button click', () => {
    render(<SourcesModalErrorStateBase intl={intl} onRefresh={onRefresh} query={{}} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onRefresh).toHaveBeenCalled();
  });
}); 
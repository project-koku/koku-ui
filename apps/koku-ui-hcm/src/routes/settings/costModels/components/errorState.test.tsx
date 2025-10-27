import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SourceStepErrorStateBase, SourcesModalErrorStateBase } from './errorState';

// Simple intl mock
const intl: any = { formatMessage: ({ defaultMessage, id }, values) => defaultMessage || id };

describe('costModels/components/ErrorState', () => {
  test('SourceStepErrorStateBase renders and triggers refresh', () => {
    const onRefresh = jest.fn();
    render(<SourceStepErrorStateBase intl={intl} onRefresh={onRefresh} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onRefresh).toHaveBeenCalled();
  });

  test('SourcesModalErrorStateBase renders and triggers refresh', () => {
    const onRefresh = jest.fn();
    render(<SourcesModalErrorStateBase intl={intl} onRefresh={onRefresh} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onRefresh).toHaveBeenCalled();
  });
});

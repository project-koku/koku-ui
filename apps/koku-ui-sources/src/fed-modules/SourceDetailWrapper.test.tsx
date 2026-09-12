import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { SourceDetailWrapper } from './SourceDetailWrapper';

jest.mock('@koku-ui/ui-lib/components/page/uiVersion', () => () => <div data-testid="ui-version" />);

jest.mock('components/sources-detail/SourceDetail', () => ({
  SourceDetail: ({
    canWrite,
    onBack,
    uuid,
  }: {
    canWrite?: boolean;
    onBack?: () => void;
    uuid?: string;
  }) => (
    <div>
      <div data-testid="source-detail">{uuid}</div>
      <div data-testid="can-write">{String(!!canWrite)}</div>
      <button type="button" onClick={onBack}>
        Back
      </button>
    </div>
  ),
}));

describe('SourceDetailWrapper', () => {
  it('wires uuid, canWrite, and onBack through to SourceDetail', async () => {
    const user = userEvent.setup();
    const onBack = jest.fn();

    render(<SourceDetailWrapper canWrite uuid="src-uuid" onBack={onBack} />);

    expect(screen.getByTestId('source-detail')).toHaveTextContent('src-uuid');
    expect(screen.getByTestId('can-write')).toHaveTextContent('true');
    expect(screen.getByTestId('ui-version')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalled();
  });

  it('defaults canWrite to false', () => {
    render(<SourceDetailWrapper uuid="src-uuid" onBack={jest.fn()} />);

    expect(screen.getByTestId('can-write')).toHaveTextContent('false');
  });
});

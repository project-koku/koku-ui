import { render, screen } from '@testing-library/react';
import React from 'react';

import { SourcesPageWrapper } from './SourcesPageWrapper';

jest.mock('@koku-ui/ui-lib/components/page/uiVersion', () => () => <div data-testid="ui-version" />);

jest.mock('components/sources-page/SourcesPage', () => ({
  SourcesPage: ({ canWrite }: { canWrite?: boolean }) => (
    <div data-testid="sources-page">{String(!!canWrite)}</div>
  ),
}));

describe('SourcesPageWrapper', () => {
  it('renders SourcesPage with canWrite', () => {
    render(<SourcesPageWrapper canWrite />);

    expect(screen.getByTestId('sources-page')).toHaveTextContent('true');
    expect(screen.getByTestId('ui-version')).toBeInTheDocument();
  });

  it('defaults canWrite to false', () => {
    render(<SourcesPageWrapper />);

    expect(screen.getByTestId('sources-page')).toHaveTextContent('false');
  });
});

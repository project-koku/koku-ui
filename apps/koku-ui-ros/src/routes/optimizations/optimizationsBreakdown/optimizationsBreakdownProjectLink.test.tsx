import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { FetchStatus } from 'store/common';

import { OptimizationsBreakdownProjectLink } from './optimizationsBreakdownProjectLink';

const mockUseSelector = jest.fn();
let mockIsProjectLinkToggleEnabled = false;

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector: any) => mockUseSelector(selector),
}));

jest.mock('components/featureToggle', () => ({
  useIsProjectLinkToggleEnabled: () => mockIsProjectLinkToggleEnabled,
}));

jest.mock('store/reports', () => ({
  reportActions: { fetchReport: jest.fn() },
  reportSelectors: {
    selectReport: jest.fn(),
    selectReportFetchStatus: jest.fn(),
    selectReportError: jest.fn(),
  },
}));

jest.mock('routes/utils/computedReport/getComputedReportItems', () => ({
  getUnsortedComputedReportItems: ({ report }: { report: { items?: unknown[] } }) => report.items || [],
}));

describe('OptimizationsBreakdownProjectLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsProjectLinkToggleEnabled = false;
    mockUseSelector.mockImplementation(() => undefined);
  });

  test('returns plain project text when the link is disabled', () => {
    render(
      <MemoryRouter>
        <OptimizationsBreakdownProjectLink project="app" />
      </MemoryRouter>
    );
    expect(screen.getByText('app')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  test('returns null while the report is loading', () => {
    mockIsProjectLinkToggleEnabled = true;
    const { container } = render(
      <MemoryRouter>
        <OptimizationsBreakdownProjectLink project="app" projectPath="/ocp" />
      </MemoryRouter>
    );
    expect(container).toBeEmptyDOMElement();
  });

  test('renders a disabled link when there are no computed items', () => {
    mockIsProjectLinkToggleEnabled = true;
    mockUseSelector
      .mockImplementationOnce(() => ({ items: [] }))
      .mockImplementationOnce(() => FetchStatus.complete)
      .mockImplementationOnce(() => undefined);

    render(
      <MemoryRouter>
        <OptimizationsBreakdownProjectLink project="app" projectPath="/ocp" />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'app' })).toHaveAttribute('aria-disabled', 'true');
  });

  test('renders an enabled project link', () => {
    mockIsProjectLinkToggleEnabled = true;
    mockUseSelector
      .mockImplementationOnce(() => ({ items: [{ id: 'app' }] }))
      .mockImplementationOnce(() => FetchStatus.complete)
      .mockImplementationOnce(() => undefined);

    render(
      <MemoryRouter>
        <OptimizationsBreakdownProjectLink project="app" projectPath="/ocp" />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'app' })).toHaveAttribute('href', expect.stringContaining('/ocp?'));
  });
});

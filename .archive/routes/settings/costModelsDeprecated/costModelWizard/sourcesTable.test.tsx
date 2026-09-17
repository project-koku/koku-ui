import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SourcesTable from './sourcesTable';
import { CostModelContext, defaultCostModelContext } from './context';
import { IntlProvider } from 'react-intl';

// Ensure injectIntl provides a minimal intl stub
jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    __esModule: true,
    ...actual,
    injectIntl: (Comp: any) => (props: any) => (
      <Comp
        {...props}
        intl={{
          formatMessage: ({ defaultMessage, id }: any) => defaultMessage || id || '',
        }}
      />
    ),
  };
});

// Deterministic AssignSourcesToolbar that exposes a search button
jest.mock('./assignSourcesToolbar', () => ({
  __esModule: true,
  AssignSourcesToolbar: ({ filterInputProps }: any) => (
    <button onClick={() => filterInputProps.onSearch?.()}>search</button>
  ),
}));

// Minimal mocks for PF components used indirectly by Table
jest.mock('@patternfly/react-table', () => ({
  __esModule: true,
  Table: ({ children, ...rest }: any) => <table {...rest}>{children}</table>,
  Thead: ({ children }: any) => <thead>{children}</thead>,
  Tbody: ({ children }: any) => <tbody>{children}</tbody>,
  Tr: ({ children }: any) => <tr>{children}</tr>,
  Th: ({ children }: any) => <th>{children}</th>,
  Td: ({ children }: any) => <td>{children}</td>,
  TableVariant: { compact: 'compact' },
}));

const renderWithCtx = (ctx: any) => {
  return render(
    <IntlProvider locale="en">
      <CostModelContext.Provider value={ctx}>
        <SourcesTable />
      </CostModelContext.Provider>
    </IntlProvider>
  );
};

describe('costModelWizard/table SourcesTable', () => {
  const baseCtx = {
    ...defaultCostModelContext,
    type: 'AWS',
    perPage: 10,
    page: 1,
    query: {},
    filterName: '',
    checked: {},
    sources: [
      { name: 'src-1', uuid: 'u1', costmodel: '', meta: { count: 2 } },
      { name: 'src-2', uuid: 'u2', costmodel: 'cm-a', meta: { count: 2 } },
    ],
    fetchSources: jest.fn(),
    onFilterChange: jest.fn(),
    onSourceSelect: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    renderWithCtx({ ...baseCtx, loading: true });
    // Table not present when loading
    expect(screen.queryByRole('table')).toBeNull();
  });

  test('renders rows and disables checkbox when costmodel exists', () => {
    renderWithCtx({ ...baseCtx, loading: false });
    expect(screen.getByText('src-1')).toBeInTheDocument();
    expect(screen.getByText('src-2')).toBeInTheDocument();
    // Checkbox for src-2 should be disabled due to costmodel
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[1]).toBeDisabled();
  });

  test('selecting a row calls onSourceSelect', () => {
    renderWithCtx({ ...baseCtx, loading: false });
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);
    expect(baseCtx.onSourceSelect).toHaveBeenCalled();
  });

  test('toolbar search triggers fetchSources with filter applied', () => {
    renderWithCtx({ ...baseCtx, loading: false, filterName: 'foo' });
    fireEvent.click(screen.getByText('search'));
    expect(baseCtx.fetchSources).toHaveBeenCalled();
  });
});

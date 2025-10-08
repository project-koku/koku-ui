import { render, fireEvent, screen } from '@testing-library/react';
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

// Mock AssignSourcesToolbar to expose buttons for all callbacks
jest.mock('./assignSourcesToolbar', () => ({
  __esModule: true,
  AssignSourcesToolbar: ({ filter, filterInputProps, paginationProps }: any) => (
    <div>
      <button onClick={() => filterInputProps.onSearch?.()}>search</button>
      <button onClick={() => filter.onRemove?.('name', 'chip')}>remove</button>
      <button onClick={() => filter.onClearAll?.()}>clear</button>
      <button onClick={() => paginationProps.onSetPage?.(undefined as any, 2)}>page2</button>
      <button onClick={() => paginationProps.onPerPageSelect?.(undefined as any, 20)}>perPage20</button>
    </div>
  ),
}));

// Mock bottom PaginationToolbarTemplate to expose its callbacks too
jest.mock('routes/settings/costModels/components/paginationToolbarTemplate', () => ({
  __esModule: true,
  PaginationToolbarTemplate: ({ onSetPage, onPerPageSelect }: any) => (
    <div>
      <button onClick={() => onSetPage?.(undefined as any, 3)}>bottomPage3</button>
      <button onClick={() => onPerPageSelect?.(undefined as any, 30)}>bottomPerPage30</button>
    </div>
  ),
}));

// Minimal mocks for PF table primitives
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

// Mock only Truncate from PatternFly to avoid innerRef warnings in tests
jest.mock('@patternfly/react-core', () => {
  const actual = jest.requireActual('@patternfly/react-core');
  return {
    __esModule: true,
    ...actual,
    Truncate: ({ content }: any) => <span>{content}</span>,
  };
});

const renderWithCtx = (ctx: any) =>
  render(
    <IntlProvider locale="en">
      <CostModelContext.Provider value={ctx}>
        <SourcesTable />
      </CostModelContext.Provider>
    </IntlProvider>
  );

describe('costModelWizard/table SourcesTable (more)', () => {
  const baseCtx = {
    ...defaultCostModelContext,
    type: 'Azure',
    perPage: 10,
    page: 1,
    query: { name: ['foo'] },
    filterName: 'foo',
    checked: { u1: { selected: true } },
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

  test('toolbar remove, clear, search, and pagination callbacks call fetchSources with expected paging', () => {
    renderWithCtx({ ...baseCtx, loading: false });

    fireEvent.click(screen.getByText('remove'));
    fireEvent.click(screen.getByText('clear'));
    fireEvent.click(screen.getByText('search'));
    fireEvent.click(screen.getByText('page2'));
    fireEvent.click(screen.getByText('perPage20'));

    expect(baseCtx.fetchSources).toHaveBeenCalled();
    // last call from perPage20 should set page to 1 and perPage to 20
    const last = (baseCtx.fetchSources as jest.Mock).mock.calls.pop();
    expect(last[0]).toBe('Azure');
    expect(last[2]).toBe(1);
    expect(last[3]).toBe(20);
  });

  test('bottom pagination triggers fetchSources', () => {
    renderWithCtx({ ...baseCtx, loading: false });
    fireEvent.click(screen.getByText('bottomPage3'));
    fireEvent.click(screen.getByText('bottomPerPage30'));
    expect(baseCtx.fetchSources).toHaveBeenCalled();
  });

  test('checkbox reflects checked state and disables when costmodel exists', () => {
    renderWithCtx({ ...baseCtx, loading: false });
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeDisabled();
  });
});

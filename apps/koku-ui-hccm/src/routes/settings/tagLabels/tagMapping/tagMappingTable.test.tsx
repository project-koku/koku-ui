import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { TagMappingTable } from './tagMappingTable';

jest.mock('routes/components/dataTable', () => ({
  ExpandTable: ({ columns, isLoading, onSort, rows }: any) => (
    <div>
      {isLoading && <div>table-loading</div>}
      {rows.map((row: any, index: number) => (
        <div key={index}>
          <span>{row.cells[1]?.value}</span>
          {row.children?.map((child: any, childIndex: number) => (
            <span key={childIndex}>{child.cells[1]?.value}</span>
          ))}
          <button type="button" onClick={() => onSort(columns[1]?.orderBy, true)}>
            sort
          </button>
        </div>
      ))}
    </div>
  ),
}));

jest.mock('routes/settings/tagLabels/tagMapping/components/actions', () => ({
  Actions: () => <span>parent-actions</span>,
}));

jest.mock('routes/settings/tagLabels/tagMapping/components/deleteTagMapping', () => ({
  DeleteTagMappingAction: () => <span>child-delete</span>,
}));

const settings = {
  data: [
    {
      parent: { uuid: 'p-1', key: 'env', source_type: 'AWS' },
      children: [{ uuid: 'c-1', key: 'app', source_type: 'OCP' }],
    },
  ],
  meta: { count: 1 },
} as any;

describe('TagMappingTable', () => {
  test('returns no rows when settings is missing', () => {
    render(
      <TagMappingTable
        canWrite
        isLoading={false}
        onSort={jest.fn()}
        orderBy={{ parent: 'asc' }}
        settings={null}
      />
    );
    expect(screen.queryByText('env')).not.toBeInTheDocument();
  });

  test('renders parent and child rows and sorts', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSort = jest.fn();
    render(
      <TagMappingTable
        canWrite
        filterBy={{ child: 'app' }}
        isLoading={false}
        onSort={onSort}
        orderBy={{ parent: 'asc' }}
        settings={settings}
      />
    );

    expect(screen.getByText('env')).toBeInTheDocument();
    expect(screen.getByText('app')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'sort' }));
    expect(onSort).toHaveBeenCalledWith('parent', true);
  });
});

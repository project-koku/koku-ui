import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { DataToolbarBase } from './dataToolbar';
import { CriteriaType } from './utils/criteria';

const categoryOptions = [
  { name: 'Name', key: 'name' },
  { name: 'Project', key: 'project' },
];

describe('DataToolbarBase', () => {
  test('renders filter toolbar with default category options', () => {
    render(<DataToolbarBase showFilter intl={{} as any} />);

    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
  });

  test('restores filters from query on mount', () => {
    render(
      <DataToolbarBase
        showFilter
        intl={{} as any}
        query={{ filter_by: { name: ['test-name'] } }}
      />
    );

    expect(screen.getByText('test-name')).toBeInTheDocument();
  });

  test('adds filter on category input search', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onFilterAdded = jest.fn();

    render(
      <DataToolbarBase
        categoryOptions={categoryOptions}
        showFilter
        intl={{} as any}
        onFilterAdded={onFilterAdded}
      />
    );

    const input = screen.getByPlaceholderText(/name/i);
    await user.type(input, 'my-filter{enter}');

    expect(onFilterAdded).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'name', value: 'my-filter', excludeType: CriteriaType.include })
    );
    expect(screen.getByText('my-filter')).toBeInTheDocument();
  });

  test('removes filters when clear all is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onFilterRemoved = jest.fn();

    render(
      <DataToolbarBase
        showFilter
        intl={{} as any}
        onFilterRemoved={onFilterRemoved}
        query={{ filter_by: { name: ['remove-me'] } }}
      />
    );

    await user.click(screen.getByRole('button', { name: /Clear all filters/i }));

    expect(onFilterRemoved).toHaveBeenCalledWith(null);
  });

  test('updates filters when query changes', () => {
    const { rerender } = render(
      <DataToolbarBase showFilter intl={{} as any} query={{ filter_by: { name: ['first'] } }} />
    );

    expect(screen.getByText('first')).toBeInTheDocument();

    rerender(<DataToolbarBase showFilter intl={{} as any} query={{ filter_by: { name: ['second'] } }} />);

    expect(screen.getByText('second')).toBeInTheDocument();
    expect(screen.queryByText('first')).not.toBeInTheDocument();
  });

  test('renders bulk select and export controls', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onBulkSelect = jest.fn();
    const onExportClicked = jest.fn();

    render(
      <DataToolbarBase
        showBulkSelect
        showExport
        showColumnManagement
        intl={{} as any}
        itemsTotal={10}
        onBulkSelect={onBulkSelect}
        onExportClicked={onExportClicked}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Export data' }));
    expect(onExportClicked).toHaveBeenCalled();

    await user.click(screen.getByRole('checkbox'));
    expect(onBulkSelect).toHaveBeenCalledWith('all');
  });

  test('changes criteria selection', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onFilterAdded = jest.fn();

    render(
      <DataToolbarBase
        categoryOptions={categoryOptions}
        showCriteria
        showFilter
        intl={{} as any}
        onFilterAdded={onFilterAdded}
      />
    );

    await user.click(screen.getByRole('button', { name: /includes/i }));
    const options = screen.getAllByRole('option');
    await user.click(options.find(option => option.textContent?.includes('exclude')) as HTMLElement);

    const input = screen.getByPlaceholderText(/name/i);
    await user.type(input, 'excluded{enter}');

    expect(onFilterAdded).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'excluded', excludeType: CriteriaType.exclude })
    );
  });

  test('switches category when multiple options exist', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<DataToolbarBase categoryOptions={categoryOptions} showFilter intl={{} as any} />);

    const categorySelect = screen.getByRole('button', { expanded: false });
    await user.click(categorySelect);
    await user.click(screen.getAllByRole('option')[1]);

    expect(screen.getByPlaceholderText(/project/i)).toBeInTheDocument();
  });
});

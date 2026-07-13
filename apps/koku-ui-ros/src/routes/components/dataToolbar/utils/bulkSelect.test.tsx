import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { getBulkSelect } from './bulkSelect';

describe('getBulkSelect', () => {
  test('renders bulk select and handles page selection', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onBulkSelectClicked = jest.fn();
    const onBulkSelectToggle = jest.fn();

    render(
      getBulkSelect({
        isBulkSelectOpen: true,
        itemsPerPage: 10,
        itemsTotal: 25,
        onBulkSelectClicked,
        onBulkSelectToggle,
        selectedItems: [{ id: '1' } as any],
      })
    );

    await user.click(screen.getByRole('menuitem', { name: /page/i }));
    expect(onBulkSelectClicked).toHaveBeenCalledWith('page');
  });

  test('handles checkbox select all', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onBulkSelectClicked = jest.fn();
    const onBulkSelectToggle = jest.fn();

    render(
      getBulkSelect({
        isBulkSelectOpen: false,
        itemsTotal: 5,
        onBulkSelectClicked,
        onBulkSelectToggle,
      })
    );

    await user.click(screen.getByRole('checkbox'));
    expect(onBulkSelectClicked).toHaveBeenCalledWith('all');
    expect(onBulkSelectToggle).toHaveBeenCalledWith(false);
  });

  test('wraps bulk select in tooltip when read only', () => {
    render(
      getBulkSelect({
        isReadOnly: true,
        itemsTotal: 5,
      })
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });
});

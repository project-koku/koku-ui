import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { ParentTagMappingEmptyState } from './parentTagMappingEmptyState';

describe('ParentTagMappingEmptyState', () => {
  test('invokes close and reset actions', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onClose = jest.fn();
    const onReset = jest.fn();
    render(<ParentTagMappingEmptyState onClose={onClose} onReset={onReset} />);

    await user.click(screen.getByRole('button', { name: /go back/i }));
    expect(onClose).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /create another/i }));
    expect(onReset).toHaveBeenCalled();
  });
});

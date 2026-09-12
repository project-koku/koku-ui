import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { buildNotification } from './buildNotification';

const intl = {
  formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
} as any;

describe('buildNotification', () => {
  test('returns the notification unchanged when there is no detail', () => {
    const notification = { title: 'Saved', description: 'All good', variant: 'success' };
    expect(buildNotification(notification, intl)).toEqual(notification);
  });

  test('wraps API detail in an expandable section and disables auto-dismiss', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const notification = buildNotification(
      { title: 'Failed', description: 'Could not save', detail: 'source already exists', variant: 'danger' },
      intl
    );

    expect(notification.autoDismiss).toBe(false);
    render(<div>{notification.description as React.ReactNode}</div>);
    expect(screen.getByText('Could not save')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /show details/i }));
    expect(screen.getByText('source already exists')).toBeInTheDocument();
  });
});

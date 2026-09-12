import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import Actions from './actions';

jest.mock('routes/settings/tagLabels/tagMapping/components/childTagMapping', () => ({
  ChildTagMapping: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <button type="button" onClick={onClose}>
        close-child
      </button>
    ) : null,
}));

jest.mock('routes/settings/tagLabels/tagMapping/components/deleteTagMapping', () => ({
  DeleteTagMapping: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <button type="button" onClick={onClose}>
        close-delete
      </button>
    ) : null,
}));

describe('Tag mapping Actions', () => {
  test('opens child mapping and delete menus', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onClose = jest.fn();
    render(<Actions canWrite item={{ uuid: 'p-1', key: 'env' } as any} onClose={onClose} />);

    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('menuitem', { name: /add child tags/i }));
    await user.click(screen.getByRole('button', { name: 'close-child' }));
    expect(onClose).toHaveBeenCalled();

    onClose.mockClear();
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByRole('menuitem', { name: /delete/i }));
    await user.click(screen.getByRole('button', { name: 'close-delete' }));
    expect(onClose).toHaveBeenCalled();
  });

  test('disables menu items when the user cannot write', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Actions canWrite={false} item={{ uuid: 'p-1', key: 'env' } as any} />);

    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('menuitem', { name: /add child tags/i })).toHaveAttribute('aria-disabled', 'true');
  });
});

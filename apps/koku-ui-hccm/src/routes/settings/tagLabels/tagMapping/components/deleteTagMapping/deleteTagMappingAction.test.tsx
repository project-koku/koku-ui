import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import DeleteTagMappingAction from './deleteTagMappingAction';

jest.mock('./deleteTagMapping', () => ({
  __esModule: true,
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <button type="button" onClick={onClose}>
        close-delete
      </button>
    ) : null,
}));

describe('DeleteTagMappingAction', () => {
  test('opens and closes the delete modal', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onClose = jest.fn();
    render(
      <Provider store={createStore(() => ({}))}>
        <DeleteTagMappingAction canWrite item={{ uuid: 'c-1', key: 'app' } as any} onClose={onClose} />
      </Provider>
    );

    await user.click(screen.getByRole('button', { name: /remove/i }));
    await user.click(screen.getByRole('button', { name: 'close-delete' }));
    expect(onClose).toHaveBeenCalled();
  });

  test('disables the action when the user cannot write', () => {
    render(<DeleteTagMappingAction canWrite={false} item={{ uuid: 'c-1', key: 'app' } as any} />);
    expect(screen.getByRole('button', { name: /remove/i })).toHaveAttribute('aria-disabled', 'true');
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { CustomSelect } from './customSelect';
import { getCustomSelect } from './utils/custom';

const intl = {
  formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
};

describe('CustomSelect', () => {
  test('selects a custom option', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSelect = jest.fn();
    render(
      <MemoryRouter>
        <CustomSelect
          intl={intl as any}
          onSelect={onSelect}
          options={[
            { name: 'deployment', key: 'deployment' },
            { name: 'daemonset', key: 'daemonset' },
          ]}
          filters={[{ value: 'deployment' }]}
        />
      </MemoryRouter>
    );
    await user.click(screen.getByRole('button'));
    await user.click(screen.getAllByRole('checkbox')[1]);
    expect(onSelect).toHaveBeenCalled();
  });

  test('getCustomSelect returns null without a category option', () => {
    expect(getCustomSelect({} as any)).toBeNull();
  });
});

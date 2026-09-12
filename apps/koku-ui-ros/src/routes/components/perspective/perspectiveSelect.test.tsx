import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import messages from 'locales/messages';

import { PerspectiveSelect } from './perspectiveSelect';

const intl = {
  formatMessage: ({ defaultMessage }: { defaultMessage: string }) => defaultMessage,
};

const options = [
  { label: messages.perspectiveValues, value: 'ocp' },
  { label: messages.perspectiveValues, value: 'aws' },
];

describe('PerspectiveSelect', () => {
  test('renders a single option as text', () => {
    render(
      <PerspectiveSelect
        intl={intl as any}
        currentItem="ocp"
        onSelect={jest.fn()}
        options={[{ label: messages.perspectiveValues, value: 'ocp' }]}
      />
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('selects a perspective from the dropdown', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSelect = jest.fn();
    render(<PerspectiveSelect intl={intl as any} currentItem="ocp" onSelect={onSelect} options={options} />);
    await user.click(screen.getByRole('button'));
    const option = screen.getAllByRole('option')[1];
    await user.click(option);
    expect(onSelect).toHaveBeenCalledWith('aws');
  });
});

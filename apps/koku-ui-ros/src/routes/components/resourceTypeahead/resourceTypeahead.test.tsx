import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ResourcePathsType, ResourceType } from 'api/resources/resource';

import ResourceTypeahead from './resourceTypeahead';

jest.mock('./resourceFetch', () => ({
  ResourceFetch: ({ onChange, onClear, onSelect, search }: any) => (
    <div>
      <span data-testid="search">{search || ''}</span>
      <button type="button" onClick={() => onChange({}, 'query')}>
        change
      </button>
      <button type="button" onClick={() => onSelect('selected')}>
        select
      </button>
      <button type="button" onClick={onClear}>
        clear
      </button>
    </div>
  ),
}));

describe('ResourceTypeahead', () => {
  test('updates search, selects a value, and clears', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSelect = jest.fn();
    render(
      <ResourceTypeahead
        resourcePathsType={ResourcePathsType.ocp}
        resourceType={ResourceType.project}
        onSelect={onSelect}
      />
    );

    await user.click(screen.getByRole('button', { name: 'change' }));
    expect(screen.getByTestId('search')).toHaveTextContent('query');

    await user.click(screen.getByRole('button', { name: 'select' }));
    expect(onSelect).toHaveBeenCalledWith('selected');
    expect(screen.getByTestId('search')).toHaveTextContent('');

    await user.click(screen.getByRole('button', { name: 'change' }));
    await user.click(screen.getByRole('button', { name: 'clear' }));
    expect(screen.getByTestId('search')).toHaveTextContent('');
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';

import { TagPathsType } from 'api/tags/tag';
import { FetchStatus } from 'store/common';
import { tagActions } from 'store/tags';

import { TagValue } from './tagValue';

const intl = {
  formatMessage: ({ defaultMessage, id }: { defaultMessage?: string; id?: string }) => defaultMessage ?? id ?? '',
};

const mockTagState = {
  report: { data: [] as any[] },
  status: FetchStatus.complete as FetchStatus,
};

jest.mock('store/tags', () => ({
  tagActions: {
    fetchTag: jest.fn(() => ({ type: 'TEST/FETCH_TAG' })),
  },
  tagSelectors: {
    selectTag: () => mockTagState.report,
    selectTagFetchStatus: () => mockTagState.status,
  },
}));

const renderTagValue = (props: Record<string, unknown> = {}) =>
  render(
    <Provider store={createStore(() => ({}))}>
      <MemoryRouter>
        <TagValue
          intl={intl as any}
          onTagValueSelect={jest.fn()}
          onTagValueInput={jest.fn()}
          onTagValueInputChange={jest.fn()}
          tagKey="env"
          tagKeyValue=""
          tagPathsType={TagPathsType.aws}
          {...props}
        />
      </MemoryRouter>
    </Provider>
  );

describe('TagValue', () => {
  beforeEach(() => {
    mockTagState.report = { data: [] };
    jest.clearAllMocks();
  });

  test('renders a search input when there are no tag values', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onTagValueInput = jest.fn();
    const onTagValueInputChange = jest.fn();

    renderTagValue({ onTagValueInput, onTagValueInputChange, tagKeyValue: 'prod' });

    expect(tagActions.fetchTag).toHaveBeenCalled();
    const input = screen.getByPlaceholderText(/filter by value/i);
    await user.clear(input);
    await user.type(input, 'stage');
    expect(onTagValueInputChange).toHaveBeenCalled();
    await user.type(input, '{enter}');
    expect(onTagValueInput).toHaveBeenCalled();
  });

  test('renders a select when tag values are available', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockTagState.report = {
      data: [{ key: 'env', values: ['prod', 'stage'] }],
    };
    const onTagValueSelect = jest.fn();

    renderTagValue({
      onTagValueSelect,
      selections: ['prod'] as any,
      tagKey: 'env',
    });

    await user.click(screen.getByRole('button', { name: /choose value/i }));
    expect(screen.getByText('prod')).toBeInTheDocument();
    await user.click(screen.getAllByRole('checkbox')[1]);
    expect(onTagValueSelect).toHaveBeenCalled();
  });

  test('refetches when the tag key changes', () => {
    const { rerender } = render(
      <Provider store={createStore(() => ({}))}>
        <MemoryRouter>
          <TagValue
            intl={intl as any}
            onTagValueSelect={jest.fn()}
            onTagValueInput={jest.fn()}
            onTagValueInputChange={jest.fn()}
            tagKey="env"
            tagKeyValue=""
            tagPathsType={TagPathsType.aws}
          />
        </MemoryRouter>
      </Provider>
    );

    rerender(
      <Provider store={createStore(() => ({}))}>
        <MemoryRouter>
          <TagValue
            intl={intl as any}
            onTagValueSelect={jest.fn()}
            onTagValueInput={jest.fn()}
            onTagValueInputChange={jest.fn()}
            startDate="2024-01-01"
            endDate="2024-01-31"
            tagKey="app"
            tagKeyValue=""
            tagPathsType={TagPathsType.ocp}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(tagActions.fetchTag).toHaveBeenCalled();
  });
});

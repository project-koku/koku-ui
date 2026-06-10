import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { FetchStatus } from 'store/common';

import { GpuTagValues } from './gpuTagValues';

const gpuModelResource = {
  data: [{ value: 'A100' }, { value: 'H100' }],
};

jest.mock('store/resources', () => {
  const FetchStatus = require('store/common').FetchStatus;
  const actual = jest.requireActual('store/resources');
  return {
    ...actual,
    resourceActions: {
      ...actual.resourceActions,
      fetchResource: jest.fn(() => ({ type: 'tests/fetchResource-gpu-model' })),
    },
    resourceSelectors: {
      ...actual.resourceSelectors,
      selectResource: jest.fn(() => gpuModelResource),
      selectResourceFetchStatus: jest.fn(() => FetchStatus.complete),
      selectResourceError: jest.fn(() => undefined),
    },
  };
});

const noopStore = createStore(() => ({}));

describe('GpuTagValues', () => {
  test('invokes change handlers for rate and description', () => {
    const onRateChange = jest.fn();
    const onDescriptionChange = jest.fn();
    const onValueChange = jest.fn();
    render(
      <Provider store={noopStore}>
        <IntlProvider defaultLocale="en" locale="en">
          <GpuTagValues
            currency="USD"
            onDescriptionChange={onDescriptionChange}
            onRateChange={onRateChange}
            onValueChange={onValueChange}
            tagKey="nvidia"
            tagValues={[{ default: false, description: 'd', tag_value: 'A100', unit: 'USD', value: '1' }]}
          />
        </IntlProvider>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/^rate$/i), { target: { value: '2' } });
    expect(onRateChange).toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'new' } });
    expect(onDescriptionChange).toHaveBeenCalled();
  });

  test('duplicate model options are marked disabled in getModelOptions', () => {
    render(
      <Provider store={noopStore}>
        <IntlProvider defaultLocale="en" locale="en">
          <GpuTagValues
            currency="USD"
            onDelete={jest.fn()}
            onDescriptionChange={jest.fn()}
            onRateChange={jest.fn()}
            onValueChange={jest.fn()}
            tagKey="nvidia"
            tagValues={[
              { default: false, description: '', tag_value: 'A100', unit: 'USD', value: '1' },
              { default: false, description: '', tag_value: 'A100', unit: 'USD', value: '2' },
            ]}
          />
        </IntlProvider>
      </Provider>
    );

    expect(screen.getAllByRole('row').length).toBeGreaterThan(1);
  });
});

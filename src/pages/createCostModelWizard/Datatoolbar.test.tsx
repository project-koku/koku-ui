import { fireEvent, render } from '@testing-library/react';
import { createModel } from '@xstate/test';
import React from 'react';
import { PriceListToolbar, toolbarMachine } from './Datatoolbar';

describe('price list toolbar base', () => {
  const onUpdateSelection = jest.fn();
  const machine = toolbarMachine(onUpdateSelection);

  const model = createModel(machine).withEvents({
    TOGGLE_METRICS: {
      exec: ({ getByText }) => {
        fireEvent.click(getByText('Metric'));
      },
    },
    TOGGLE_MEASUREMENTS: {
      exec: ({ getByText }) => {
        fireEvent.click(getByText('Measurement'));
      },
    },
    SELECT_METRICS: {
      exec: ({ getByText }) => {
        fireEvent.click(getByText('Memory'));
      },
    },
    SELECT_MEASUREMENTS: {
      exec: ({ getByText }) => {
        fireEvent.click(getByText('Request'));
      },
    },
  });

  const plans = model.getSimplePathPlans();
  plans.forEach(plan => {
    describe(plan.description, () => {
      plan.paths.forEach(path => {
        it(path.description, () => {
          path.test(
            render(
              <PriceListToolbar
                metricProps={{
                  options: [
                    { label: 'CPU', value: 'CPU' },
                    { label: 'Memory', value: 'Memory' },
                    { label: 'Storage', value: 'Storage' },
                  ],
                  selection: [],
                  placeholder: 'Metric',
                }}
                measurementProps={{
                  options: [
                    { label: 'Request', value: 'Request' },
                    { label: 'Usage', value: 'Usage' },
                    { label: 'Currency', value: 'Currency' },
                  ],
                  selection: [],
                  placeholder: 'Measurement',
                }}
                actionButtonText="Add rate"
                onSelect={jest.fn()}
                onClick={jest.fn()}
                pagination={{
                  isCompact: true,
                  itemCount: 10,
                  perPage: 10,
                  page: 1,
                  onSetPage: jest.fn(),
                  onPerPageSelect: jest.fn(),
                  perPageOptions: [
                    { title: '2', value: 2 },
                    { title: '4', value: 4 },
                    { title: '6', value: 6 },
                  ],
                }}
                filters={{}}
                onClear={jest.fn()}
                onRemoveFilter={jest.fn()}
              />
            )
          );
        });
      });
    });
  });
});

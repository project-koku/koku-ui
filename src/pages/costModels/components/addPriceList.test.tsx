import { fireEvent, render } from '@testing-library/react';
import { createModel } from '@xstate/test';
import React from 'react';
import { AddPriceListBase, addRateMachine } from './addPriceList';

const addRateMachineModel = createModel(addRateMachine).withEvents({
  CHANGE_METRIC: {
    exec: ({ queryAllByLabelText }) => {
      const selectors = queryAllByLabelText(
        'cost_models.add_rate_form.metric_select'
      );
      fireEvent.change(selectors[0], { target: { value: 'CPU' } });
    },
  },
  CHANGE_MEASUREMENT: {
    exec: ({ queryAllByLabelText }) => {
      const selectors = queryAllByLabelText(
        'cost_models.add_rate_form.measurement_select'
      );
      fireEvent.change(selectors[0], { target: { value: 'Request' } });
    },
  },
  CHANGE_RATE: {
    exec: ({ queryAllByLabelText }) => {
      const inputs = queryAllByLabelText(
        'cost_models.add_rate_form.rate_input'
      );
      fireEvent.change(inputs[0], { target: { value: '3' } });
    },
  },
  CHANGE_INFRA_COST: {
    exec: ({ queryAllByLabelText }) => {
      const inputs = queryAllByLabelText('cost_models.add_rate_form.cost_type');
      fireEvent.change(inputs[0], { target: { value: 'infra' } });
    },
  },
});

describe('add rate machine', () => {
  const hash = {
    CPU: {
      Request: {
        source_type: 'OpenShift Container Platform',
        metric: 'cpu_core_request_per_hour',
        label_metric: 'CPU',
        label_measurement: 'Request',
        label_measurement_unit: 'core-hours',
      },
    },
  };

  const testPlans = addRateMachineModel.getSimplePathPlans();
  testPlans.forEach((p, ix) => {
    p.paths.forEach(pz => {
      it(`test #${ix}: ${p.description} - ${pz.description}`, () => {
        pz.test(
          render(
            <AddPriceListBase
              t={v => v}
              submitRate={jest.fn()}
              cancel={jest.fn()}
              items={[]}
              metricsHash={hash}
              costTypes={['infra', 'suppl']}
            />
          )
        );
      });
    });
  });
});

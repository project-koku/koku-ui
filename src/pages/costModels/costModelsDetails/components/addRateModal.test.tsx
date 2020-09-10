import { fireEvent, render } from '@testing-library/react';
import { createModel } from '@xstate/test';
import { CostModel } from 'api/costModels';
import { addRateMachine } from 'pages/costModels/components/addPriceList';
import React from 'react';

import { AddRateModelBase } from './addRateModal';

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

  const current: CostModel = {
    created_timestamp: new Date(),
    description: 'this is my cost model description',
    markup: { unit: 'percentage', value: '0' },
    name: 'cost-model-test',
    sources: [],
    rates: [],
    source_type: 'Openshift Container Platform',
    updated_timestamp: new Date(),
    uuid: '123348728612763762',
  };

  const testPlans = addRateMachineModel.getSimplePathPlans();
  testPlans.forEach((p, ix) => {
    p.paths.forEach(pz => {
      it(`test #${ix}: ${p.description} - ${pz.description}`, () => {
        pz.test(
          render(
            <AddRateModelBase
              costTypes={['infra', 'suppl']}
              current={current}
              t={v => v}
              updateError={null}
              onProceed={jest.fn()}
              onClose={jest.fn()}
              metricsHash={hash}
            />
          )
        );
      });
    });
  });
});

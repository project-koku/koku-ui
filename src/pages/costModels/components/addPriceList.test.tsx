import { fireEvent, render } from '@testing-library/react';
import { Rate } from 'api/rates';
import { CostModelContext, defaultCostModelContext } from 'pages/costModels/createCostModelWizard/context';
import React from 'react';

import AddPriceList from './addPriceList';

const metricsHash = {
  CPU: {
    Request: {
      source_type: 'Openshift Container Platform',
      metric: 'cpu_core_request_per_hour',
      label_metric: 'CPU',
      label_measurement: 'Request',
      label_measurement_unit: 'core-hours',
      default_cost_type: 'Infrastructure',
    },
    Usage: {
      source_type: 'Openshift Container Platform',
      metric: 'cpu_core_usage_per_hour',
      label_metric: 'CPU',
      label_measurement: 'Usage',
      label_measurement_unit: 'core-hours',
      default_cost_type: 'Infrastructure',
    },
  },
  Memory: {
    Request: {
      source_type: 'Openshift Container Platform',
      metric: 'memory_gb_request_per_hour',
      label_metric: 'Memory',
      label_measurement: 'Request',
      label_measurement_unit: 'GB-hours',
      default_cost_type: 'Supplementary',
    },
    Usage: {
      source_type: 'Openshift Container Platform',
      metric: 'memory_gb_usage_per_hour',
      label_metric: 'Memory',
      label_measurement: 'Usage',
      label_measurement_unit: 'GB-hours',
      default_cost_type: 'Supplementary',
    },
  },
  Cluster: {
    Currency: {
      source_type: 'Openshift Container Platform',
      metric: 'cluster_cost_per_month',
      label_metric: 'Cluster',
      label_measurement: 'Currency',
      label_measurement_unit: 'pvc-months',
      default_cost_type: 'Infrastructure',
    },
  },
};

const qr = {
  metric: '#metric',
  measurement: '#measurement',
  description: '#description',
  infraradio: /infrastructure/i,
  supplradio: /supplementary/i,
  regular: '#regular-rate',
  regularError: '#regular-rate-helper',
  submit: 'cost_models_wizard.price_list.create_rate',
  cancel: 'cost_models_wizard.price_list.cancel',
  switch: 'Enter rate by tag',
  tagKey: '#tag-key',
  descriptionNth: (id: number) => `#desc_${id}`,
  defaultNth: (id: number) => `#isDefault_${id}`,
  tagValueNth: (id: number) => `#tagValue_${id}`,
  rateNth: (id: number) => `#rate_${id}`,
};

function RenderFormDataUI({ cancel, submit }) {
  const memoryRate = {
    metric: {
      name: 'memory_gb_usage_per_hour',
      label_metric: 'Memory',
      label_measurement: 'Request',
      label_measurement_unit: 'GB-hours',
    },
    description: '',
    tag_rates: {
      tag_key: 'app',
      tag_values: [
        {
          unit: 'USD',
          value: 1,
          default: false,
          tag_value: 'app1',
          description: '',
        },
        {
          unit: 'USD',
          value: 2.31,
          default: false,
          tag_value: 'app2',
          description: '',
        },
      ],
    },
    cost_type: 'Supplementary',
  };
  return (
    <CostModelContext.Provider value={{ ...defaultCostModelContext, tiers: [memoryRate] as Rate[] }}>
      <AddPriceList metricsHash={metricsHash} submitRate={submit} cancel={cancel} />
    </CostModelContext.Provider>
  );
}

describe('add-a-new-rate', () => {
  test('regular rate', () => {
    const submit = jest.fn();
    const cancel = jest.fn();
    const { container, getByLabelText, getByText } = render(<RenderFormDataUI submit={submit} cancel={cancel} />);
    fireEvent.change(container.querySelector(qr.description), { target: { value: 'regular rate test' } });
    fireEvent.change(container.querySelector(qr.metric), { target: { value: 'CPU' } });
    fireEvent.change(container.querySelector(qr.measurement), { target: { value: 'Usage' } });

    // make sure the default cost type is selected
    expect(getByLabelText(qr.infraradio).checked).toBeTruthy();

    // selecting a different measurement does not reset cost type to default
    fireEvent.click(getByLabelText(qr.supplradio));
    fireEvent.change(container.querySelector(qr.measurement), { target: { value: 'Request' } });
    expect(getByLabelText(qr.supplradio).checked).toBeTruthy();

    // selecting metric will reset both measurement and cost type
    fireEvent.click(getByLabelText(qr.infraradio));
    fireEvent.change(container.querySelector(qr.metric), { target: { value: 'Memory' } });
    expect(getByText('cost_models.add_rate_form.required')).toBeTruthy();
    fireEvent.change(container.querySelector(qr.measurement), { target: { value: 'Request' } });
    expect(getByLabelText(qr.supplradio).checked).toBeTruthy();
    fireEvent.click(getByLabelText(qr.infraradio));

    // setting rate to anything but a number
    fireEvent.change(container.querySelector(qr.regular), { target: { value: 'A' } });
    expect(getByText('cost_models.add_rate_form.not_number')).toBeTruthy();

    // setting rate to a negative number - validation is done on blur
    fireEvent.change(container.querySelector(qr.regular), { target: { value: '-12' } });
    fireEvent.blur(container.querySelector(qr.regular));
    expect(getByText('cost_models.add_rate_form.not_positive')).toBeTruthy();

    // setting rate to a valid number
    fireEvent.change(container.querySelector(qr.regular), { target: { value: '0.2' } });

    // making sure button is enabled
    expect(getByText(/cost_models_wizard.price_list.create_rate/i).closest('button').disabled).toBeFalsy();
    fireEvent.click(getByText(qr.submit));
    expect(submit).toHaveBeenCalled();
  });
  test('tag rates', () => {
    const submit = jest.fn();
    const cancel = jest.fn();
    const { container, queryByText, getByLabelText, getByText, getByTestId } = render(
      <RenderFormDataUI submit={submit} cancel={cancel} />
    );
    fireEvent.change(container.querySelector(qr.description), { target: { value: 'tag rate test' } });
    fireEvent.change(container.querySelector(qr.metric), { target: { value: 'CPU' } });
    fireEvent.change(container.querySelector(qr.measurement), { target: { value: 'Request' } });
    fireEvent.change(container.querySelector(qr.measurement), { target: { value: 'Request' } });
    fireEvent.click(getByLabelText(qr.switch));

    // tag key is required validation
    fireEvent.change(container.querySelector(qr.tagKey), { target: { value: 'test' } });
    fireEvent.change(container.querySelector(qr.tagKey), { target: { value: '' } });
    expect(getByText('cost_models.add_rate_form.required')).toBeTruthy();
    fireEvent.change(container.querySelector(qr.tagKey), { target: { value: 'openshift' } });
    expect(queryByText('cost_models.add_rate_form.required')).toBeFalsy();

    // tag value is required validation
    fireEvent.change(container.querySelector(qr.tagValueNth(0)), { target: { value: 'test' } });
    fireEvent.change(container.querySelector(qr.tagValueNth(0)), { target: { value: '' } });
    expect(getByText('cost_models.add_rate_form.required')).toBeTruthy();
    fireEvent.change(container.querySelector(qr.tagValueNth(0)), { target: { value: 'worker' } });
    expect(queryByText('cost_models.add_rate_form.required')).toBeFalsy();

    // rate must be a number
    fireEvent.change(container.querySelector(qr.rateNth(0)), { target: { value: 'test' } });
    expect(getByText('cost_models.add_rate_form.not_number')).toBeTruthy();

    // rate is required
    fireEvent.change(container.querySelector(qr.rateNth(0)), { target: { value: '' } });
    expect(getByText('cost_models.add_rate_form.required')).toBeTruthy();

    // rate must be positive
    fireEvent.change(container.querySelector(qr.rateNth(0)), { target: { value: '0' } });
    fireEvent.blur(container.querySelector(qr.rateNth(0)));
    expect(getByText('cost_models.add_rate_form.not_positive')).toBeTruthy();

    // setting a valid rate - now form is valid and can be submitted
    expect(getByText(/create_rate/i).closest('button').disabled).toBeTruthy();
    fireEvent.change(container.querySelector(qr.rateNth(0)), { target: { value: '0.2' } });
    fireEvent.change(container.querySelector(qr.descriptionNth(0)), { target: { value: 'default worker' } });
    expect(getByText(/create_rate/i).closest('button').disabled).toBeFalsy();

    // set tag to default
    fireEvent.click(container.querySelector(qr.defaultNth(0)));

    // add a new rate disables the submit button
    fireEvent.click(getByTestId('add_more'));
    expect(getByText(/create_rate/i).closest('button').disabled).toBeTruthy();
    fireEvent.click(getByTestId('remove_tag_1'));
    expect(getByText(/create_rate/i).closest('button').disabled).toBeFalsy();
    fireEvent.click(getByText(qr.submit));
    expect(submit).toHaveBeenCalled();
  });
  test('tag rates duplicate tag key', () => {
    const submit = jest.fn();
    const cancel = jest.fn();
    const { container, queryByText, getByLabelText } = render(<RenderFormDataUI submit={submit} cancel={cancel} />);
    fireEvent.change(container.querySelector(qr.metric), { target: { value: 'Memory' } });
    fireEvent.change(container.querySelector(qr.measurement), { target: { value: 'Request' } });
    fireEvent.click(getByLabelText(qr.switch));

    // tag key is duplicated
    fireEvent.change(container.querySelector(qr.tagKey), { target: { value: 'app' } });
    expect(queryByText('cost_models.add_rate_form.duplicate')).toBeTruthy();

    fireEvent.change(container.querySelector(qr.tagKey), { target: { value: 'app1' } });
    expect(queryByText('cost_models.add_rate_form.duplicate')).toBeFalsy();

    // change measurement will set tag key as not duplicate
    fireEvent.change(container.querySelector(qr.tagKey), { target: { value: 'app' } });
    expect(queryByText('cost_models.add_rate_form.duplicate')).toBeTruthy();
    fireEvent.change(container.querySelector(qr.measurement), { target: { value: 'Usage' } });
    expect(queryByText('cost_models.add_rate_form.duplicate')).toBeFalsy();

    fireEvent.change(container.querySelector(qr.measurement), { target: { value: 'Request' } });
    expect(queryByText('cost_models.add_rate_form.duplicate')).toBeTruthy();
  });
  test('hide "enter tag rates" switch on Cluster metric', () => {
    const submit = jest.fn();
    const cancel = jest.fn();
    const { container, queryAllByLabelText } = render(<RenderFormDataUI submit={submit} cancel={cancel} />);
    fireEvent.change(container.querySelector(qr.metric), { target: { value: 'Cluster' } });
    fireEvent.change(container.querySelector(qr.measurement), { target: { value: 'Currency' } });
    expect(queryAllByLabelText(qr.switch)).toHaveLength(0);
  });
});

import { configure, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Rate } from 'api/rates';
import messages from 'locales/messages';
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
  metric: '[data-ouia-component-id="metric"] button',
  measurement: '[data-ouia-component-id="measurement"] button',
  description: '#description',
  infraradio: /infrastructure/i,
  supplradio: /supplementary/i,
  regular: '#regular-rate',
  regularError: '#regular-rate-helper',
  switch: 'Enter rate by tag',
  tagKeyPlaceHolder: 'Enter a tag key',
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

function regExp(msg) {
  return new RegExp(msg.defaultMessage);
}

// Update testId accessor since data-testid is not passed to the parent component of Select
configure({ testIdAttribute: 'data-ouia-component-id' });

describe('add-a-new-rate', () => {
  test('regular rate', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const submit = jest.fn();
    const cancel = jest.fn();
    let options = null;
    render(<RenderFormDataUI submit={submit} cancel={cancel} />);

    await user.type(screen.getByLabelText('Description'), 'regular rate test');

    // select first option for metric
    await user.click(screen.getByLabelText('Select Metric'));
    options = await screen.findAllByRole('option');
    await user.click(options[0]);

    // select first option for measurement
    await user.click(screen.getByLabelText('Select Measurement'));
    options = await screen.findAllByRole('option');
    await user.click(options[0]);

    // make sure the default cost type is selected
    expect(screen.getByLabelText(qr.infraradio)).toHaveProperty('checked', true);

    // selecting a different measurement does not reset cost type to default
    await user.click(screen.getByLabelText(qr.supplradio));

    await user.click(screen.getByLabelText('Select Measurement'));
    options = await screen.findAllByRole('option');
    await user.click(options[1]);

    expect(screen.getByLabelText(qr.supplradio)).toHaveProperty('checked', true);

    // selecting metric will reset both measurement and cost type
    await user.click(screen.getByLabelText(qr.infraradio));

    await user.click(screen.getByLabelText('Select Metric'));
    options = await screen.findAllByRole('option');
    await user.click(options[1]);

    expect(screen.getByText(regExp(messages.costModelsRequiredField))).not.toBeNull();

    await user.click(screen.getByLabelText('Select Measurement'));
    options = await screen.findAllByRole('option');
    await user.click(options[0]);

    expect(screen.getByLabelText(qr.supplradio)).toHaveProperty('checked', true);
    await user.click(screen.getByLabelText(qr.infraradio));

    const rateInput = screen.getByLabelText('Assign rate');

    // setting rate to anything but a number
    expect(screen.queryByText(regExp(messages.priceListNumberRate))).toBeNull();
    await user.type(rateInput, 'A');
    expect(screen.getByText(regExp(messages.priceListNumberRate))).not.toBeNull();

    // setting rate to a negative number - validation is done on blur
    await user.clear(rateInput);
    await user.type(rateInput, '-12');
    expect(screen.getByText(regExp(messages.priceListPosNumberRate))).not.toBeNull();

    // setting rate to a valid number
    await user.clear(rateInput);
    await user.type(rateInput, '0.2');
    expect(screen.queryByText(regExp(messages.priceListNumberRate))).toBeNull();

    // making sure button is enabled
    const createButton = screen.getByText(regExp(messages.createRate));
    expect(createButton.getAttribute('aria-disabled')).toBe('false');
    await user.click(createButton);
    expect(submit).toHaveBeenCalled();
  });

  test('tag rates', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const submit = jest.fn();
    const cancel = jest.fn();
    let options = null;
    render(<RenderFormDataUI submit={submit} cancel={cancel} />);

    await user.type(screen.getByLabelText('Description'), 'tag rate test');

    await user.click(screen.getByLabelText('Select Metric'));
    options = await screen.findAllByRole('option');
    await user.click(options[0]);

    await user.click(screen.getByLabelText('Select Measurement'));
    options = await screen.findAllByRole('option');
    await user.click(options[0]);

    await user.click(screen.getByLabelText(regExp(messages.costModelsEnterTagRate)));

    // tag key is required validation
    const tagKeyInput = screen.getByPlaceholderText(qr.tagKeyPlaceHolder);
    await user.type(tagKeyInput, 'test');
    expect(screen.queryByText(regExp(messages.costModelsRequiredField))).toBeNull();
    await user.clear(tagKeyInput);
    expect(screen.getByText(regExp(messages.costModelsRequiredField))).not.toBeNull();
    await user.type(tagKeyInput, 'openshift');
    expect(screen.queryByText(regExp(messages.costModelsRequiredField))).toBeNull();

    // tag value is required validation
    const tagValueInput = screen.getByPlaceholderText('Enter a tag value');
    await user.type(tagValueInput, 'test');
    expect(screen.queryByText(regExp(messages.costModelsRequiredField))).toBeNull();
    await user.clear(tagValueInput);
    expect(screen.getByText(regExp(messages.costModelsRequiredField))).not.toBeNull();
    await user.type(tagValueInput, 'openshift');
    expect(screen.queryByText(regExp(messages.costModelsRequiredField))).toBeNull();

    // rate must be a number
    const tagRateInput = screen.getByLabelText('Assign rate');
    await user.type(tagRateInput, 'test');
    expect(screen.getByText(regExp(messages.priceListNumberRate))).not.toBeNull();

    // rate is required
    await user.clear(tagRateInput);
    expect(screen.getByText(regExp(messages.costModelsRequiredField))).not.toBeNull();

    // rate must be positive
    await user.type(tagRateInput, '-0.23');
    expect(screen.getByText(regExp(messages.priceListPosNumberRate))).not.toBeNull();

    // setting a valid rate - now form is valid and can be submitted
    const createButton = screen.getByText(regExp(messages.createRate));
    expect(createButton.getAttribute('aria-disabled')).toBe('true');
    await user.clear(tagRateInput);

    await user.type(tagRateInput, '0.23');
    await user.type(screen.getByPlaceholderText('Enter a tag description'), 'default worker');
    expect(createButton.getAttribute('aria-disabled')).toBe('false');

    // set tag to default
    await user.click(screen.getByLabelText('Default'));

    // add a new rate disables the submit button
    await user.click(screen.getByText(/add more tag values/i));
    expect(createButton.getAttribute('aria-disabled')).toBe('true');

    await user.click(screen.getAllByRole('button', { name: /remove tag value/i })[1]);
    expect(createButton.getAttribute('aria-disabled')).toBe('false');
    await user.click(createButton);
    expect(submit).toHaveBeenCalled();
  });

  test('tag rates duplicate tag key', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const submit = jest.fn();
    const cancel = jest.fn();
    let options = null;
    render(<RenderFormDataUI submit={submit} cancel={cancel} />);

    await user.click(screen.getByLabelText('Select Metric'));
    options = await screen.findAllByRole('option');
    await user.click(options[1]);

    const measurementSelect = await screen.findByLabelText('Select Measurement');
    await user.click(measurementSelect);
    options = await screen.findAllByRole('option');
    await user.click(options[0]);

    await user.click(screen.getByLabelText(regExp(messages.costModelsEnterTagRate)));

    // tag key is duplicated
    const tagKeyInput = screen.getByPlaceholderText(qr.tagKeyPlaceHolder);
    await user.type(tagKeyInput, 'app');
    expect(screen.getByText(regExp(messages.priceListDuplicate))).not.toBeNull();

    await user.type(tagKeyInput, '1');
    expect(screen.queryByText(regExp(messages.priceListDuplicate))).toBeNull();

    // change measurement will set tag key as not duplicate
    await user.type(tagKeyInput, '{backspace}');
    expect(screen.getByText(regExp(messages.priceListDuplicate))).not.toBeNull();

    await user.click(measurementSelect);
    options = await screen.findAllByRole('option');
    await user.click(options[1]);

    expect(screen.queryByText(regExp(messages.priceListDuplicate))).toBeNull();

    await user.click(screen.getByLabelText('Select Measurement'));
    options = await screen.findAllByRole('option');
    await user.click(options[0]);

    expect(screen.getByText(regExp(messages.priceListDuplicate))).not.toBeNull();
  });

  test('hide "enter tag rates" switch on Cluster metric', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const submit = jest.fn();
    const cancel = jest.fn();
    let options = null;
    render(<RenderFormDataUI submit={submit} cancel={cancel} />);

    await user.click(screen.getByLabelText('Select Metric'));
    options = await screen.findAllByRole('option');
    await user.click(options[2]);

    await user.click(screen.getByLabelText('Select Measurement'));
    options = await screen.findAllByRole('option');
    await user.click(options[0]);
    expect(screen.queryAllByLabelText(regExp(messages.costModelsEnterTagRate))).toHaveLength(0);
  });
});

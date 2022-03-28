import { fireEvent, render, waitFor } from '@testing-library/react';
import { Rate } from 'api/rates';
import messages from 'locales/messages';
import { CostModelContext, defaultCostModelContext } from 'pages/costModels/createCostModelWizard/context';
import userEvent from '@testing-library/user-event';
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
  metric: '.pf-l-grid .pf-l-grid__item:first-child .pf-c-select__toggle',
  measurement: '.pf-l-grid .pf-l-grid__item:last-child .pf-c-select__toggle',
  description: '#description',
  infraradio: /infrastructure/i,
  supplradio: /supplementary/i,
  regular: '#regular-rate',
  regularError: '#regular-rate-helper',
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

function regExp(msg) {
  return new RegExp(msg.defaultMessage);
}

describe('add-a-new-rate', () => {
  test('regular rate', async () => {
    const submit = jest.fn();
    const cancel = jest.fn();
    const { container, getByLabelText, getByText, getByRole, getAllByRole } = render(<RenderFormDataUI submit={submit} cancel={cancel} />);

    fireEvent.change(container.querySelector(qr.description), { target: { value: 'regular rate test' } });

    //select first option for metric
    await waitFor(() => {
      userEvent.click(getAllByRole('button')[0]);
    });
    expect(getAllByRole('option').length).toBe(3);
    userEvent.click(getAllByRole('option')[0]);

    //select first option for measurement
    await waitFor(() => {
      userEvent.click(getAllByRole('button')[1]);
    });
    expect(getAllByRole('option').length).toBe(2);
    userEvent.click(getAllByRole('option')[0]);

    // make sure the default cost type is selected
    expect(getByLabelText(qr.infraradio).checked).toBeTruthy();

    // selecting a different measurement does not reset cost type to default
    fireEvent.click(getByLabelText(qr.supplradio));
    await waitFor(() => {
      userEvent.click(getAllByRole('button')[1]);
    });
    userEvent.click(getAllByRole('option')[1]);
    expect(getByLabelText(qr.supplradio).checked).toBeTruthy();

    // selecting metric will reset both measurement and cost type
    fireEvent.click(getByLabelText(qr.infraradio));
    await waitFor(() => {
      userEvent.click(getAllByRole('button')[0]);
    });
    userEvent.click(getAllByRole('option')[1]);
    expect(getByText(regExp(messages.CostModelsRequiredField))).toBeTruthy();
    await waitFor(() => {
      userEvent.click(getAllByRole('button')[1]);
    });
    userEvent.click(getAllByRole('option')[0]);
    expect(getByLabelText(qr.supplradio).checked).toBeTruthy();
    fireEvent.click(getByLabelText(qr.infraradio));

    // setting rate to anything but a number
    fireEvent.change(container.querySelector(qr.regular), { target: { value: 'A' } });
    expect(getByText(regExp(messages.PriceListNumberRate))).toBeTruthy();

    // setting rate to a negative number - validation is done on blur
    fireEvent.change(container.querySelector(qr.regular), { target: { value: '-12' } });
    fireEvent.blur(container.querySelector(qr.regular));
    expect(getByText(regExp(messages.PriceListPosNumberRate))).toBeTruthy();

    // setting rate to a valid number
    fireEvent.change(container.querySelector(qr.regular), { target: { value: '0.2' } });

    // making sure button is enabled
    expect(getByText(regExp(messages.CreateRate)).closest('button').disabled).toBeFalsy();
    fireEvent.click(getByText(regExp(messages.CreateRate)).closest('button'));
    expect(submit).toHaveBeenCalled();
  });

  test('tag rates', async () => {
    const submit = jest.fn();
    const cancel = jest.fn();
    const { container, queryByText, getByLabelText, getByText, getByTestId, getAllByRole } = render(
      <RenderFormDataUI submit={submit} cancel={cancel} />
    );
    fireEvent.change(container.querySelector(qr.description), { target: { value: 'tag rate test' } });

    await waitFor(() => {
      userEvent.click(getAllByRole('button')[0]);
    });
    userEvent.click(getAllByRole('option')[0]);

    await waitFor(() => {
      userEvent.click(getAllByRole('button')[1]);
    });
    userEvent.click(getAllByRole('option')[0]);
    fireEvent.click(getByLabelText(regExp(messages.CostModelsEnterTagRate)));

    // tag key is required validation
    fireEvent.change(container.querySelector(qr.tagKey), { target: { value: 'test' } });
    fireEvent.change(container.querySelector(qr.tagKey), { target: { value: '' } });
    expect(getByText(regExp(messages.CostModelsRequiredField))).toBeTruthy();
    fireEvent.change(container.querySelector(qr.tagKey), { target: { value: 'openshift' } });
    expect(queryByText(regExp(messages.CostModelsRequiredField))).toBeFalsy();

    // tag value is required validation
    fireEvent.change(container.querySelector(qr.tagValueNth(0)), { target: { value: 'test' } });
    fireEvent.change(container.querySelector(qr.tagValueNth(0)), { target: { value: '' } });
    expect(getByText(regExp(messages.CostModelsRequiredField))).toBeTruthy();
    fireEvent.change(container.querySelector(qr.tagValueNth(0)), { target: { value: 'worker' } });
    expect(queryByText(regExp(messages.CostModelsRequiredField))).toBeFalsy();

    // rate must be a number
    fireEvent.change(container.querySelector(qr.rateNth(0)), { target: { value: 'test' } });
    expect(getByText(regExp(messages.PriceListNumberRate))).toBeTruthy();

    // rate is required
    fireEvent.change(container.querySelector(qr.rateNth(0)), { target: { value: '' } });
    expect(getByText(regExp(messages.CostModelsRequiredField))).toBeTruthy();

    // rate must be positive
    fireEvent.change(container.querySelector(qr.rateNth(0)), { target: { value: '-0.23' } });
    fireEvent.blur(container.querySelector(qr.rateNth(0)));
    expect(getByText(regExp(messages.PriceListPosNumberRate))).toBeTruthy();

    // setting a valid rate - now form is valid and can be submitted
    expect(getByText(regExp(messages.CreateRate)).closest('button').disabled).toBeTruthy();
    fireEvent.change(container.querySelector(qr.rateNth(0)), { target: { value: '0.23' } });
    fireEvent.change(container.querySelector(qr.descriptionNth(0)), { target: { value: 'default worker' } });
    expect(getByText(regExp(messages.CreateRate)).closest('button').disabled).toBeFalsy();

    // set tag to default
    fireEvent.click(container.querySelector(qr.defaultNth(0)));

    // add a new rate disables the submit button
    fireEvent.click(getByTestId('add_more'));
    expect(getByText(regExp(messages.CreateRate)).closest('button').disabled).toBeTruthy();
    fireEvent.click(getByTestId('remove_tag_1'));
    expect(getByText(regExp(messages.CreateRate)).closest('button').disabled).toBeFalsy();
    fireEvent.click(getByText(regExp(messages.CreateRate)).closest('button'));
    expect(submit).toHaveBeenCalled();
  });

  test('tag rates duplicate tag key', async () => {
    const submit = jest.fn();
    const cancel = jest.fn();
    const { container, queryByText, getByLabelText, getAllByRole } = render(<RenderFormDataUI submit={submit} cancel={cancel} />);

    await waitFor(() => {
      userEvent.click(getAllByRole('button')[0]);
    });
    userEvent.click(getAllByRole('option')[1]);

    await waitFor(() => {
      userEvent.click(getAllByRole('button')[1]);
    });
    userEvent.click(getAllByRole('option')[0]);
    fireEvent.click(getByLabelText(regExp(messages.CostModelsEnterTagRate)));

    // tag key is duplicated
    fireEvent.change(container.querySelector(qr.tagKey), { target: { value: 'app' } });
    expect(queryByText(regExp(messages.PriceListDuplicate))).toBeTruthy();

    fireEvent.change(container.querySelector(qr.tagKey), { target: { value: 'app1' } });
    expect(queryByText(regExp(messages.PriceListDuplicate))).toBeFalsy();

    // change measurement will set tag key as not duplicate
    fireEvent.change(container.querySelector(qr.tagKey), { target: { value: 'app' } });
    expect(queryByText(regExp(messages.PriceListDuplicate))).toBeTruthy();

    await waitFor(() => {
      userEvent.click(getAllByRole('button')[1]);
    });
    userEvent.click(getAllByRole('option')[1]);
    expect(queryByText(regExp(messages.PriceListDuplicate))).toBeFalsy();

    await waitFor(() => {
      userEvent.click(getAllByRole('button')[1]);
    });
    userEvent.click(getAllByRole('option')[0]);
    expect(queryByText(regExp(messages.PriceListDuplicate))).toBeTruthy();
  });

  test('hide "enter tag rates" switch on Cluster metric', () => {
    const submit = jest.fn();
    const cancel = jest.fn();
    const { container, queryAllByLabelText } = render(<RenderFormDataUI submit={submit} cancel={cancel} />);
    fireEvent.change(container.querySelector(qr.metric), { target: { value: 'Cluster' } });
    fireEvent.change(container.querySelector(qr.measurement), { target: { value: 'Currency' } });
    expect(queryAllByLabelText(regExp(messages.CostModelsEnterTagRate))).toHaveLength(0);
  });
});

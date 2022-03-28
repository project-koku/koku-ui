jest.mock('api/costModels');
import { fireEvent, render, waitFor } from '@testing-library/react';
import { updateCostModel } from 'api/costModels';
import messages from 'locales/messages';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from 'store/rootReducer';
import userEvent from '@testing-library/user-event';

const mockupdater = updateCostModel as jest.Mock;
mockupdater.mockReturnValue(Promise.resolve({ data: [] }));

import UpdateRateModal from './updateRateModel';

const initial = {
  costModels: {
    costModels: {
      meta: {
        count: 3,
      },
      links: {
        first: '/api/cost-management/v1/cost-models/?limit=10&offset=0',
        next: null,
        previous: null,
        last: '/api/cost-management/v1/cost-models/?limit=10&offset=0',
      },
      data: [
        {
          uuid: 'f4f08cd6-0450-40e5-9c27-2636f2db3aac',
          name: 'test cost model',
          description: '',
          source_type: 'OpenShift Container Platform',
          created_timestamp: '2020-09-13T20:42:18.200954Z',
          updated_timestamp: '2020-09-14T08:34:24.649183Z',
          rates: [
            {
              metric: {
                name: 'cpu_core_usage_per_hour',
                label_metric: 'CPU',
                label_measurement: 'Usage',
                label_measurement_unit: 'core-hours',
              },
              description: 'openshift-aws-node',
              tiered_rates: [
                {
                  unit: 'USD',
                  usage: {
                    unit: 'USD',
                  },
                  value: 55,
                },
              ],
              cost_type: 'Supplementary',
            },
            {
              metric: {
                name: 'cpu_core_request_per_hour',
                label_metric: 'CPU',
                label_measurement: 'Request',
                label_measurement_unit: 'core-hours',
              },
              description: 'openshift-containers',
              tag_rates: {
                tag_key: 'openshift-region-1',
                tag_values: [
                  {
                    unit: 'USD',
                    value: 0.1,
                    default: true,
                    tag_value: 'container',
                    description: 'any container',
                  },
                  {
                    unit: 'USD',
                    value: 0.3,
                    default: false,
                    tag_value: 'scraper',
                    description: 'prometheus scraper',
                  },
                  {
                    unit: 'USD',
                    value: 0.4,
                    default: false,
                    tag_value: 'prometheus',
                    description: 'prometheus instance',
                  },
                  {
                    unit: 'USD',
                    value: 0.1,
                    default: false,
                    tag_value: 'grafana',
                    description: 'dashboard',
                  },
                ],
              },
              cost_type: 'Supplementary',
            },
            {
              metric: {
                name: 'cpu_core_request_per_hour',
                label_metric: 'CPU',
                label_measurement: 'Request',
                label_measurement_unit: 'core-hours',
              },
              description: 'openshift-containers',
              tag_rates: {
                tag_key: 'openshift-region-2',
                tag_values: [
                  {
                    unit: 'USD',
                    value: 0.1,
                    default: true,
                    tag_value: 'container',
                    description: 'any container',
                  },
                ],
              },
              cost_type: 'Supplementary',
            },
          ],
          markup: {
            value: '0.0000000000',
            unit: 'percent',
          },
          source_uuids: [],
          sources: [],
        },
      ],
    },
    error: null,
    status: 2,
    currentFilterType: 'name',
    currentFilterValue: '',
    isDialogOpen: {
      deleteRate: false,
      deleteSource: false,
      addSource: false,
      addRate: false,
      updateRate: true,
      deleteCostModel: false,
      updateCostModel: false,
      deleteMarkup: false,
      updateMarkup: false,
    },
    update: {
      error: null,
      status: 0,
      current: null,
    },
    delete: {
      error: null,
      status: 0,
    },
  },
  metrics: {
    error: null,
    status: 2,
    metrics: {
      meta: {
        count: 8,
      },
      links: {
        first: '/api/cost-management/v1/metrics/?limit=8&offset=0&source_type=OCP',
        next: null,
        previous: null,
        last: '/api/cost-management/v1/metrics/?limit=8&offset=0&source_type=OCP',
      },
      data: [
        {
          source_type: 'OpenShift Container Platform',
          metric: 'cpu_core_usage_per_hour',
          label_metric: 'CPU',
          label_measurement: 'Usage',
          label_measurement_unit: 'core-hours',
          default_cost_type: 'Supplementary',
        },
        {
          source_type: 'OpenShift Container Platform',
          metric: 'cpu_core_request_per_hour',
          label_metric: 'CPU',
          label_measurement: 'Request',
          label_measurement_unit: 'core-hours',
          default_cost_type: 'Supplementary',
        },
        {
          source_type: 'OpenShift Container Platform',
          metric: 'memory_gb_usage_per_hour',
          label_metric: 'Memory',
          label_measurement: 'Usage',
          label_measurement_unit: 'GB-hours',
          default_cost_type: 'Supplementary',
        },
        {
          source_type: 'OpenShift Container Platform',
          metric: 'memory_gb_request_per_hour',
          label_metric: 'Memory',
          label_measurement: 'Request',
          label_measurement_unit: 'GB-hours',
          default_cost_type: 'Supplementary',
        },
        {
          source_type: 'OpenShift Container Platform',
          metric: 'storage_gb_usage_per_month',
          label_metric: 'Storage',
          label_measurement: 'Usage',
          label_measurement_unit: 'GB-month',
          default_cost_type: 'Supplementary',
        },
        {
          source_type: 'OpenShift Container Platform',
          metric: 'storage_gb_request_per_month',
          label_metric: 'Storage',
          label_measurement: 'Request',
          label_measurement_unit: 'GB-month',
          default_cost_type: 'Supplementary',
        },
        {
          source_type: 'OpenShift Container Platform',
          metric: 'node_cost_per_month',
          label_metric: 'Node',
          label_measurement: 'Currency',
          label_measurement_unit: 'node-month',
          default_cost_type: 'Infrastructure',
        },
        {
          source_type: 'OpenShift Container Platform',
          metric: 'cluster_cost_per_month',
          label_metric: 'Cluster',
          label_measurement: 'Currency',
          label_measurement_unit: 'cluster-month',
          default_cost_type: 'Infrastructure',
        },
      ],
    },
  },
};

function RenderFormDataUI({ index }) {
  return (
    <Provider store={createStore(rootReducer, initial)}>
      <UpdateRateModal index={index} />;
    </Provider>
  );
}

function regExp(msg) {
  return new RegExp(msg.defaultMessage);
}

describe('update-rate', () => {
  test('index is -1', () => {
    render(<RenderFormDataUI index={-1} />);
  });

  test('submit regular', () => {
    const { getByDisplayValue, getByText } = render(<RenderFormDataUI index={0} />);
    fireEvent.change(getByDisplayValue(/openshift-aws-node/i), { target: { value: 'a new description' } });
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeFalsy();
    fireEvent.click(getByText(regExp(messages.Save)));
  });

  test('regular', async () => {
    const { container, getByLabelText, getByDisplayValue, getByText, getAllByRole } = render(<RenderFormDataUI index={0} />);
    fireEvent.change(getByDisplayValue(/openshift-aws-node/i), { target: { value: 'a new description' } });
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeFalsy();
    fireEvent.change(getByDisplayValue(/a new description/i), { target: { value: 'openshift-aws-node' } });
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeTruthy();

    await waitFor(() => {
      userEvent.click(getAllByRole('button')[2]);
    });
    userEvent.click(getAllByRole('option')[1]);
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeFalsy();

    await waitFor(() => {
      userEvent.click(getAllByRole('button')[2]);
    });
    userEvent.click(getAllByRole('option')[0]);
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeTruthy();

    await waitFor(() => {
      userEvent.click(getAllByRole('button')[1]);
    });
    userEvent.click(getAllByRole('option')[1]);

    await waitFor(() => {
      userEvent.click(getAllByRole('button')[2]);
    });
    userEvent.click(getAllByRole('option')[0]);
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeFalsy();

    await waitFor(() => {
      userEvent.click(getAllByRole('button')[1]);
    });
    userEvent.click(getAllByRole('option')[0]);

    await waitFor(() => {
      userEvent.click(getAllByRole('button')[2]);
    });
    userEvent.click(getAllByRole('option')[0]);
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeTruthy();

    fireEvent.click(getByLabelText(/infrastructure/i));
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeFalsy();
    fireEvent.click(getByLabelText(/supplementary/i));
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeTruthy();

    fireEvent.change(getByDisplayValue(/55/i), { target: { value: '55.3' } });
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeFalsy();
    fireEvent.change(getByDisplayValue(/55.3/i), { target: { value: '55' } });
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeTruthy();

    fireEvent.click(getByLabelText(regExp(messages.CostModelsEnterTagRate)));
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeTruthy();
    fireEvent.change(getByLabelText(regExp(messages.CostModelsFilterTagKey)), { target: { value: 'openshift' } });
    fireEvent.change(getByLabelText(regExp(messages.CostModelsTagRateTableValue)), { target: { value: 'worker' } });
    fireEvent.change(getByLabelText(regExp(messages.Rate)), { target: { value: '0.321' } });
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeFalsy();
    fireEvent.click(getByText(regExp(messages.Save)));
  });

  test('tag', () => {
    const { getByTestId, getAllByLabelText, getByDisplayValue, getByText } = render(<RenderFormDataUI index={1} />);
    fireEvent.change(getByDisplayValue(/^container/i), { target: { value: 'container1' } });
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeFalsy();
    fireEvent.change(getByDisplayValue(/^container1/i), { target: { value: 'container' } });
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeTruthy();

    fireEvent.change(getByDisplayValue(/any container/i), { target: { value: 'any container1' } });
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeFalsy();
    fireEvent.change(getByDisplayValue(/any container1/i), { target: { value: 'any container' } });

    fireEvent.change(getByDisplayValue(/0.4/i), { target: { value: '1.23' } });
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeFalsy();
    fireEvent.change(getByDisplayValue(/1.23/i), { target: { value: '0.4' } });
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeTruthy();

    fireEvent.click(getAllByLabelText(regExp(messages.CostModelsTagRateTableDefault))[1]);
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeFalsy();
    fireEvent.click(getAllByLabelText(regExp(messages.CostModelsTagRateTableDefault))[0]);
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeTruthy();

    fireEvent.click(getByTestId(/add_more/i));
    fireEvent.change(getAllByLabelText(regExp(messages.CostModelsTagRateTableValue))[4], {
      target: { value: 'something random' },
    });
    fireEvent.change(getAllByLabelText(regExp(messages.Rate))[4], { target: { value: '1.01' } });
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeFalsy();
    fireEvent.click(getByTestId('remove_tag_4'));
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeTruthy();

    fireEvent.change(getByDisplayValue(/openshift-region-1/i), { target: { value: 'openshift-2' } });
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeFalsy();
    fireEvent.change(getByDisplayValue(/openshift-2/i), { target: { value: 'openshift-region-1' } });
    expect(getByText(regExp(messages.Save)).closest('button').disabled).toBeTruthy();
  });

  test('duplicate tag key from regular rate', async () => {
    const { queryByText, getByLabelText, getByDisplayValue, getByText, getAllByRole } = render(<RenderFormDataUI index={0} />);
    await waitFor(() => {
      userEvent.click(getAllByRole('button')[2]);
    });
    userEvent.click(getAllByRole('option')[1]);
    fireEvent.click(getByLabelText(regExp(messages.CostModelsEnterTagRate)));
    fireEvent.change(getByLabelText(regExp(messages.CostModelsFilterTagKey)), {
      target: { value: 'openshift-region-1' },
    });
    expect(queryByText(regExp(messages.PriceListDuplicate))).toBeTruthy();
  });

  test('duplicate tag key from tag rate', () => {
    const { queryByText, getByLabelText } = render(<RenderFormDataUI index={2} />);
    fireEvent.change(getByLabelText(regExp(messages.CostModelsFilterTagKey)), {
      target: { value: 'openshift-region-1' },
    });
    expect(queryByText(regExp(messages.PriceListDuplicate))).toBeTruthy();
  });
});

jest.mock('api/costModels');
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateCostModel } from 'api/costModels';
import messages from 'locales/messages';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from 'store/rootReducer';

// waitfor needed for act() warning with appending select to body, lint disable needed for waitifor
/* eslint-disable testing-library/no-wait-for-side-effects */

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
    render(<RenderFormDataUI index={0} />);
    userEvent.type(screen.getByDisplayValue(/openshift-aws-node/i), 'a new description');
    // eslint-disable-next-line testing-library/prefer-presence-queries
    expect(screen.getByText(regExp(messages.Save)).getAttribute('disabled')).toBeNull();
    userEvent.click(screen.getByText(regExp(messages.Save)));
  });

  test('regular', async () => {
    render(<RenderFormDataUI index={0} />);
    const descInput = screen.getByDisplayValue('openshift-aws-node');
    const saveButton = screen.getByText(regExp(messages.Save));
    expect(saveButton.getAttribute('disabled')).not.toBeNull();
    userEvent.clear(descInput);
    userEvent.type(descInput, 'a new description');
    expect(saveButton.getAttribute('disabled')).toBeNull();
    userEvent.clear(descInput);
    userEvent.type(descInput, 'openshift-aws-node');
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    await waitFor(() => {
      userEvent.click(screen.getByLabelText('measurement label'));
    });
    userEvent.click(screen.getAllByRole('option')[1]);
    expect(saveButton.getAttribute('disabled')).toBeNull();

    await waitFor(() => {
      userEvent.click(screen.getByLabelText('measurement label'));
    });
    userEvent.click(screen.getAllByRole('option')[0]);
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    await waitFor(() => {
      userEvent.click(screen.getByLabelText('metric label'));
    });
    userEvent.click(screen.getAllByRole('option')[1]);

    await waitFor(() => {
      userEvent.click(screen.getByLabelText('measurement label'));
    });
    userEvent.click(screen.getAllByRole('option')[0]);
    expect(saveButton.getAttribute('disabled')).toBeNull();

    await waitFor(() => {
      userEvent.click(screen.getByLabelText('metric label'));
    });
    userEvent.click(screen.getAllByRole('option')[0]);

    await waitFor(() => {
      userEvent.click(screen.getByLabelText('measurement label'));
    });
    userEvent.click(screen.getAllByRole('option')[0]);
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    userEvent.click(screen.getByLabelText(/infrastructure/i));
    expect(saveButton.getAttribute('disabled')).toBeNull();
    userEvent.click(screen.getByLabelText(/supplementary/i));
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    userEvent.type(screen.getByDisplayValue(/55/i), '.3');
    expect(saveButton.getAttribute('disabled')).toBeNull();
    userEvent.type(screen.getByDisplayValue(/55.3/i), '{backspace}{backspace}');
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    userEvent.click(screen.getByLabelText(regExp(messages.CostModelsEnterTagRate)));
    expect(saveButton.getAttribute('disabled')).not.toBeNull();
    userEvent.type(screen.getByLabelText(regExp(messages.CostModelsFilterTagKey)), 'openshift');
    userEvent.type(screen.getByLabelText(regExp(messages.CostModelsTagRateTableValue)), 'worker');
    userEvent.type(screen.getByLabelText(regExp(messages.Rate)), '0.321');
    expect(saveButton.getAttribute('disabled')).toBeNull();
    userEvent.click(saveButton);
  });

  test('tag', () => {
    render(<RenderFormDataUI index={1} />);
    const saveButton = screen.getByText(regExp(messages.Save));
    expect(saveButton.getAttribute('disabled')).not.toBeNull();
    userEvent.type(screen.getByDisplayValue(/^container$/i), '1');
    expect(saveButton.getAttribute('disabled')).toBeNull();
    userEvent.type(screen.getByDisplayValue(/^container1$/i), '{backspace}');
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    userEvent.type(screen.getByDisplayValue(/any container$/i), '1');
    expect(saveButton.getAttribute('disabled')).toBeNull();
    userEvent.type(screen.getByDisplayValue(/any container1$/i), '{backspace}');
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    userEvent.type(screen.getByDisplayValue(/^0.4$/i), '3');
    expect(saveButton.getAttribute('disabled')).toBeNull();
    userEvent.type(screen.getByDisplayValue(/^0.43$/i), '{backspace}');
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    userEvent.click(screen.getAllByLabelText(regExp(messages.CostModelsTagRateTableDefault))[1]);
    expect(saveButton.getAttribute('disabled')).toBeNull();
    userEvent.click(screen.getAllByLabelText(regExp(messages.CostModelsTagRateTableDefault))[0]);
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    userEvent.click(screen.getByTestId(/add_more/i));
    userEvent.type(screen.getAllByLabelText(regExp(messages.CostModelsTagRateTableValue))[4], 'something random');
    userEvent.type(screen.getAllByLabelText(regExp(messages.Rate))[4], '1.01');
    expect(saveButton.getAttribute('disabled')).toBeNull();
    userEvent.click(screen.getByTestId('remove_tag_4'));
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    userEvent.type(screen.getByDisplayValue(/openshift-region-1/i), '2');
    expect(saveButton.getAttribute('disabled')).toBeNull();
    userEvent.type(screen.getByDisplayValue(/openshift-region-12/i), '{backspace}');
    expect(saveButton.getAttribute('disabled')).not.toBeNull();
  });

  test('duplicate tag key from regular rate', async () => {
    render(<RenderFormDataUI index={0} />);
    await waitFor(() => {
      userEvent.click(screen.getByLabelText('measurement label'));
    });
    userEvent.click(screen.getAllByRole('option')[1]);
    userEvent.click(screen.getByLabelText(regExp(messages.CostModelsEnterTagRate)));
    userEvent.type(screen.getByLabelText(regExp(messages.CostModelsFilterTagKey)), 'openshift-region-1');
    expect(screen.getByText(regExp(messages.PriceListDuplicate))).not.toBeNull();
  });

  test('duplicate tag key from tag rate', () => {
    render(<RenderFormDataUI index={2} />);
    const filterTagInput = screen.getByLabelText(regExp(messages.CostModelsFilterTagKey));
    userEvent.clear(filterTagInput);
    userEvent.type(filterTagInput, 'openshift-region-1');
    expect(screen.getByText(regExp(messages.PriceListDuplicate))).not.toBeNull();
  });
});

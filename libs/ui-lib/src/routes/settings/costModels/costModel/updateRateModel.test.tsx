jest.mock('@koku-ui/api/costModels');
import { act, configure, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateCostModel } from '@koku-ui/api/costModels';
import messages from '@koku-ui/i18n/locales/messages';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from '../../../../store/rootReducer';

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
                tag_key: 'openshift_region_1',
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
                tag_key: 'openshift_region_2',
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
          label_measurement_unit: 'GiB-hours',
          default_cost_type: 'Supplementary',
        },
        {
          source_type: 'OpenShift Container Platform',
          metric: 'memory_gb_request_per_hour',
          label_metric: 'Memory',
          label_measurement: 'Request',
          label_measurement_unit: 'GiB-hours',
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

function RenderFormDataUI(props) {
  return (
    <Provider store={createStore(rootReducer, initial)}>
      <UpdateRateModal {...props} />;
    </Provider>
  );
}

function regExp(msg) {
  return new RegExp(msg.defaultMessage);
}

// Update testId accessor since data-testid is not passed to the parent component of Select
configure({ testIdAttribute: 'data-ouia-component-id' });

describe('update-rate', () => {
  test('index is -1', () => {
    render(<RenderFormDataUI index={-1} />);
  });

  test('submit regular', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<RenderFormDataUI index={0} />);
    await user.type(screen.getByDisplayValue(/openshift-aws-node/i), 'a new description');
    // eslint-disable-next-line testing-library/prefer-presence-queries
    expect(screen.getByText(regExp(messages.save)).getAttribute('disabled')).toBeNull();
    await user.click(screen.getByText(regExp(messages.save)));
  });

  test('Description', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<RenderFormDataUI index={0} />);

    const descInput = screen.getByDisplayValue('openshift-aws-node');
    const saveButton = screen.getByRole('button', { name: regExp(messages.save)} );
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    await user.clear(descInput);
    await user.type(descInput, 'a new description');
    expect(saveButton.getAttribute('disabled')).toBeNull();

    await user.clear(descInput);
    await user.type(descInput, 'openshift-aws-node');
    expect(saveButton.getAttribute('disabled')).not.toBeNull();
  });

  test('Select measurement', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    let options = null;

    render(<RenderFormDataUI index={0} />);

    const saveButton = screen.getByRole('button', { name: regExp(messages.save)} );

    // Note: hidden is used because "RTL queries only find accessible elements by default, and some internal logic in
    // Popper is setting the menu to aria-hidden after a selection is made the first time"
    await user.click(screen.getByLabelText('Select measurement'));
    options = await screen.findAllByRole('option', { hidden: true});
    await user.click(options.find(o => /"value":"request"/i.test(o.textContent)));

    expect(saveButton).not.toBeDisabled();

    await user.click(screen.getByLabelText('Select measurement'));
    options = await screen.findAllByRole('option', { hidden: true});
    await user.click(options.find(o => /"value":"usage"/i.test(o.textContent)));

    expect(saveButton).toBeDisabled();

    await user.click(screen.getByLabelText('Select metric'));
    options = await screen.findAllByRole('option', { hidden: true});
    await user.click(options.find(o => /"value":"memory"/i.test(o.textContent)));

    // After changing metric, measurement is reset and must be re-selected
    await user.click(screen.getByLabelText('Select measurement'));
    options = await screen.findAllByRole('option', { hidden: true});
    await user.click(options.find(o => /"value":"usage"/i.test(o.textContent)));

    expect(saveButton).not.toBeDisabled();
  }, 10000);

  test('regular', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<RenderFormDataUI index={0} />);
    const saveButton = screen.getByRole('button', { name: regExp(messages.save)} );

    await user.click(screen.getByLabelText(/infrastructure/i));
    expect(saveButton.getAttribute('disabled')).toBeNull();
    await user.click(screen.getByLabelText(/supplementary/i));
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    await user.type(screen.getByDisplayValue(/55/i), '.3');
    expect(saveButton.getAttribute('disabled')).toBeNull();
    await user.type(screen.getByDisplayValue(/55.3/i), '{backspace}{backspace}');
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    await user.click(screen.getByLabelText(regExp(messages.costModelsEnterTagRate)));
    expect(saveButton.getAttribute('disabled')).not.toBeNull();
    await user.type(screen.getByLabelText(regExp(messages.costModelsFilterTagKey)), 'openshift');
    await user.type(screen.getByLabelText(regExp(messages.costModelsTagRateTableValue)), 'worker');
    await user.type(screen.getByLabelText(regExp(messages.rate)), '0.321');
    expect(saveButton.getAttribute('disabled')).toBeNull();
    await user.click(saveButton);
  });

  test('tag', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<RenderFormDataUI index={1} />);
    const saveButton = screen.getByRole('button', { name: regExp(messages.save)} );
    expect(saveButton.getAttribute('disabled')).not.toBeNull();
    await user.type(screen.getByDisplayValue(/^container$/i), 'A');
    expect(saveButton.getAttribute('disabled')).toBeNull();
    await user.type(screen.getByDisplayValue(/^containerA$/i), '{backspace}');
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    await user.type(screen.getByDisplayValue(/any container$/i), 'A');
    expect(saveButton.getAttribute('disabled')).toBeNull();
    await user.type(screen.getByDisplayValue(/any containerA$/i), '{backspace}');
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    await user.type(screen.getByDisplayValue(/^0.4$/i), '3');
    expect(saveButton.getAttribute('disabled')).toBeNull();
    await user.type(screen.getByDisplayValue(/^0.43$/i), '{backspace}');
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    await user.click(screen.getAllByLabelText(regExp(messages.default))[1]);
    expect(saveButton.getAttribute('disabled')).toBeNull();
    await user.click(screen.getAllByLabelText(regExp(messages.default))[0]);
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    await user.click(screen.getByText(/Add more tag values/i));
    await act(async () =>
      user.type(screen.getAllByLabelText(regExp(messages.costModelsTagRateTableValue))[4], 'something_random')
    );
    await user.type(screen.getAllByLabelText(regExp(messages.rate))[4], '1.01');
    expect(saveButton.getAttribute('disabled')).toBeNull();
    await user.click(screen.getAllByLabelText(regExp(messages.costModelsRemoveTagLabel))[4]);
    expect(saveButton.getAttribute('disabled')).not.toBeNull();

    await user.type(screen.getByDisplayValue(/openshift_region_1/i), '2');
    expect(saveButton.getAttribute('disabled')).toBeNull();
    await user.type(screen.getByDisplayValue(/openshift_region_12/i), '{backspace}');
    expect(saveButton.getAttribute('disabled')).not.toBeNull();
  });

  test('duplicate tag key from regular rate', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    let options = null;
    render(<RenderFormDataUI index={0} />);

    await user.click(screen.getByLabelText('Select measurement'));
    options = await screen.findAllByRole('option');
    await user.click(options.find(o => /"value":"request"/i.test(o.textContent)));

    await user.click(screen.getByLabelText(regExp(messages.costModelsEnterTagRate)));
    await act(async () =>
      user.type(screen.getByLabelText(regExp(messages.costModelsFilterTagKey)), 'openshift_region_1')
    );
    expect(screen.getByText(regExp(messages.priceListDuplicate))).not.toBeNull();
  });

  test('duplicate tag key from tag rate', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<RenderFormDataUI index={2} />);
    const filterTagInput = screen.getByLabelText(regExp(messages.costModelsFilterTagKey));
    await user.clear(filterTagInput);
    await user.type(filterTagInput, 'openshift_region_1');
    expect(screen.getByText(regExp(messages.priceListDuplicate))).not.toBeNull();
  });
});

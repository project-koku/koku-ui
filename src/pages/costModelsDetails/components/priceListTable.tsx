import {
  DataList,
  DropdownItem,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  List,
  ListItem,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { FileInvoiceDollarIcon } from '@patternfly/react-icons';
import { CostModel } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import { Rate } from 'api/rates';
import { AxiosError } from 'axios';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { ErrorState } from 'components/state/errorState/errorState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import { ReadOnlyTooltip } from 'pages/costModelsDetails/components/readOnlyTooltip';
import { PriceListToolbar } from 'pages/createCostModelWizard/Datatoolbar';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { metricsSelectors } from 'store/metrics';
import { rbacSelectors } from 'store/rbac';
import AddRateModel from './addRateModal';
import CostModelRateItem from './costModelRateItem';
import Dialog from './dialog';
import Dropdown from './dropdown';
import UpdateRateModel from './updateRateModel';

interface State {
  deleteRate: Rate;
  index: number;
  filters: {
    metrics: string[];
    measurements: string[];
  };
  pagination: {
    perPage: number;
    page: number;
  };
}

interface Props extends InjectedTranslateProps {
  fetchError: AxiosError;
  fetchStatus: FetchStatus;
  current: CostModel;
  rates: Rate[];
  costModel?: string;
  assignees?: string[];
  updateCostModel: typeof costModelsActions.updateCostModel;
  error: string;
  isDialogOpen: { deleteRate: boolean; updateRate: boolean; addRate: boolean };
  setDialogOpen: typeof costModelsActions.setCostModelDialog;
  isLoading: boolean;
  metricsHash: MetricHash;
  maxRate: number;
  isWritePermission: boolean;
}

class PriceListTable extends React.Component<Props, State> {
  public state = {
    deleteRate: null,
    index: -1,
    filters: {
      metrics: [],
      measurements: [],
    },
    pagination: {
      perPage: 6,
      page: 1,
    },
  };
  public render() {
    const {
      t,
      rates,
      fetchStatus,
      fetchError,
      setDialogOpen,
      isDialogOpen,
      metricsHash,
      maxRate,
      isWritePermission,
    } = this.props;
    const metricOpts = Object.keys(metricsHash).map(m => ({
      label: t(`cost_models.${m}`),
      value: m,
    }));
    const measurementOpts = metricOpts.reduce((acc, curr) => {
      const measurs = Object.keys(metricsHash[curr.value])
        .filter(m => !acc.map(i => i.value).includes(m))
        .map(m => ({ label: t(`toolbar.pricelist.options.${m}`), value: m }));
      return [...acc, ...measurs];
    }, []);
    const onSelectItem = event => {
      let type = '';
      if (event.type === 'SELECT_METRICS') {
        type = 'metrics';
      }
      if (event.type === 'SELECT_MEASUREMENTS') {
        type = 'measurements';
      }
      const prev = this.state.filters[type];
      if (prev.includes(event.selection)) {
        this.setState({
          filters: {
            ...this.state.filters,
            [type]: prev.filter(x => x !== event.selection),
          },
        });
        return;
      }
      this.setState({
        filters: {
          ...this.state.filters,
          [type]: [...prev, event.selection],
        },
      });
    };

    const from =
      (this.state.pagination.page - 1) * this.state.pagination.perPage;
    const to = this.state.pagination.page * this.state.pagination.perPage;

    const res = rates
      .filter(
        rate =>
          this.state.filters.metrics.length === 0 ||
          this.state.filters.metrics.includes(rate.metric.label_metric)
      )
      .filter(
        rate =>
          this.state.filters.measurements.length === 0 ||
          this.state.filters.measurements.includes(
            rate.metric.label_measurement
          )
      );
    const filtered = res.slice(from, to);
    return (
      <>
        {isDialogOpen.updateRate && (
          <UpdateRateModel
            t={t}
            metricsHash={metricsHash}
            index={this.state.index}
            current={this.props.current}
            isProcessing={this.props.isLoading}
            onClose={() => setDialogOpen({ name: 'updateRate', isOpen: false })}
            onProceed={(metric: string, measurement: string, rate: string) => {
              const newState = {
                ...this.props.current,
                provider_uuids: this.props.current.providers.map(
                  provider => provider.uuid
                ),
                source_type:
                  this.props.current.source_type ===
                  'OpenShift Container Platform'
                    ? 'OCP'
                    : 'AWS',
                rates: [
                  ...this.props.current.rates.slice(0, this.state.index),
                  ...this.props.current.rates.slice(this.state.index + 1),
                  {
                    metric: { name: metricsHash[metric][measurement].metric },
                    tiered_rates: [
                      {
                        unit: 'USD',
                        value: Number(rate),
                        usage: { unit: 'USD' },
                      },
                    ],
                  },
                ],
              };
              this.props.updateCostModel(
                this.props.current.uuid,
                newState,
                'updateRate'
              );
            }}
            updateError={this.props.error}
          />
        )}
        {isDialogOpen.addRate && (
          <AddRateModel
            updateError={this.props.error}
            current={this.props.current}
            isProcessing={this.props.isLoading}
            onClose={() => setDialogOpen({ name: 'addRate', isOpen: false })}
            onProceed={(metric, measurement, rate) => {
              const newState = {
                ...this.props.current,
                provider_uuids: this.props.current.providers.map(
                  provider => provider.uuid
                ),
                source_type:
                  this.props.current.source_type ===
                  'OpenShift Container Platform'
                    ? 'OCP'
                    : 'AWS',
                rates: [
                  ...this.props.current.rates,
                  {
                    metric: { name: metricsHash[metric][measurement].metric },
                    tiered_rates: [
                      {
                        unit: 'USD',
                        value: Number(rate),
                        usage: { unit: 'USD' },
                      },
                    ],
                  },
                ],
              };
              this.props.updateCostModel(
                this.props.current.uuid,
                newState,
                'addRate'
              );
            }}
          />
        )}
        <Dialog
          isSmall
          isOpen={isDialogOpen.deleteRate}
          title={t('dialog.title', { rate: this.state.deleteRate })}
          onClose={() => {
            this.props.setDialogOpen({ name: 'deleteRate', isOpen: false });
            this.setState({ deleteRate: null });
          }}
          isProcessing={this.props.isLoading}
          onProceed={() => {
            const { index } = this.state;
            const { current } = this.props;
            const newState = {
              ...current,
              provider_uuids: current.providers.map(provider => provider.uuid),
              source_type:
                current.source_type === 'OpenShift Container Platform'
                  ? 'OCP'
                  : 'AWS',
              rates: [
                ...current.rates.slice(0, index),
                ...current.rates.slice(index + 1),
              ],
            };
            this.props.updateCostModel(current.uuid, newState, 'deleteRate');
          }}
          body={
            <>
              {t('dialog.rate.body', {
                rate: this.state.deleteRate,
                cm: this.props.costModel,
              })}
              {this.props.assignees && this.props.assignees.length > 0 && (
                <>
                  {t('dialog.rate.assigned')}
                  <List>
                    {this.props.assignees.map(p => (
                      <ListItem key={p}>{p}</ListItem>
                    ))}
                  </List>
                </>
              )}
            </>
          }
          actionText={t('dialog.deleteRate')}
        />
        <PriceListToolbar
          actionButtonText={t('toolbar.pricelist.add_rate')}
          actionButtonDisabled={!isWritePermission}
          metricProps={{
            options: metricOpts,
            selection: this.state.filters.metrics,
            placeholder: t('toolbar.pricelist.metric_placeholder'),
          }}
          measurementProps={{
            options: measurementOpts,
            selection: this.state.filters.measurements,
            placeholder: t('toolbar.pricelist.measurement_placeholder'),
          }}
          onSelect={onSelectItem}
          onClick={() =>
            this.props.setDialogOpen({
              name: 'addRate',
              isOpen: true,
            })
          }
          pagination={{
            itemCount: res.length,
            perPage: this.state.pagination.perPage,
            page: this.state.pagination.page,
            onSetPage: (_evt, page) =>
              this.setState({ pagination: { ...this.state.pagination, page } }),
            onPerPageSelect: (_evt, perPage) =>
              this.setState({ pagination: { page: 1, perPage } }),
            perPageOptions: [
              { title: '2', value: 2 },
              { title: '4', value: 4 },
              { title: '6', value: 6 },
            ],
          }}
          enableAddRate={maxRate === rates.length}
          filters={this.state.filters as { [k: string]: string[] }}
          onClear={() => {
            this.setState({
              filters: {
                metrics: [],
                measurements: [],
              },
            });
          }}
          onRemoveFilter={(type: string, id: string) => {
            switch (type) {
              case t('toolbar.pricelist.metric_placeholder'):
                return this.setState({
                  filters: {
                    ...this.state.filters,
                    metrics: this.state.filters.metrics.filter(m => m !== id),
                  },
                });
              case t('toolbar.pricelist.measurement_placeholder'):
                return this.setState({
                  filters: {
                    ...this.state.filters,
                    measurements: this.state.filters.measurements.filter(
                      m => m !== id
                    ),
                  },
                });
            }
          }}
        />
        {fetchStatus !== FetchStatus.complete && <LoadingState />}
        {fetchStatus === FetchStatus.complete && Boolean(fetchError) && (
          <ErrorState error={fetchError} />
        )}
        {fetchStatus === FetchStatus.complete &&
          filtered.length === 0 &&
          (this.state.filters.metrics.length !== 0 ||
            this.state.filters.measurements.length !== 0) && (
            <EmptyFilterState
              filter={t(
                'cost_models_wizard.price_list.toolbar_top_results_aria_label'
              )}
            />
          )}
        {fetchStatus === FetchStatus.complete &&
          filtered.length === 0 &&
          this.state.filters.measurements.length === 0 &&
          this.state.filters.metrics.length === 0 && (
            <EmptyState>
              <EmptyStateIcon icon={FileInvoiceDollarIcon} />
              <Title size={TitleSize.lg}>
                {t('cost_models_details.empty_state_rate.title')}
              </Title>
              <EmptyStateBody>
                {t('cost_models_details.empty_state_rate.description')}
              </EmptyStateBody>
            </EmptyState>
          )}
        {fetchStatus === FetchStatus.complete && filtered.length > 0 && (
          <DataList
            aria-label={t('cost_models_wizard.price_list.data_list_aria_label')}
          >
            {filtered.map((tier, ix) => {
              return (
                <CostModelRateItem
                  key={ix}
                  index={ix}
                  metric={tier.metric.label_metric}
                  measurement={tier.metric.label_measurement}
                  rate={String(tier.tiered_rates[0].value)}
                  units={tier.metric.label_measurement_unit}
                  actionComponent={
                    <Dropdown
                      isPlain
                      dropdownItems={[
                        <ReadOnlyTooltip
                          key="edit"
                          isDisabled={!isWritePermission}
                        >
                          <DropdownItem
                            isDisabled={!isWritePermission}
                            onClick={() => {
                              this.setState({
                                deleteRate: null,
                                index: ix,
                              });
                              this.props.setDialogOpen({
                                name: 'updateRate',
                                isOpen: true,
                              });
                            }}
                            component="button"
                          >
                            {t('cost_models_wizard.price_list.update_button')}
                          </DropdownItem>
                        </ReadOnlyTooltip>,
                        <ReadOnlyTooltip
                          key="delete"
                          isDisabled={!isWritePermission}
                        >
                          <DropdownItem
                            isDisabled={!isWritePermission}
                            onClick={() => {
                              this.setState({
                                deleteRate: tier,
                                index: ix,
                              });
                              this.props.setDialogOpen({
                                name: 'deleteRate',
                                isOpen: true,
                              });
                            }}
                            component="button"
                            style={
                              !isWritePermission ? undefined : { color: 'red' }
                            }
                          >
                            {t('cost_models_wizard.price_list.delete_button')}
                          </DropdownItem>
                        </ReadOnlyTooltip>,
                      ]}
                    />
                  }
                />
              );
            })}
          </DataList>
        )}
      </>
    );
  }
}

export default connect(
  createMapStateToProps(state => ({
    isLoading: costModelsSelectors.updateProcessing(state),
    error: costModelsSelectors.updateError(state),
    isDialogOpen: costModelsSelectors.isDialogOpen(state)('rate'),
    fetchError: costModelsSelectors.error(state),
    fetchStatus: costModelsSelectors.status(state),
    metricsHash: metricsSelectors.metrics(state),
    maxRate: metricsSelectors.maxRate(state),
    isWritePermission: rbacSelectors.isCostModelWritePermission(state),
  })),
  {
    updateCostModel: costModelsActions.updateCostModel,
    setDialogOpen: costModelsActions.setCostModelDialog,
  }
)(translate()(PriceListTable));

import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  List,
  ListItem,
  Pagination,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { FileInvoiceDollarIcon } from '@patternfly/react-icons';
import { CostModel } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import { AxiosError } from 'axios';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { ErrorState } from 'components/state/errorState/errorState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import { TierData } from 'pages/costModels/components/addPriceList';
import { WithPriceListSearch } from 'pages/costModels/components/hoc/withPriceListSearch';
import { PriceListToolbar } from 'pages/costModels/components/priceListToolbar';
import { RateTable } from 'pages/costModels/components/rateTable';
import { CheckboxSelector } from 'pages/costModels/components/toolbar/checkboxSelector';
import { PrimarySelector } from 'pages/costModels/components/toolbar/primarySelector';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { metricsSelectors } from 'store/metrics';
import { rbacSelectors } from 'store/rbac';
import AddRateModel from './addRateModal';
import Dialog from './dialog';
import UpdateRateModel from './updateRateModel';

interface State {
  deleteRate: TierData;
  index: number;
  pagination: {
    perPage: number;
    page: number;
  };
}

interface Props extends InjectedTranslateProps {
  fetchError: AxiosError;
  fetchStatus: FetchStatus;
  current: CostModel;
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
    pagination: {
      perPage: 6,
      page: 1,
    },
  };
  public render() {
    const {
      t,
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
            onProceed={(
              metric: string,
              measurement: string,
              rate: string,
              isInfra: boolean
            ) => {
              const newState = {
                ...this.props.current,
                source_uuids: this.props.current.sources.map(
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
                    cost_type: isInfra ? 'Infrastructure' : 'Supplementary',
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
            onProceed={(metric, measurement, rate, isInfra) => {
              const newState = {
                ...this.props.current,
                source_uuids: this.props.current.sources.map(
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
                    cost_type: isInfra ? 'Infrastructure' : 'Supplementary',
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
          title={t('dialog.rate.title', { rate: this.state.deleteRate })}
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
              source_uuids: current.sources.map(provider => provider.uuid),
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
        <WithPriceListSearch
          initialFilters={{ primary: 'metrics', metrics: [], measurements: [] }}
        >
          {({ search, setSearch, onRemove, onSelect, onClearAll }) => {
            const from =
              (this.state.pagination.page - 1) * this.state.pagination.perPage;
            const to =
              this.state.pagination.page * this.state.pagination.perPage;

            const res = this.props.current.rates
              .filter(
                rate =>
                  search.metrics.length === 0 ||
                  search.metrics.includes(rate.metric.label_metric)
              )
              .filter(
                rate =>
                  search.measurements.length === 0 ||
                  search.measurements.includes(rate.metric.label_measurement)
              );
            const filtered = res.slice(from, to).map(r => ({
              metric: r.metric.label_metric,
              measurement: r.metric.label_measurement,
              rate: r.tiered_rates[0].value.toString(),
              isInfra: r.cost_type === 'Infrastructure',
              meta: r.metric,
            }));
            return (
              <>
                <PriceListToolbar
                  primary={
                    <PrimarySelector
                      primary={search.primary}
                      setPrimary={(primary: string) => setSearch({ primary })}
                      options={[
                        {
                          label: t('toolbar.pricelist.metric'),
                          value: 'metrics',
                        },
                        {
                          label: t('toolbar.pricelist.measurement'),
                          value: 'measurements',
                        },
                      ]}
                    />
                  }
                  selected={search.primary}
                  secondaries={[
                    {
                      component: (
                        <CheckboxSelector
                          placeholderText={t(
                            'toolbar.pricelist.measurement_placeholder'
                          )}
                          selections={search.measurements}
                          setSelections={(selection: string) =>
                            onSelect('measurements', selection)
                          }
                          options={measurementOpts}
                        />
                      ),
                      name: 'measurements',
                      onRemove,
                      filters: search.measurements,
                    },
                    {
                      component: (
                        <CheckboxSelector
                          placeholderText={t(
                            'toolbar.pricelist.metric_placeholder'
                          )}
                          selections={search.metrics}
                          setSelections={(selection: string) =>
                            onSelect('metrics', selection)
                          }
                          options={metricOpts}
                        />
                      ),
                      name: 'metrics',
                      onRemove,
                      filters: search.metrics,
                    },
                  ]}
                  button={
                    <Button
                      isDisabled={
                        maxRate === this.props.current.rates.length
                          ? true
                          : !isWritePermission
                      }
                      onClick={() =>
                        this.props.setDialogOpen({
                          name: 'addRate',
                          isOpen: true,
                        })
                      }
                    >
                      {t('toolbar.pricelist.add_rate')}
                    </Button>
                  }
                  onClear={onClearAll}
                  pagination={
                    <Pagination
                      itemCount={res.length}
                      perPage={this.state.pagination.perPage}
                      page={this.state.pagination.page}
                      onSetPage={(_evt, page) =>
                        this.setState({
                          pagination: { ...this.state.pagination, page },
                        })
                      }
                      onPerPageSelect={(_evt, perPage) =>
                        this.setState({ pagination: { page: 1, perPage } })
                      }
                      perPageOptions={[
                        { title: '2', value: 2 },
                        { title: '4', value: 4 },
                        { title: '6', value: 6 },
                      ]}
                    />
                  }
                />
                {fetchStatus !== FetchStatus.complete && <LoadingState />}
                {fetchStatus === FetchStatus.complete &&
                  Boolean(fetchError) && <ErrorState error={fetchError} />}
                {fetchStatus === FetchStatus.complete &&
                  filtered.length === 0 &&
                  (search.metrics.length !== 0 ||
                    search.measurements.length !== 0) && (
                    <EmptyFilterState
                      filter={t(
                        'cost_models_wizard.price_list.toolbar_top_results_aria_label'
                      )}
                    />
                  )}
                {fetchStatus === FetchStatus.complete &&
                  filtered.length === 0 &&
                  search.measurements.length === 0 &&
                  search.metrics.length === 0 && (
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
                  <RateTable
                    t={t}
                    tiers={filtered}
                    actions={[
                      {
                        title: t('cost_models_wizard.price_list.update_button'),
                        isDisabled: !isWritePermission,
                        // HACK: to display tooltip on disable
                        style: !isWritePermission
                          ? { pointerEvents: 'auto' }
                          : undefined,
                        tooltip: !isWritePermission ? (
                          <div>{t('cost_models.read_only_tooltip')}</div>
                        ) : (
                          undefined
                        ),
                        onClick: (_evt, rowIndex, _rowData, _extra) => {
                          this.setState({
                            deleteRate: null,
                            index: rowIndex,
                          });
                          this.props.setDialogOpen({
                            name: 'updateRate',
                            isOpen: true,
                          });
                        },
                      },
                      {
                        title: t('cost_models_wizard.price_list.delete_button'),
                        isDisabled: !isWritePermission,
                        // HACK: to display tooltip on disable
                        style: !isWritePermission
                          ? { pointerEvents: 'auto' }
                          : { color: 'red' },
                        tooltip: !isWritePermission ? (
                          <div>{t('cost_models.read_only_tooltip')}</div>
                        ) : (
                          undefined
                        ),
                        onClick: (_evt, rowIndex, _rowData, _extra) => {
                          this.setState({
                            deleteRate: filtered[rowIndex],
                            index: rowIndex,
                          });
                          this.props.setDialogOpen({
                            name: 'deleteRate',
                            isOpen: true,
                          });
                        },
                      },
                    ]}
                  />
                )}
              </>
            );
          }}
        </WithPriceListSearch>
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

import Unavailable from '@patternfly/react-component-groups/dist/esm/UnavailableContent';
import { Bullseye, Button, EmptyState, EmptyStateBody, List, ListItem, Pagination } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { SortByDirection } from '@patternfly/react-table';
import type { CostModel } from 'api/costModels';
import type { MetricHash } from 'api/metrics';
import type { Rate } from 'api/rates';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import uniqWith from 'lodash/uniqWith';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { SelectCheckboxWrapper, SelectWrapper } from 'routes/components/selectWrapper';
import { EmptyFilterState } from 'routes/components/state/emptyFilterState';
import { LoadingState } from 'routes/components/state/loadingState';
import { WithPriceListSearch } from 'routes/settings/costModels/components/hoc/withPriceListSearch';
import { PriceListToolbar } from 'routes/settings/costModels/components/priceListToolbar';
import { compareBy } from 'routes/settings/costModels/components/rateForm/utils';
import { RateTable } from 'routes/settings/costModels/components/rateTable';
import { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { FeatureToggleSelectors } from 'store/featureToggle';
import { metricsSelectors } from 'store/metrics';
import { rbacSelectors } from 'store/rbac';
import { unitsLookupKey } from 'utils/format';

import AddRateModal from './addRateModal';
import { styles } from './costModelInfo.styles';
import Dialog from './dialog';
import UpdateRateModal from './updateRateModel';

interface PriceListTableProps extends WrappedComponentProps {
  assignees?: string[];
  costModel?: string;
  current: CostModel;
  costTypes: string[];
  error: string;
  fetchError: AxiosError;
  fetchStatus: FetchStatus;
  isDialogOpen: { deleteRate: boolean; updateRate: boolean; addRate: boolean };
  isGpuToggleEnabled?: boolean;
  isLoading: boolean;
  isWritePermission: boolean;
  metricsHash: MetricHash;
  updateCostModel: typeof costModelsActions.updateCostModel;
  setDialogOpen: typeof costModelsActions.setCostModelDialog;
}

interface PriceListTableState {
  deleteRate: any;
  index: number;
  sortBy: {
    index: number;
    direction: SortByDirection;
  };
  pagination: {
    perPage: number;
    page: number;
  };
}

class PriceListTable extends React.Component<PriceListTableProps, PriceListTableState> {
  protected defaultState: PriceListTableState = {
    deleteRate: null,
    index: -1,
    sortBy: {
      index: 0,
      direction: SortByDirection.asc,
    },
    pagination: {
      perPage: 10,
      page: 1,
    },
  };
  public state: PriceListTableState = { ...this.defaultState };

  public render() {
    const { fetchStatus, fetchError, intl, isDialogOpen, isGpuToggleEnabled, isWritePermission, metricsHash } =
      this.props;

    const getMetricLabel = m => {
      // Match message descriptor or default to API string
      const value = m.replace(/ /g, '_').toLowerCase();
      const label = intl.formatMessage(messages.metricValues, { value });
      return label ? label : m;
    };
    const getMeasurementLabel = m => {
      if (!m) {
        return '';
      }
      // Match message descriptor or default to API string
      const label = intl.formatMessage(messages.measurementValues, {
        value: m.toLowerCase().replace('-', '_'),
        count: 1,
      });
      return label ? label : m;
    };
    const metricOpts = Object.keys(metricsHash)
      .map(m => ({
        toString: () => getMetricLabel(m), // metric
        value: m,
      }))
      .sort((a, b) => (a?.toString() ?? '').localeCompare(b?.toString() ?? ''));

    const measurementOpts = uniqWith(
      metricOpts.reduce((acc, curr) => {
        const measures = Object.keys(metricsHash[curr.value]).map(m => ({
          toString: () => getMeasurementLabel(metricsHash[curr.value][m]?.label_measurement),
          value: metricsHash[curr.value][m]?.label_measurement,
        }));
        return [...acc, ...measures];
      }, []),
      (a, b) => (a?.toString() ?? '') === (b?.toString() ?? '')
    );

    const showAssignees = this.props.assignees && this.props.assignees.length > 0;
    const cm = this.props.costModel;
    const metric = this.state.deleteRate
      ? `${this.state.deleteRate.metric.label_metric}-${this.state.deleteRate.metric.label_measurement} (${this.state.deleteRate.metric.label_measurement_unit})`
      : '';
    return (
      <>
        <AddRateModal />
        <UpdateRateModal index={this.state.index} />
        <Dialog
          isSmall
          isOpen={isDialogOpen.deleteRate}
          title={intl.formatMessage(messages.priceListDeleteRate)}
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
              source_type: 'OCP',
              rates: [...current.rates.slice(0, index), ...current.rates.slice(index + 1)],
            };
            this.props.updateCostModel(current.uuid, newState, 'deleteRate');
          }}
          body={
            <>
              {intl.formatMessage(messages.priceListDeleteRateDesc, {
                metric: <b>{metric}</b>,
                costModel: <b>{cm}</b>,
                count: showAssignees ? 2 : 1,
              })}
              {showAssignees && (
                <List>
                  {this.props.assignees.map(p => (
                    <ListItem key={p}>{p}</ListItem>
                  ))}
                </List>
              )}
            </>
          }
          actionText={intl.formatMessage(messages.priceListDeleteRate)}
        />
        <WithPriceListSearch initialFilters={{ primary: 'metrics', metrics: [], measurements: [] }}>
          {({ search, setSearch, onRemove, onSelect, onClearAll }) => {
            const getMetric = value => intl.formatMessage(messages.metricValues, { value }) || value;
            const getMeasurement = (measurement, units) => {
              if (!measurement) {
                return '';
              }
              units = intl.formatMessage(messages.units, { units: unitsLookupKey(units) }) || units;
              return intl.formatMessage(messages.measurementValues, {
                value: measurement.toLowerCase().replace('-', '_'),
                units,
                count: 2,
              });
            };
            const from = (this.state.pagination.page - 1) * this.state.pagination.perPage;
            const to = this.state.pagination.page * this.state.pagination.perPage;

            let res = this.props.current.rates
              .map((r, i) => {
                return { ...r, stateIndex: i };
              })
              .filter(rate => search.metrics.length === 0 || search.metrics.includes(rate.metric.label_metric))
              .filter(
                rate => search.measurements.length === 0 || search.measurements.includes(rate.metric.label_measurement)
              )
              .sort((r1, r2) => {
                const projection =
                  this.state.sortBy.index === 1
                    ? (r: Rate) => getMetric(r.metric.label_metric)
                    : this.state.sortBy.index === 2
                      ? (r: Rate) => getMeasurement(r.metric.label_measurement, r.metric.label_measurement_unit)
                      : () => '';
                return compareBy(r1, r2, this.state.sortBy.direction, projection);
              });

            if (!isGpuToggleEnabled) {
              res = res.filter(item => item.metric.label_metric.toLowerCase() !== 'gpu');
            }
            const filtered = res.slice(from, to);

            return (
              <>
                <PriceListToolbar
                  primary={
                    <SelectWrapper
                      isDisabled={this.props.current.rates.length === 0}
                      onSelect={(_evt, selection) => setSearch({ primary: selection.value })}
                      options={[
                        {
                          toString: () => intl.formatMessage(messages.metric),
                          value: 'metrics',
                        },
                        {
                          toString: () => intl.formatMessage(messages.measurement),
                          value: 'measurements',
                        },
                      ]}
                      placeholder={intl.formatMessage(messages.measurementPlaceholder)}
                      selection={search.primary}
                    />
                  }
                  selected={search.primary}
                  secondaries={[
                    {
                      component: (
                        <SelectCheckboxWrapper
                          isDisabled={this.props.current.rates.length === 0}
                          onSelect={(_evt, selection) => onSelect('measurements', selection.value)}
                          options={measurementOpts}
                          placeholder={intl.formatMessage(messages.measurementPlaceholder)}
                          selections={search.measurements}
                        />
                      ),
                      name: 'measurements',
                      onRemove,
                      filters: search.measurements,
                    },
                    {
                      component: (
                        <SelectCheckboxWrapper
                          isDisabled={this.props.current.rates.length === 0}
                          onSelect={(_evt, selection) => onSelect('metrics', selection.value)}
                          options={metricOpts}
                          placeholder={intl.formatMessage(messages.metricPlaceholder)}
                          selections={search.metrics}
                        />
                      ),
                      name: 'metrics',
                      onRemove,
                      filters: search.metrics,
                    },
                  ]}
                  button={
                    <Button
                      isDisabled={!isWritePermission}
                      onClick={() =>
                        this.props.setDialogOpen({
                          name: 'addRate',
                          isOpen: true,
                        })
                      }
                    >
                      {intl.formatMessage(messages.priceListAddRate)}
                    </Button>
                  }
                  onClear={onClearAll}
                  pagination={
                    <Pagination
                      isCompact
                      itemCount={res.length}
                      perPage={this.state.pagination.perPage}
                      page={this.state.pagination.page}
                      onSetPage={(_evt, page) =>
                        this.setState({
                          pagination: { ...this.state.pagination, page },
                        })
                      }
                      onPerPageSelect={(_evt, perPage) => this.setState({ pagination: { page: 1, perPage } })}
                      titles={{
                        paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
                          title: intl.formatMessage(messages.priceList),
                          placement: 'top',
                        }),
                      }}
                    />
                  }
                />
                {fetchStatus !== FetchStatus.complete && <LoadingState />}
                {fetchStatus === FetchStatus.complete && fetchError && <Unavailable />}
                {fetchStatus === FetchStatus.complete &&
                  filtered.length === 0 &&
                  (search.metrics.length !== 0 || search.measurements.length !== 0) && <EmptyFilterState />}
                {fetchStatus === FetchStatus.complete &&
                  filtered.length === 0 &&
                  search.measurements.length === 0 &&
                  search.metrics.length === 0 && (
                    <Bullseye>
                      <EmptyState
                        headingLevel="h2"
                        icon={PlusCircleIcon}
                        titleText={intl.formatMessage(messages.priceListEmptyRate)}
                      >
                        <EmptyStateBody>{intl.formatMessage(messages.priceListEmptyRateDesc)}</EmptyStateBody>
                      </EmptyState>
                    </Bullseye>
                  )}
                {fetchStatus === FetchStatus.complete && filtered.length > 0 && (
                  <>
                    <RateTable
                      actions={[
                        {
                          title: intl.formatMessage(messages.priceListEditRate),
                          isDisabled: !isWritePermission,
                          // HACK: to display tooltip on disable
                          style: !isWritePermission ? { pointerEvents: 'auto' } : undefined,
                          ...(!isWritePermission && {
                            tooltipProps: {
                              content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
                            },
                          }),
                          onClick: (_evt, _rowIndex, rowData) => {
                            this.setState({
                              deleteRate: null,
                              index: rowData.data.stateIndex,
                            });
                            this.props.setDialogOpen({
                              name: 'updateRate',
                              isOpen: true,
                            });
                          },
                        },
                        {
                          title: intl.formatMessage(messages.delete),
                          isDisabled: !isWritePermission,
                          // HACK: to display tooltip on disable
                          style: !isWritePermission ? { pointerEvents: 'auto' } : {},
                          ...(!isWritePermission && {
                            tooltipProps: {
                              content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
                            },
                          }),
                          onClick: (_evt, _rowIndex, rowData) => {
                            const rowIndex = rowData.data.stateIndex;
                            this.setState({
                              deleteRate: filtered[rowIndex],
                              index: rowIndex + from,
                            });
                            this.props.setDialogOpen({
                              name: 'deleteRate',
                              isOpen: true,
                            });
                          },
                        },
                      ]}
                      tiers={filtered}
                      sortCallback={e => {
                        this.setState({
                          ...this.state,
                          sortBy: { ...e },
                        });
                      }}
                    />
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
                        this.setState({
                          pagination: { page: 1, perPage },
                        })
                      }
                      style={styles.pagination}
                      titles={{
                        paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
                          title: intl.formatMessage(messages.priceList),
                          placement: 'bottom',
                        }),
                      }}
                      variant="bottom"
                    />
                  </>
                )}
              </>
            );
          }}
        </WithPriceListSearch>
      </>
    );
  }
}

export default injectIntl(
  connect(
    createMapStateToProps(state => ({
      costTypes: metricsSelectors.costTypes(state),
      error: costModelsSelectors.updateError(state),
      fetchError: costModelsSelectors.error(state),
      fetchStatus: costModelsSelectors.status(state),
      isDialogOpen: costModelsSelectors.isDialogOpen(state)('rate'),
      isGpuToggleEnabled: FeatureToggleSelectors.selectIsGpuToggleEnabled(state),
      isLoading: costModelsSelectors.updateProcessing(state),
      isWritePermission: rbacSelectors.isCostModelWritePermission(state),
      metricsHash: metricsSelectors.metrics(state),
    })),
    {
      updateCostModel: costModelsActions.updateCostModel,
      setDialogOpen: costModelsActions.setCostModelDialog,
    }
  )(PriceListTable)
);

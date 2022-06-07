import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  List,
  ListItem,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { FileInvoiceDollarIcon } from '@patternfly/react-icons/dist/esm/icons/file-invoice-dollar-icon';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { CostModel } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import { AxiosError } from 'axios';
import messages from 'locales/messages';
import { EmptyFilterState } from 'pages/components/state/emptyFilterState/emptyFilterState';
import { LoadingState } from 'pages/components/state/loadingState/loadingState';
import { WithPriceListSearch } from 'pages/costModels/components/hoc/withPriceListSearch';
import { PriceListToolbar } from 'pages/costModels/components/priceListToolbar';
import { RateTable } from 'pages/costModels/components/rateTable';
import { CheckboxSelector } from 'pages/costModels/components/toolbar/checkboxSelector';
import { PrimarySelector } from 'pages/costModels/components/toolbar/primarySelector';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { metricsSelectors } from 'store/metrics';
import { rbacSelectors } from 'store/rbac';

import AddRateModal from './addRateModal';
import Dialog from './dialog';
import UpdateRateModal from './updateRateModel';

interface State {
  deleteRate: any;
  index: number;
}

interface Props extends WrappedComponentProps {
  assignees?: string[];
  costModel?: string;
  current: CostModel;
  costTypes: string[];
  error: string;
  isDialogOpen: { deleteRate: boolean; updateRate: boolean; addRate: boolean };
  isLoading: boolean;
  isWritePermission: boolean;
  fetchError: AxiosError;
  fetchStatus: FetchStatus;
  metricsHash: MetricHash;
  updateCostModel: typeof costModelsActions.updateCostModel;
  setDialogOpen: typeof costModelsActions.setCostModelDialog;
}

class PriceListTable extends React.Component<Props, State> {
  public state = {
    deleteRate: null,
    index: -1,
  };
  public render() {
    const { fetchStatus, fetchError, intl, isDialogOpen, isWritePermission, metricsHash } = this.props;

    const getMetricLabel = m => {
      // Match message descriptor or default to API string
      const value = m.replace(/ /g, '_').toLowerCase();
      const label = intl.formatMessage(messages.MetricValues, { value });
      return label ? label : m;
    };
    const getMeasurementLabel = m => {
      // Match message descriptor or default to API string
      const label = intl.formatMessage(messages.MeasurementValues, {
        value: m.toLowerCase().replace('-', '_'),
        count: 1,
      });
      return label ? label : m;
    };
    const metricOpts = Object.keys(metricsHash).map(m => ({
      label: getMetricLabel(m), // metric
      value: m,
    }));
    const measurementOpts = metricOpts.reduce((acc, curr) => {
      const measurs = Object.keys(metricsHash[curr.value])
        .filter(m => !acc.map(i => i.value).includes(m))
        .map(m => ({ label: getMeasurementLabel(m), value: m }));
      return [...acc, ...measurs];
    }, []);

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
          title={intl.formatMessage(messages.PriceListDeleteRate)}
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
              {intl.formatMessage(messages.PriceListDeleteRateDesc, {
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
          actionText={intl.formatMessage(messages.PriceListDeleteRate)}
        />
        <WithPriceListSearch initialFilters={{ primary: 'metrics', metrics: [], measurements: [] }}>
          {({ search, setSearch, onRemove, onSelect, onClearAll }) => {
            const filtered = this.props.current.rates
              .filter(rate => search.metrics.length === 0 || search.metrics.includes(rate.metric.label_metric))
              .filter(
                rate => search.measurements.length === 0 || search.measurements.includes(rate.metric.label_measurement)
              );
            return (
              <>
                <PriceListToolbar
                  primary={
                    <PrimarySelector
                      isDisabled={this.props.current.rates.length === 0}
                      primary={search.primary}
                      setPrimary={(primary: string) => setSearch({ primary })}
                      options={[
                        {
                          label: intl.formatMessage(messages.Metric),
                          value: 'metrics',
                        },
                        {
                          label: intl.formatMessage(messages.Measurement),
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
                          isDisabled={this.props.current.rates.length === 0}
                          placeholderText={intl.formatMessage(messages.MeasurementPlaceholder)}
                          selections={search.measurements}
                          setSelections={(selection: string) => onSelect('measurements', selection)}
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
                          isDisabled={this.props.current.rates.length === 0}
                          placeholderText={intl.formatMessage(messages.MetricPlaceholder)}
                          selections={search.metrics}
                          setSelections={(selection: string) => onSelect('metrics', selection)}
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
                      isDisabled={!isWritePermission}
                      onClick={() =>
                        this.props.setDialogOpen({
                          name: 'addRate',
                          isOpen: true,
                        })
                      }
                    >
                      {intl.formatMessage(messages.PriceListAddRate)}
                    </Button>
                  }
                  onClear={onClearAll}
                  pagination
                />
                {fetchStatus !== FetchStatus.complete && <LoadingState />}
                {fetchStatus === FetchStatus.complete && Boolean(fetchError) && <Unavailable />}
                {fetchStatus === FetchStatus.complete &&
                  filtered.length === 0 &&
                  (search.metrics.length !== 0 || search.measurements.length !== 0) && <EmptyFilterState />}
                {fetchStatus === FetchStatus.complete &&
                  filtered.length === 0 &&
                  search.measurements.length === 0 &&
                  search.metrics.length === 0 && (
                    <Bullseye>
                      <EmptyState>
                        <EmptyStateIcon icon={FileInvoiceDollarIcon} />
                        <Title headingLevel="h2" size={TitleSizes.lg}>
                          {intl.formatMessage(messages.PriceListEmptyRate)}
                        </Title>
                        <EmptyStateBody>{intl.formatMessage(messages.PriceListEmptyRateDesc)}</EmptyStateBody>
                      </EmptyState>
                    </Bullseye>
                  )}
                {fetchStatus === FetchStatus.complete && filtered.length > 0 && (
                  <>
                    <RateTable
                      actions={[
                        {
                          title: intl.formatMessage(messages.PriceListEditRate),
                          isDisabled: !isWritePermission,
                          // HACK: to display tooltip on disable
                          style: !isWritePermission ? { pointerEvents: 'auto' } : undefined,
                          tooltip: !isWritePermission ? (
                            <div>{intl.formatMessage(messages.CostModelsReadOnly)}</div>
                          ) : undefined,
                          onClick: (_evt, _rowIndex, rowData) => {
                            this.setState({
                              deleteRate: null,
                              index: rowData.data.index,
                            });
                            this.props.setDialogOpen({
                              name: 'updateRate',
                              isOpen: true,
                            });
                          },
                        },
                        {
                          title: intl.formatMessage(messages.Delete),
                          isDisabled: !isWritePermission,
                          // HACK: to display tooltip on disable
                          style: !isWritePermission ? { pointerEvents: 'auto' } : {},
                          tooltip: !isWritePermission ? (
                            <div>{intl.formatMessage(messages.CostModelsReadOnly)}</div>
                          ) : undefined,
                          onClick: (_evt, _rowIndex, rowData) => {
                            const rowIndex = rowData.data.index;
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
                      tiers={filtered}
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
      isLoading: costModelsSelectors.updateProcessing(state),
      error: costModelsSelectors.updateError(state),
      isDialogOpen: costModelsSelectors.isDialogOpen(state)('rate'),
      fetchError: costModelsSelectors.error(state),
      fetchStatus: costModelsSelectors.status(state),
      metricsHash: metricsSelectors.metrics(state),
      costTypes: metricsSelectors.costTypes(state),
      isWritePermission: rbacSelectors.isCostModelWritePermission(state),
    })),
    {
      updateCostModel: costModelsActions.updateCostModel,
      setDialogOpen: costModelsActions.setCostModelDialog,
    }
  )(PriceListTable)
);

import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  List,
  ListItem,
  Pagination,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemVariant,
} from '@patternfly/react-core';
import { FileInvoiceDollarIcon } from '@patternfly/react-icons/dist/js/icons/file-invoice-dollar-icon';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { CostModel } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import { AxiosError } from 'axios';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import { WithPriceListSearch } from 'pages/costModels/components/hoc/withPriceListSearch';
import { PriceListToolbar } from 'pages/costModels/components/priceListToolbar';
import { RateTable } from 'pages/costModels/components/rateTable';
import { CheckboxSelector } from 'pages/costModels/components/toolbar/checkboxSelector';
import { PrimarySelector } from 'pages/costModels/components/toolbar/primarySelector';
import React from 'react';
import { Trans, WithTranslation, withTranslation } from 'react-i18next';
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
  pagination: {
    perPage: number;
    page: number;
  };
}

interface Props extends WithTranslation {
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
  isWritePermission: boolean;
  costTypes: string[];
}

class PriceListTable extends React.Component<Props, State> {
  public state = {
    deleteRate: null,
    index: -1,
    pagination: {
      perPage: 10,
      page: 1,
    },
  };
  public render() {
    const { t, fetchStatus, fetchError, isDialogOpen, metricsHash, isWritePermission } = this.props;
    const metricOpts = Object.keys(metricsHash).map(m => ({
      label: m,
      value: m,
    }));
    const measurementOpts = metricOpts.reduce((acc, curr) => {
      const measurs = Object.keys(metricsHash[curr.value])
        .filter(m => !acc.map(i => i.value).includes(m))
        .map(m => ({ label: m, value: m }));
      return [...acc, ...measurs];
    }, []);

    const rateComponent = <b>dummyChild</b>;
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
          title={t('dialog.rate.title')}
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
              <Trans i18nKey="dialog.rate.body" components={[rateComponent, rateComponent]} values={{ metric, cm }} />
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
        <WithPriceListSearch initialFilters={{ primary: 'metrics', metrics: [], measurements: [] }}>
          {({ search, setSearch, onRemove, onSelect, onClearAll }) => {
            const from = (this.state.pagination.page - 1) * this.state.pagination.perPage;
            const to = this.state.pagination.page * this.state.pagination.perPage;

            const res = this.props.current.rates
              .filter(rate => search.metrics.length === 0 || search.metrics.includes(rate.metric.label_metric))
              .filter(
                rate => search.measurements.length === 0 || search.measurements.includes(rate.metric.label_measurement)
              );
            const filtered = res.slice(from, to);
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
                          isDisabled={this.props.current.rates.length === 0}
                          placeholderText={t('toolbar.pricelist.measurement_placeholder')}
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
                          placeholderText={t('toolbar.pricelist.metric_placeholder')}
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
                      {t('toolbar.pricelist.add_rate')}
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
                    />
                  }
                />
                {fetchStatus !== FetchStatus.complete && <LoadingState />}
                {fetchStatus === FetchStatus.complete && Boolean(fetchError) && <Unavailable />}
                {fetchStatus === FetchStatus.complete &&
                  filtered.length === 0 &&
                  (search.metrics.length !== 0 || search.measurements.length !== 0) && (
                    <EmptyFilterState filter={t('cost_models_wizard.price_list.toolbar_top_results_aria_label')} />
                  )}
                {fetchStatus === FetchStatus.complete &&
                  filtered.length === 0 &&
                  search.measurements.length === 0 &&
                  search.metrics.length === 0 && (
                    <Bullseye>
                      <EmptyState>
                        <EmptyStateIcon icon={FileInvoiceDollarIcon} />
                        <Title headingLevel="h2" size="lg">
                          {t('cost_models_details.empty_state_rate.title')}
                        </Title>
                        <EmptyStateBody>{t('cost_models_details.empty_state_rate.description')}</EmptyStateBody>
                      </EmptyState>
                    </Bullseye>
                  )}
                {fetchStatus === FetchStatus.complete && filtered.length > 0 && (
                  <>
                    <RateTable
                      t={t}
                      tiers={filtered}
                      actions={[
                        {
                          title: t('cost_models_wizard.price_list.update_button'),
                          isDisabled: !isWritePermission,
                          // HACK: to display tooltip on disable
                          style: !isWritePermission ? { pointerEvents: 'auto' } : undefined,
                          tooltip: !isWritePermission ? <div>{t('cost_models.read_only_tooltip')}</div> : undefined,
                          onClick: (_evt, _rowIndex, rowData) => {
                            this.setState({
                              deleteRate: null,
                              index: rowData.data.index + from,
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
                          style: !isWritePermission ? { pointerEvents: 'auto' } : {},
                          tooltip: !isWritePermission ? <div>{t('cost_models.read_only_tooltip')}</div> : undefined,
                          onClick: (_evt, _rowIndex, rowData) => {
                            const rowIndex = rowData.data.index;
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
                    />

                    <Toolbar id="price-list-toolbar-bottom">
                      <ToolbarContent>
                        <ToolbarItem variant={ToolbarItemVariant.pagination}>
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
                            variant="bottom"
                          />
                        </ToolbarItem>
                      </ToolbarContent>
                    </Toolbar>
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

export default connect(
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
)(withTranslation()(PriceListTable));

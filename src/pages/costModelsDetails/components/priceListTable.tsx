import {
  Button,
  Chip,
  DataList,
  DropdownItem,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  List,
  ListItem,
  TextInput,
  Title,
  TitleSize,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  ToolbarSection,
} from '@patternfly/react-core';
import { FileInvoiceDollarIcon } from '@patternfly/react-icons';
import { CostModel } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import { Rate } from 'api/rates';
import { AxiosError } from 'axios';
import { EmptyFilterState } from 'components/state/emptyFilterState/emptyFilterState';
import { ErrorState } from 'components/state/errorState/errorState';
import { LoadingState } from 'components/state/loadingState/loadingState';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { metricsSelectors } from 'store/metrics';
import AddRateModel from './addRateModal';
import CostModelRateItem from './costModelRateItem';
import Dialog from './dialog';
import Dropdown from './dropdown';
import UpdateRateModel from './updateRateModel';

interface State {
  filter: string;
  current: string;
  deleteRate: Rate;
  index: number;
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
}

class PriceListTable extends React.Component<Props, State> {
  public state = {
    filter: '',
    current: '',
    deleteRate: null,
    index: -1,
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
    } = this.props;
    const res = rates.filter(iter =>
      iter.metric.name.toLowerCase().includes(this.state.filter.toLowerCase())
    );
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
        <Toolbar style={{ marginBottom: '10px', marginTop: '10px' }}>
          <ToolbarSection
            aria-label={t(
              'cost_models_wizard.price_list.toolbar_top_aria_label'
            )}
          >
            <ToolbarGroup>
              <ToolbarItem>
                <TextInput
                  id="filter-price-list-text-box"
                  type="text"
                  placeholder={t(
                    'cost_models_wizard.price_list.filter_placeholder'
                  )}
                  value={this.state.current}
                  onChange={value => {
                    this.setState({ current: value });
                  }}
                  onKeyPress={event => {
                    if (event.key !== 'Enter') {
                      return;
                    }
                    this.setState({
                      filter: this.state.current,
                      current: '',
                    });
                  }}
                />
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup>
              <ToolbarItem>
                <Button
                  isDisabled={rates && rates.length === maxRate}
                  onClick={() =>
                    this.props.setDialogOpen({
                      name: 'addRate',
                      isOpen: true,
                    })
                  }
                >
                  {t('cost_models_details.add_rate')}
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarSection>
          <ToolbarSection
            aria-label={t(
              'cost_models_wizard.price_list.toolbar_top_results_aria_label'
            )}
          >
            <ToolbarGroup>
              <ToolbarItem>
                <Title size={TitleSize.md}>
                  {t('cost_models_wizard.price_list.results_text', {
                    num: res.length,
                  })}
                </Title>
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup>
              <ToolbarItem>
                {this.state.filter && (
                  <Chip
                    style={{ paddingRight: '20px' }}
                    onClick={() => this.setState({ filter: '' })}
                  >
                    {this.state.filter}
                  </Chip>
                )}
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarSection>
        </Toolbar>
        {fetchStatus !== FetchStatus.complete && <LoadingState />}
        {fetchStatus === FetchStatus.complete && Boolean(fetchError) && (
          <ErrorState error={fetchError} />
        )}
        {fetchStatus === FetchStatus.complete &&
          res.length === 0 &&
          this.state.filter !== '' && (
            <EmptyFilterState
              filter={t(
                'cost_models_wizard.price_list.toolbar_top_results_aria_label'
              )}
            />
          )}
        {fetchStatus === FetchStatus.complete &&
          res.length === 0 &&
          this.state.filter === '' && (
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
        {fetchStatus === FetchStatus.complete && res.length > 0 && (
          <DataList
            aria-label={t('cost_models_wizard.price_list.data_list_aria_label')}
          >
            {res.map((tier, ix) => {
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
                        <DropdownItem
                          key="edit"
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
                        </DropdownItem>,
                        <DropdownItem
                          key="delete"
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
                          style={{ color: 'red' }}
                        >
                          {t('cost_models_wizard.price_list.delete_button')}
                        </DropdownItem>,
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
  })),
  {
    updateCostModel: costModelsActions.updateCostModel,
    setDialogOpen: costModelsActions.setCostModelDialog,
  }
)(translate()(PriceListTable));

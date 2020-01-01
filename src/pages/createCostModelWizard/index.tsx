import { Wizard } from '@patternfly/react-core';
import { addCostModel } from 'api/costModels';
import { metricName } from 'pages/costModelsDetails/components/priceListTier';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { costModelsActions } from 'store/costModels';
import Dialog from '../costModelsDetails/components/dialog';
import { fetchSources as apiSources } from './api';
import { CostModelContext } from './context';
import { parseApiError } from './parseError';
import { stepsHash, validatorsHash } from './steps';

const InternalWizardBase = ({
  t,
  isProcess,
  isSuccess,
  closeFnc,
  isOpen,
  onMove,
  validators,
  steps,
  current = 1,
  context,
  setError,
  setSuccess,
  updateCostModel,
}) => {
  const newSteps = steps.map((step, ix) => {
    return {
      ...step,
      canJumpTo: current > ix,
    };
  });
  newSteps[current - 1].enableNext = validators[current - 1](context);
  if (current === steps.length && context.type !== '') {
    newSteps[current - 1].nextButtonText = t(
      'cost_models_wizard.review.create_button'
    );
  }
  return isOpen ? (
    <Wizard
      isOpen
      title={t('cost_models_wizard.title')}
      description={t('cost_models_wizard.description')}
      steps={newSteps}
      startAtStep={current}
      onNext={onMove}
      onBack={onMove}
      onClose={closeFnc}
      footer={isSuccess || isProcess ? <div /> : null}
      onSave={() => {
        const { name, type, tiers, markup, description, sources } = context;
        addCostModel({
          name,
          source_type: type,
          description,
          rates: tiers.map(tr => ({
            metric: { name: metricName(tr.metric, tr.measurement) },
            tiered_rates: [{ value: tr.rate, unit: 'USD' }],
          })),
          markup: {
            value: markup,
            unit: 'percent',
          },
          provider_uuids: sources.map(src => src.uuid),
        })
          .then(resp => {
            setSuccess();
            updateCostModel();
          })
          .catch(err => setError(parseApiError(err)));
      }}
    />
  ) : null;
};

const InternalWizard = translate()(InternalWizardBase);

const defaultState = {
  step: 1,
  type: '',
  name: '',
  description: '',
  markup: '0',
  filterName: '',
  sources: [],
  error: null,
  apiError: null,
  dataFetched: false,
  query: {},
  page: 1,
  perPage: 10,
  total: 0,
  loading: false,
  tiers: [],
  priceListCurrent: {
    metric: '',
    measurement: '',
    rate: '',
    justSaved: false,
  },
  priceListPagination: {
    page: 1,
    perPage: 4,
  },
  createError: null,
  createSuccess: false,
  createProcess: false,
  isDialogOpen: false,
};

interface State {
  step: number;
  type: string;
  name: string;
  description: string;
  markup: string;
  filterName: string;
  sources: any[];
  error: any;
  apiError: any;
  dataFetched: boolean;
  query: object;
  page: number;
  perPage: number;
  total: number;
  loading: boolean;
  tiers: any[];
  priceListCurrent: {
    metric: string;
    measurement: string;
    rate: string;
    justSaved: boolean;
  };
  priceListPagination: {
    page: number;
    perPage: number;
  };
  createError: any;
  createSuccess: boolean;
  createProcess: boolean;
  isDialogOpen: boolean;
}

interface Props extends InjectedTranslateProps {
  isOpen: boolean;
  closeWizard: () => void;
  openWizard: () => void;
  fetch: typeof costModelsActions.fetchCostModels;
}

class CostModelWizardBase extends React.Component<Props, State> {
  public state = defaultState;
  public render() {
    const { t } = this.props;
    return (
      <CostModelContext.Provider
        value={{
          step: this.state.step,
          type: this.state.type,
          onTypeChange: value =>
            this.setState({ type: value, dataFetched: false, loading: false }),
          name: this.state.name,
          onNameChange: value => this.setState({ name: value }),
          description: this.state.description,
          onDescChange: value => this.setState({ description: value }),
          markup: this.state.markup,
          onMarkupChange: value => this.setState({ markup: value }),
          error: this.state.error,
          apiError: this.state.apiError,
          sources: this.state.sources,
          dataFetched: this.state.dataFetched,
          setSources: sources =>
            this.setState({ sources, dataFetched: true, loading: false }),
          onSourceSelect: (rowId, isSelected) => {
            if (rowId === -1) {
              return this.setState({
                sources: this.state.sources.map(s => ({
                  ...s,
                  selected: isSelected,
                })),
              });
            }
            const newSources = [...this.state.sources];
            newSources[rowId].selected = isSelected;
            return this.setState({ sources: newSources });
          },
          total: this.state.total,
          page: this.state.page,
          onPageChange: (_evt, page) => this.setState({ page }),
          onPerPageChange: (_evt, perPage) =>
            this.setState({ page: 1, perPage }),
          perPage: this.state.perPage,
          filterName: this.state.filterName,
          onFilterChange: value => this.setState({ filterName: value }),
          query: this.state.query,
          clearQuery: () => this.setState({ query: {} }),
          loading: this.state.loading,
          tiers: this.state.tiers,
          priceListCurrent: this.state.priceListCurrent,
          priceListPagination: {
            page: this.state.priceListPagination.page,
            perPage: this.state.priceListPagination.perPage,
            onPageSet: (_evt, page) =>
              this.setState({
                priceListPagination: {
                  ...this.state.priceListPagination,
                  page,
                },
              }),
            onPerPageSet: (_evt, perPage) =>
              this.setState({
                priceListPagination: {
                  page: 1,
                  perPage,
                },
              }),
          },
          updateCurrentPL: (key: string, value: string) => {
            this.setState({
              priceListCurrent: {
                ...this.state.priceListCurrent,
                [key]: value,
              },
            });
          },
          goToAddPL: () =>
            this.setState({
              priceListCurrent: {
                ...this.state.priceListCurrent,
                justSaved: false,
              },
            }),
          removeRate: rowIx => {
            this.setState({
              tiers: [
                ...this.state.tiers.slice(0, rowIx),
                ...this.state.tiers.slice(rowIx + 1),
              ],
              priceListCurrent: {
                ...this.state.priceListCurrent,
                justSaved: this.state.tiers.length !== 1 || rowIx !== 0,
              },
            });
          },
          submitCurrentPL: () => {
            const item = this.state.tiers
              .map((tier, ix) => ({
                metric: tier.metric,
                measurement: tier.measurement,
                index: ix,
              }))
              .find(
                tier =>
                  this.state.priceListCurrent.metric === tier.metric &&
                  this.state.priceListCurrent.measurement === tier.measurement
              );
            const newTiers = item
              ? [
                  ...this.state.tiers.slice(0, item.index),
                  ...this.state.tiers.slice(item.index + 1),
                ]
              : this.state.tiers;
            this.setState({
              priceListCurrent: {
                metric: '',
                measurement: '',
                rate: '',
                justSaved: true,
              },
              tiers: [
                ...newTiers,
                {
                  metric: this.state.priceListCurrent.metric,
                  measurement: this.state.priceListCurrent.measurement,
                  rate: this.state.priceListCurrent.rate,
                },
              ],
            });
          },
          fetchSources: (type, query, page, perPage) => {
            this.setState(
              { loading: true, apiError: null, filterName: '' },
              () =>
                apiSources({ type, query, page, perPage })
                  .then(resp =>
                    this.setState({
                      sources: resp,
                      query,
                      page,
                      perPage,
                      loading: false,
                      dataFetched: true,
                      filterName: '',
                    })
                  )
                  .catch(err =>
                    this.setState({
                      apiError: err,
                      loading: false,
                      dataFetched: true,
                      filterName: '',
                    })
                  )
            );
          },
          createSuccess: this.state.createSuccess,
          createError: this.state.createError,
          createProcess: this.state.createProcess,
          onClose: () =>
            this.setState({ ...defaultState }, this.props.closeWizard),
        }}
      >
        <InternalWizard
          isProcess={this.state.createProcess}
          isSuccess={this.state.createSuccess}
          closeFnc={() => {
            this.setState({ isDialogOpen: true }, this.props.closeWizard);
          }}
          isOpen={this.props.isOpen}
          onMove={curr => this.setState({ step: curr.id })}
          steps={stepsHash(t)[this.state.type]}
          current={this.state.step}
          validators={validatorsHash[this.state.type]}
          setError={errorMessage =>
            this.setState({ createError: errorMessage })
          }
          setSuccess={() =>
            this.setState({ createError: null, createSuccess: true })
          }
          updateCostModel={() => this.props.fetch()}
          context={{
            name: this.state.name,
            type: this.state.type,
            description: this.state.description,
            markup: this.state.markup,
            tiers: this.state.tiers,
            priceListCurrent: this.state.priceListCurrent,
            sources: this.state.sources.filter(src => src.selected),
          }}
        />
        <Dialog
          isOpen={this.state.isDialogOpen}
          isSmall
          onClose={() => {
            this.setState({ isDialogOpen: false }, this.props.openWizard);
          }}
          onProceed={() => this.setState({ ...defaultState })}
          title={t('cost_models_wizard.confirm.title')}
          body={<div>{t('cost_models_wizard.confirm.message')}</div>}
          actionText={t('cost_models_wizard.confirm.close')}
        />
      </CostModelContext.Provider>
    );
  }
}

export const CostModelWizard = connect(
  undefined,
  { fetch: costModelsActions.fetchCostModels }
)(translate()(CostModelWizardBase));

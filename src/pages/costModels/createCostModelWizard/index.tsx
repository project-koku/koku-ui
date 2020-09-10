import {
  Title,
  TitleSizes,
  Wizard,
  WizardStepFunctionType,
} from '@patternfly/react-core';
import { Button, Modal } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import { addCostModel } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions } from 'store/costModels';
import { metricsSelectors } from 'store/metrics';
import { formatValue } from 'utils/formatValue';

import { fetchSources as apiSources } from './api';
import { CostModelContext } from './context';
import { parseApiError } from './parseError';
import { stepsHash, validatorsHash } from './steps';

interface InternalWizardBaseProps extends InjectedTranslateProps {
  isProcess: boolean;
  isSuccess: boolean;
  closeFnc: () => void;
  isOpen: boolean;
  onMove: WizardStepFunctionType;
  validators: ((any) => boolean)[];
  steps: any[];
  current: number;
  context: any;
  setError: (string) => void;
  setSuccess: () => void;
  updateCostModel: () => void;
  metricsHash: MetricHash;
}

const InternalWizardBase: React.SFC<InternalWizardBaseProps> = ({
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
  metricsHash,
}) => {
  const newSteps = steps.map((step, ix) => {
    return {
      ...step,
      canJumpTo: current > ix,
    };
  });
  newSteps[current - 1].enableNext = validators[current - 1](context);
  const isAddingRate =
    context.type === 'OCP' &&
    current === 2 &&
    !validators[current - 1](context);
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
      footer={isSuccess || isProcess || isAddingRate ? <div /> : null}
      onSave={() => {
        const { name, type, tiers, markup, description, sources } = context;
        addCostModel({
          name,
          source_type: type,
          description,
          rates: tiers.map(tr => ({
            metric: {
              name:
                metricsHash &&
                metricsHash[tr.metric] &&
                metricsHash[tr.metric][tr.measurement].metric,
            },
            tiered_rates: [{ value: tr.rate, unit: 'USD' }],
            cost_type: tr.costType,
          })),
          markup: {
            value: markup,
            unit: 'percent',
          },
          source_uuids: sources.map(src => src.uuid),
        })
          .then(() => {
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
  markup: '0.00',
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
    justSaved: true,
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
  query: { name?: string[] };
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
  metricsHash: MetricHash;
}

class CostModelWizardBase extends React.Component<Props, State> {
  public state = defaultState;
  public render() {
    const { metricsHash, t } = this.props;
    /*
     */
    const closeConfirmDialog = () => {
      this.setState({ isDialogOpen: false }, this.props.openWizard);
    };
    const CancelButton = (
      <Button key="cancel" variant="link" onClick={closeConfirmDialog}>
        {t('cost_models_wizard.confirm.cancel')}
      </Button>
    );
    const OkButton = (
      <Button
        key="ok"
        variant="primary"
        onClick={() => this.setState({ ...defaultState })}
      >
        {t('cost_models_wizard.confirm.ok')}
      </Button>
    );

    return (
      <CostModelContext.Provider
        value={{
          metricsHash,
          step: this.state.step,
          type: this.state.type,
          onTypeChange: value =>
            this.setState({ type: value, dataFetched: false, loading: false }),
          name: this.state.name,
          onNameChange: value => this.setState({ name: value }),
          description: this.state.description,
          onDescChange: value => this.setState({ description: value }),
          markup: this.state.markup,
          onMarkupChange: value => {
            const markupDecimal = Number(value);
            const dx = value.split('').findIndex(c => c === '.');
            if (!isNaN(markupDecimal) && dx > -1 && value.length - dx - 1 > 2) {
              this.setState({
                markup: formatValue(markupDecimal, 'markup', {
                  fractionDigits: 2,
                }) as string,
              });
              return;
            }
            this.setState({ markup: value });
          },
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
          submitTiers: (tiers: any) => {
            this.setState({
              tiers,
            });
          },
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
          goToAddPL: (value?: boolean) =>
            this.setState({
              priceListCurrent: {
                ...this.state.priceListCurrent,
                justSaved: value ? value : false,
              },
            }),
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
          metricsHash={metricsHash}
          isProcess={this.state.createProcess}
          isSuccess={this.state.createSuccess}
          closeFnc={() => {
            if (
              (this.state.type === 'OCP' &&
                this.state.step > 1 &&
                this.state.tiers.length > 0) ||
              (this.state.type !== 'OCP' && this.state.step > 2)
            ) {
              this.setState({ isDialogOpen: true }, this.props.closeWizard);
            } else {
              this.setState({ ...defaultState }, this.props.closeWizard);
            }
          }}
          isOpen={this.props.isOpen}
          onMove={curr => this.setState({ step: Number(curr.id) })}
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
        <Modal
          isOpen={this.state.isDialogOpen}
          header={
            <Title headingLevel="h1" size={TitleSizes['2xl']}>
              <ExclamationTriangleIcon color="orange" />{' '}
              {t('cost_models_wizard.confirm.title')}
            </Title>
          }
          onClose={closeConfirmDialog}
          actions={[OkButton, CancelButton]}
          variant="small"
        >
          {t('cost_models_wizard.confirm.message')}
        </Modal>
      </CostModelContext.Provider>
    );
  }
}

export const CostModelWizard = connect(
  createMapStateToProps(state => ({
    metricsHash: metricsSelectors.metrics(state),
  })),
  { fetch: costModelsActions.fetchCostModels }
)(translate()(CostModelWizardBase));

import { Title, TitleSizes, Wizard, WizardStepFunctionType } from '@patternfly/react-core';
import { Button, Modal } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { addCostModel } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import { Rate } from 'api/rates';
import messages from 'locales/messages';
import { cloneDeep } from 'lodash';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions } from 'store/costModels';
import { metricsSelectors } from 'store/metrics';
import { unFormat } from 'utils/format';

import { fetchSources as apiSources } from './api';
import { CostModelContext } from './context';
import GeneralInformation from './generalInformation';
import Markup from './markup';
import { parseApiError } from './parseError';
import PriceList from './priceList';
import Review from './review';
import Sources from './sources';
import { validatorsHash } from './steps';

interface InternalWizardBaseProps extends WrappedComponentProps {
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

// Update tiers currency
const updateTiersCurrency = (tiers, currencyUnits = 'USD') => {
  const rates = cloneDeep(tiers);

  rates.map(val => {
    if (val.tiered_rates) {
      for (const rate of val.tiered_rates) {
        rate.unit = currencyUnits;
        rate.usage.unit = currencyUnits;
      }
    }
    if (val.tag_rates) {
      for (const rate of val.tag_rates.tag_values) {
        rate.unit = currencyUnits;
      }
    }
  });
  return rates;
};

const InternalWizardBase: React.FC<InternalWizardBaseProps> = ({
  intl,
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
  const isAddingRate = context.type === 'OCP' && current === 2 && !validators[current - 1](context);
  if (current === steps.length && context.type !== '') {
    newSteps[current - 1].nextButtonText = intl.formatMessage(messages.create);
  }

  return isOpen ? (
    <Wizard
      isOpen
      title={intl.formatMessage(messages.createCostModelTitle)}
      description={intl.formatMessage(messages.createCostModelDesc)}
      steps={newSteps}
      startAtStep={current}
      onNext={onMove}
      onBack={onMove}
      onGoToStep={onMove}
      onClose={closeFnc}
      footer={isSuccess || isProcess || isAddingRate ? <div /> : null}
      onSave={() => {
        const { currency, description, distribution, isDiscount, markup, name, type, tiers, sources } = context;
        addCostModel({
          name,
          source_type: type,
          currency,
          description,
          distribution,
          rates: tiers,
          markup: {
            value: `${isDiscount ? '-' : ''}${unFormat(markup)}`,
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

const InternalWizard = injectIntl(InternalWizardBase);

const defaultState = {
  apiError: null,
  checked: {},
  createError: null,
  createProcess: false,
  createSuccess: false,
  currencyUnits: 'USD',
  dataFetched: false,
  description: '',
  distribution: 'cpu',
  dirtyName: false,
  error: null,
  filterName: '',
  isDialogOpen: false,
  isDiscount: false,
  loading: false,
  markup: '0',
  name: '',
  page: 1,
  perPage: 10,
  priceListCurrent: {
    metric: '',
    measurement: '',
    rate: '',
    justSaved: true,
  },
  priceListPagination: {
    page: 1,
    perPage: 10,
  },
  query: {},
  sources: [],
  step: 1,
  tiers: [] as Rate[],
  total: 0,
  type: '',
};

interface State {
  apiError: any;
  checked: any;
  createError: any;
  createProcess: boolean;
  createSuccess: boolean;
  currencyUnits: string;
  dataFetched: boolean;
  description: string;
  dirtyName: boolean;
  distribution: string;
  error: any;
  filterName: string;
  isDialogOpen: boolean;
  isDiscount: boolean;
  loading: boolean;
  markup: string;
  name: string;
  page: number;
  perPage: number;
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
  query: { name?: string[] };
  step: number;
  sources: any[];
  tiers: Rate[];
  total: number;
  type: string;
}

interface Props extends WrappedComponentProps {
  isOpen: boolean;
  closeWizard: () => void;
  openWizard: () => void;
  fetch: typeof costModelsActions.fetchCostModels;
  metricsHash: MetricHash;
}

class CostModelWizardBase extends React.Component<Props, State> {
  public state = defaultState;
  public render() {
    const { metricsHash, intl } = this.props;
    /*
     */
    const closeConfirmDialog = () => {
      this.setState({ isDialogOpen: false }, this.props.openWizard);
    };

    const stepsHash = () => ({
      '': [
        {
          id: 1,
          name: intl.formatMessage(messages.costModelsWizardStepsGenInfo),
          component: <GeneralInformation />,
        },
      ],
      Azure: [
        {
          id: 1,
          name: intl.formatMessage(messages.costModelsWizardStepsGenInfo),
          component: <GeneralInformation />,
        },
        {
          id: 2,
          name: intl.formatMessage(messages.costCalculations),
          component: <Markup />,
        },
        {
          id: 3,
          name: intl.formatMessage(messages.costModelsWizardStepsSources),
          component: <Sources />,
        },
        {
          id: 4,
          name: intl.formatMessage(messages.costModelsWizardStepsReview),
          component: <Review />,
        },
      ],
      AWS: [
        {
          id: 1,
          name: intl.formatMessage(messages.costModelsWizardStepsGenInfo),
          component: <GeneralInformation />,
        },
        {
          id: 2,
          name: intl.formatMessage(messages.costCalculations),
          component: <Markup />,
        },
        {
          id: 3,
          name: intl.formatMessage(messages.costModelsWizardStepsSources),
          component: <Sources />,
        },
        {
          id: 4,
          name: intl.formatMessage(messages.costModelsWizardStepsReview),
          component: <Review />,
        },
      ],
      GCP: [
        {
          id: 1,
          name: intl.formatMessage(messages.costModelsWizardStepsGenInfo),
          component: <GeneralInformation />,
        },
        {
          id: 2,
          name: intl.formatMessage(messages.costCalculations),
          component: <Markup />,
        },
        {
          id: 3,
          name: intl.formatMessage(messages.costModelsWizardStepsSources),
          component: <Sources />,
        },
        {
          id: 4,
          name: intl.formatMessage(messages.costModelsWizardStepsReview),
          component: <Review />,
        },
      ],
      OCP: [
        {
          id: 1,
          name: intl.formatMessage(messages.costModelsWizardStepsGenInfo),
          component: <GeneralInformation />,
        },
        {
          id: 2,
          name: intl.formatMessage(messages.priceList),
          component: <PriceList />,
        },
        {
          id: 3,
          name: intl.formatMessage(messages.costCalculations),
          component: <Markup />,
        },
        {
          id: 4,
          name: intl.formatMessage(messages.costModelsWizardStepsSources),
          component: <Sources />,
        },
        {
          id: 5,
          name: intl.formatMessage(messages.costModelsWizardStepsReview),
          component: <Review />,
        },
      ],
    });

    const CancelButton = (
      <Button key="cancel" variant="link" onClick={closeConfirmDialog}>
        {intl.formatMessage(messages.createCostModelNoContinue)}
      </Button>
    );
    const OkButton = (
      <Button key="ok" variant="primary" onClick={() => this.setState({ ...defaultState })}>
        {intl.formatMessage(messages.createCostModelExitYes)}
      </Button>
    );

    return (
      <CostModelContext.Provider
        value={{
          apiError: this.state.apiError,
          checked: this.state.checked,
          clearQuery: () => this.setState({ query: {} }),
          createError: this.state.createError,
          createProcess: this.state.createProcess,
          createSuccess: this.state.createSuccess,
          currencyUnits: this.state.currencyUnits,
          description: this.state.description,
          dataFetched: this.state.dataFetched,
          dirtyName: this.state.dirtyName,
          distribution: this.state.distribution,
          error: this.state.error,
          filterName: this.state.filterName,
          fetchSources: (type, query, page, perPage) => {
            this.setState({ loading: true, apiError: null, filterName: '' }, () =>
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
          goToAddPL: (value?: boolean) =>
            this.setState({
              priceListCurrent: {
                ...this.state.priceListCurrent,
                justSaved: value ? value : false,
              },
            }),
          handleDistributionChange: (_, event) => {
            const { value } = event.currentTarget;
            this.setState({ distribution: value });
          },
          handleMarkupDiscountChange: (_, event) => {
            const { value } = event.currentTarget;
            this.setState({ markup: value });
          },
          handleSignChange: (_, event) => {
            const { value } = event.currentTarget;
            this.setState({ isDiscount: value === 'true' });
          },
          isDiscount: this.state.isDiscount,
          loading: this.state.loading,
          metricsHash,
          onClose: () => this.setState({ ...defaultState }, this.props.closeWizard),
          onCurrencyChange: value =>
            this.setState({ currencyUnits: value, tiers: updateTiersCurrency(this.state.tiers, value) }),
          onDescChange: value => this.setState({ description: value }),
          onFilterChange: value => this.setState({ filterName: value }),
          onNameChange: value => this.setState({ name: value, dirtyName: true }),
          onPageChange: (_evt, page) => this.setState({ page }),
          onPerPageChange: (_evt, perPage) => this.setState({ page: 1, perPage }),
          onSourceSelect: (rowId, isSelected) => {
            if (rowId === -1) {
              const pageSelections = this.state.sources.map(s => ({
                [s.uuid]: { selected: isSelected, meta: s },
              }));
              const newState = {
                ...this.state.checked,
                ...pageSelections,
              };
              return this.setState({ checked: newState });
            }
            const newState = {
              ...this.state.checked,
              [this.state.sources[rowId].uuid]: {
                selected: isSelected,
                meta: this.state.sources[rowId],
              },
            };
            return this.setState({ checked: newState });
          },
          onTypeChange: value => this.setState({ type: value, dataFetched: false, loading: false }),
          page: this.state.page,
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
          markup: this.state.markup,
          name: this.state.name,
          perPage: this.state.perPage,
          query: this.state.query,
          setSources: sources => this.setState({ sources, dataFetched: true, loading: false }),
          sources: this.state.sources,
          step: this.state.step,
          submitTiers: (tiers: Rate[]) => {
            this.setState({
              tiers,
            });
          },
          tiers: this.state.tiers,
          total: this.state.total,
          type: this.state.type,
        }}
      >
        <InternalWizard
          metricsHash={metricsHash}
          isProcess={this.state.createProcess}
          isSuccess={this.state.createSuccess}
          closeFnc={() => {
            if (
              (this.state.type === 'OCP' && this.state.step > 1 && this.state.tiers.length > 0) ||
              (this.state.type !== 'OCP' && this.state.step > 2)
            ) {
              this.setState({ isDialogOpen: true }, this.props.closeWizard);
            } else {
              this.setState({ ...defaultState }, this.props.closeWizard);
            }
          }}
          isOpen={this.props.isOpen}
          onMove={curr => this.setState({ step: Number(curr.id) })}
          steps={stepsHash()[this.state.type]}
          current={this.state.step}
          validators={validatorsHash[this.state.type]}
          setError={errorMessage => this.setState({ createError: errorMessage })}
          setSuccess={() => this.setState({ createError: null, createSuccess: true })}
          updateCostModel={() => this.props.fetch()}
          context={{
            name: this.state.name,
            type: this.state.type,
            currency: this.state.currencyUnits,
            description: this.state.description,
            distribution: this.state.distribution,
            markup: `${this.state.isDiscount ? '-' : ''}${this.state.markup}`,
            tiers: this.state.tiers,
            priceListCurrent: this.state.priceListCurrent,
            sources: Object.keys(this.state.checked).map(key => this.state.checked[key].meta),
          }}
        />
        <Modal
          aria-label={intl.formatMessage(messages.createCostModelExit)}
          isOpen={this.state.isDialogOpen}
          header={
            <Title headingLevel="h1" size={TitleSizes['2xl']}>
              <ExclamationTriangleIcon color="orange" /> {intl.formatMessage(messages.createCostModelExit)}
            </Title>
          }
          onClose={closeConfirmDialog}
          actions={[OkButton, CancelButton]}
          variant="small"
        >
          {intl.formatMessage(messages.createCostModelConfirmMsg)}
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
)(injectIntl(CostModelWizardBase));

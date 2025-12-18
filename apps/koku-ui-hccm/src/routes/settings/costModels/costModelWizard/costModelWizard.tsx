import {
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Title,
  TitleSizes,
  Wizard,
  WizardHeader,
  WizardStep,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { addCostModel } from 'api/costModels';
import type { MetricHash } from 'api/metrics';
import type { Rate } from 'api/rates';
import messages from 'locales/messages';
import { cloneDeep } from 'lodash';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions } from 'store/costModels';
import { metricsSelectors } from 'store/metrics';
import { unFormat } from 'utils/format';
import { getAccountCurrency } from 'utils/sessionStorage';

import { fetchSources as apiSources } from './api';
import { CostModelContext } from './context';
import Distribution from './distribution';
import GeneralInformation from './generalInformation';
import Markup from './markup';
import { parseApiError } from './parseError';
import PriceList from './priceList';
import Review from './review';
import Sources from './sources';
import { validatorsHash } from './steps';

interface InternalWizardBaseProps extends WrappedComponentProps {
  closeFnc: () => void;
  context: any;
  current: number;
  isOpen: boolean;
  isProcess: boolean;
  isSuccess: boolean;
  metricsHash: MetricHash;
  onMove: (id: number) => void;
  setError: (error: string) => void;
  setSuccess: () => void;
  steps: any[];
  updateCostModel: () => void;
  validators: ((any) => boolean)[];
}

// Update tiers currency
export const updateTiersCurrency = (tiers, currencyUnits = 'USD') => {
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
  closeFnc,
  context,
  current = 0,
  intl,
  isOpen,
  isProcess,
  isSuccess,
  onMove,
  steps,
  setError,
  setSuccess,
  updateCostModel,
  validators,
}) => {
  const EmptyFooter = () => null;
  const isAddingRate = context.type === 'OCP' && current === 1 && !validators[current](context);
  const isFooterHidden = isSuccess || isProcess || isAddingRate;

  const newSteps = [...steps];
  newSteps[current].isNextDisabled = !validators[current](context);

  if (current === newSteps.length - 1) {
    newSteps[current].onNext = () => {
      const {
        currency,
        description,
        distribution,
        distributeGpu,
        distributeNetwork,
        distributePlatformUnallocated,
        distributeStorage,
        distributeWorkerUnallocated,
        isDiscount,
        markup,
        name,
        type,
        tiers,
        sources,
      } = context;
      addCostModel({
        name,
        source_type: type,
        currency,
        description,
        distribution_info: {
          distribution_type: distribution,
          gpu_unallocated: distributeGpu,
          network_unattributed: distributeNetwork,
          platform_cost: distributePlatformUnallocated,
          storage_unattributed: distributeStorage,
          worker_cost: distributeWorkerUnallocated,
        },
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
    };
  }

  // Todo: Remove key={newSteps.length} workaround -- see https://github.com/patternfly/patternfly-react/issues/9752
  return (
    <Modal className="costManagement" isOpen={isOpen} variant={ModalVariant.large}>
      <Wizard
        header={
          <WizardHeader
            description={intl.formatMessage(messages.createCostModelDesc)}
            onClose={closeFnc}
            title={intl.formatMessage(messages.createCostModelTitle)}
          />
        }
        isVisitRequired
        key={newSteps.length}
        onClose={closeFnc}
        onStepChange={(_evt, currentStep) => onMove(currentStep.id as number)}
      >
        {newSteps.map(step => (
          <WizardStep
            footer={
              isFooterHidden ? (
                <EmptyFooter />
              ) : (
                {
                  isNextDisabled: step.isNextDisabled,
                  ...(step.nextButtonText && { nextButtonText: step.nextButtonText }),
                  ...(step.onNext && { onNext: step.onNext }),
                }
              )
            }
            id={step.id}
            key={step.id}
            name={step.name}
          >
            {step.component}
          </WizardStep>
        ))}
      </Wizard>
    </Modal>
  );
};

const InternalWizard = injectIntl(InternalWizardBase);

interface CostModelWizardProps extends WrappedComponentProps {
  closeWizard: () => void;
  fetch: typeof costModelsActions.fetchCostModels;
  isOpen: boolean;
  metricsHash: MetricHash;
  openWizard: () => void;
}

interface CostModelWizardState {
  apiError?: any;
  checked?: any;
  createError?: any;
  createProcess?: boolean;
  createSuccess?: boolean;
  currencyUnits?: string;
  dataFetched?: boolean;
  description?: string;
  dirtyName?: boolean;
  distribution?: string;
  distributeGpu?: boolean;
  distributeNetwork?: boolean;
  distributePlatformUnallocated?: boolean;
  distributeStorage?: boolean;
  distributeWorkerUnallocated?: boolean;
  error?: any;
  filterName?: string;
  isDialogOpen?: boolean;
  isDiscount?: boolean;
  loading?: boolean;
  markup?: string;
  name?: string;
  page?: number;
  perPage?: number;
  priceListCurrent?: {
    metric?: string;
    measurement?: string;
    rate?: string;
    justSaved?: boolean;
  };
  priceListPagination?: {
    page?: number;
    perPage?: number;
  };
  query?: { name?: string[] };
  step?: number;
  sources?: any[];
  tiers?: Rate[];
  total?: number;
  type?: string;
}

class CostModelWizardBase extends React.Component<CostModelWizardProps, CostModelWizardState> {
  protected defaultState: CostModelWizardState = {
    apiError: null,
    checked: {},
    createError: null,
    createProcess: false,
    createSuccess: false,
    currencyUnits: getAccountCurrency(),
    dataFetched: false,
    dirtyName: false,
    description: '',
    distribution: 'cpu',
    distributeGpu: true,
    distributeNetwork: true,
    distributePlatformUnallocated: true,
    distributeStorage: true,
    distributeWorkerUnallocated: true,
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
    step: 0,
    tiers: [] as Rate[],
    total: 0,
    type: '',
  };
  public state: CostModelWizardState = { ...this.defaultState };

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
          id: 0,
          name: intl.formatMessage(messages.costModelsWizardStepsGenInfo),
          component: <GeneralInformation />,
        },
      ],
      Azure: [
        {
          id: 0,
          name: intl.formatMessage(messages.costModelsWizardStepsGenInfo),
          component: <GeneralInformation />,
        },
        {
          id: 1,
          name: intl.formatMessage(messages.costCalculations),
          component: <Markup />,
        },
        {
          id: 2,
          name: intl.formatMessage(messages.costModelsWizardStepsSources),
          component: <Sources />,
        },
        {
          id: 3,
          name: intl.formatMessage(messages.costModelsWizardStepsReview),
          component: <Review />,
          nextButtonText: intl.formatMessage(messages.create),
        },
      ],
      AWS: [
        {
          id: 0,
          name: intl.formatMessage(messages.costModelsWizardStepsGenInfo),
          component: <GeneralInformation />,
        },
        {
          id: 1,
          name: intl.formatMessage(messages.costCalculations),
          component: <Markup />,
        },
        {
          id: 2,
          name: intl.formatMessage(messages.costModelsWizardStepsSources),
          component: <Sources />,
        },
        {
          id: 3,
          name: intl.formatMessage(messages.costModelsWizardStepsReview),
          component: <Review />,
          nextButtonText: intl.formatMessage(messages.create),
        },
      ],
      GCP: [
        {
          id: 0,
          name: intl.formatMessage(messages.costModelsWizardStepsGenInfo),
          component: <GeneralInformation />,
        },
        {
          id: 1,
          name: intl.formatMessage(messages.costCalculations),
          component: <Markup />,
        },
        {
          id: 2,
          name: intl.formatMessage(messages.costModelsWizardStepsSources),
          component: <Sources />,
        },
        {
          id: 3,
          name: intl.formatMessage(messages.costModelsWizardStepsReview),
          component: <Review />,
          nextButtonText: intl.formatMessage(messages.create),
        },
      ],
      OCP: [
        {
          id: 0,
          name: intl.formatMessage(messages.costModelsWizardStepsGenInfo),
          component: <GeneralInformation />,
        },
        {
          id: 1,
          name: intl.formatMessage(messages.priceList),
          component: <PriceList />,
        },
        {
          id: 2,
          name: intl.formatMessage(messages.costCalculations),
          component: <Markup />,
        },
        {
          id: 3,
          name: intl.formatMessage(messages.costDistribution),
          component: <Distribution />,
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
          nextButtonText: intl.formatMessage(messages.create),
        },
      ],
    });

    const CancelButton = (
      <Button key="cancel" variant="link" onClick={closeConfirmDialog}>
        {intl.formatMessage(messages.createCostModelNoContinue)}
      </Button>
    );
    const OkButton = (
      <Button key="ok" variant="primary" onClick={() => this.setState({ ...this.defaultState })}>
        {intl.formatMessage(messages.createCostModelExitYes)}
      </Button>
    );

    return (
      <CostModelContext.Provider
        value={
          {
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
            distributeGpu: this.state.distributeGpu,
            distributeNetwork: this.state.distributeNetwork,
            distributePlatformUnallocated: this.state.distributePlatformUnallocated,
            distributeStorage: this.state.distributeStorage,
            distributeWorkerUnallocated: this.state.distributeWorkerUnallocated,
            error: this.state.error,
            filterName: this.state.filterName,
            fetchSources: (type, query, page, perPage) => {
              this.setState({ loading: true, apiError: null, filterName: '' }, () =>
                apiSources({ type, query, page, perPage })
                  .then((resp: any) =>
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
            handleDistributionChange: event => {
              const { value } = event.currentTarget;
              this.setState({ distribution: value });
            },
            handleDistributeGpuChange: (event, isChecked) => {
              this.setState({ distributeGpu: isChecked });
            },
            handleDistributeNetworkChange: (event, isChecked) => {
              this.setState({ distributeNetwork: isChecked });
            },
            handleDistributePlatformUnallocatedChange: (event, isChecked) => {
              this.setState({ distributePlatformUnallocated: isChecked });
            },
            handleDistributeStorageChange: (event, isChecked) => {
              this.setState({ distributeStorage: isChecked });
            },
            handleDistributeWorkerUnallocatedChange: (event, isChecked) => {
              this.setState({ distributeWorkerUnallocated: isChecked });
            },
            handleMarkupDiscountChange: event => {
              const { value } = event.currentTarget;
              this.setState({ markup: value });
            },
            handleSignChange: event => {
              const { value } = event.currentTarget;
              this.setState({ isDiscount: value === 'true' });
            },
            isDiscount: this.state.isDiscount,
            loading: this.state.loading,
            metricsHash,
            onClose: () => this.setState({ ...this.defaultState }, this.props.closeWizard),
            onCurrencyChange: (value: string) =>
              this.setState({ currencyUnits: value, tiers: updateTiersCurrency(this.state.tiers, value) }),
            onDescChange: (value: string) => this.setState({ description: value }),
            onFilterChange: (value: string) => this.setState({ filterName: value }),
            onNameChange: (value: string) => this.setState({ name: value, dirtyName: true }),
            onPageChange: (page: number) => this.setState({ page }),
            onPerPageChange: (perPage: number) => this.setState({ page: 1, perPage }),
            onSourceSelect: (rowId: number, isSelected: boolean) => {
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
            onTypeChange: (value: string) => this.setState({ type: value, dataFetched: false, loading: false }),
            page: this.state.page,
            priceListPagination: {
              page: this.state.priceListPagination.page,
              perPage: this.state.priceListPagination.perPage,
              onPageSet: (page: number) =>
                this.setState({
                  priceListPagination: {
                    ...this.state.priceListPagination,
                    page,
                  },
                }),
              onPerPageSet: (perPage: number) =>
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
          } as any
        }
      >
        <InternalWizard
          metricsHash={metricsHash}
          isProcess={this.state.createProcess}
          isSuccess={this.state.createSuccess}
          closeFnc={() => {
            if (
              (this.state.type === 'OCP' && this.state.step > 0 && this.state.tiers.length > 0) ||
              (this.state.type !== 'OCP' && this.state.step > 1)
            ) {
              this.setState({ isDialogOpen: true }, this.props.closeWizard);
            } else {
              this.setState({ ...this.defaultState }, this.props.closeWizard);
            }
          }}
          isOpen={this.props.isOpen}
          onMove={id => this.setState({ step: Number(id) })}
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
            distributeGpu: this.state.distributeGpu,
            distributeNetwork: this.state.distributeNetwork,
            distributePlatformUnallocated: this.state.distributePlatformUnallocated,
            distributeStorage: this.state.distributeStorage,
            distributeWorkerUnallocated: this.state.distributeWorkerUnallocated,
            markup: `${this.state.isDiscount ? '-' : ''}${this.state.markup}`,
            tiers: this.state.tiers,
            priceListCurrent: this.state.priceListCurrent,
            sources: Object.keys(this.state.checked).map(key => this.state.checked[key].meta),
          }}
        />
        <Modal
          aria-label={intl.formatMessage(messages.createCostModelExit)}
          isOpen={this.state.isDialogOpen}
          onClose={closeConfirmDialog}
          variant={ModalVariant.small}
        >
          <ModalHeader>
            <Title headingLevel="h1" size={TitleSizes['2xl']}>
              <Icon status="warning">
                <ExclamationTriangleIcon />
              </Icon>{' '}
              {intl.formatMessage(messages.createCostModelExit)}
            </Title>
          </ModalHeader>
          <ModalBody>{intl.formatMessage(messages.createCostModelConfirmMsg)}</ModalBody>
          <ModalFooter>
            {OkButton}
            {CancelButton}
          </ModalFooter>
        </Modal>
      </CostModelContext.Provider>
    );
  }
}

const CostModelWizard = connect(
  createMapStateToProps(state => ({
    metricsHash: metricsSelectors.metrics(state),
  })),
  {
    fetch: costModelsActions.fetchCostModels,
  }
)(injectIntl(CostModelWizardBase));

export default CostModelWizard;

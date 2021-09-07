import { Title, TitleSizes, Wizard, WizardStepFunctionType } from '@patternfly/react-core';
import { Button, Modal } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { addCostModel } from 'api/costModels';
import { MetricHash } from 'api/metrics';
import { Rate } from 'api/rates';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps } from 'store/common';
import { costModelsActions } from 'store/costModels';
import { metricsSelectors } from 'store/metrics';

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

const InternalWizardBase: React.SFC<InternalWizardBaseProps> = ({
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
    newSteps[current - 1].nextButtonText = intl.formatMessage(messages.Create);
  }
  return isOpen ? (
    <Wizard
      isOpen
      title={intl.formatMessage(messages.CreateCostModelTitle)}
      description={intl.formatMessage(messages.CreateCostModelDesc)}
      steps={newSteps}
      startAtStep={current}
      onNext={onMove}
      onBack={onMove}
      onGoToStep={onMove}
      onClose={closeFnc}
      footer={isSuccess || isProcess || isAddingRate ? <div /> : null}
      onSave={() => {
        const { name, type, tiers, markup, description, distribution, isDiscount, sources } = context;
        addCostModel({
          name,
          source_type: type,
          description,
          distribution,
          rates: tiers,
          markup: {
            value: isDiscount ? '-' + markup : markup,
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
  step: 1,
  type: '',
  name: '',
  dirtyName: false,
  distribution: 'cpu',
  isDiscount: false,
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
  tiers: [] as Rate[],
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
  createError: null,
  createSuccess: false,
  createProcess: false,
  isDialogOpen: false,
};

interface State {
  step: number;
  type: string;
  name: string;
  dirtyName: boolean;
  description: string;
  distribution: string;
  isDiscount: boolean;
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
  tiers: Rate[];
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
          name: intl.formatMessage(messages.CostModelsWizardStepsGenInfo),
          component: <GeneralInformation />,
        },
      ],
      AZURE: [
        {
          id: 1,
          name: intl.formatMessage(messages.CostModelsWizardStepsGenInfo),
          component: <GeneralInformation />,
        },
        {
          id: 2,
          name: intl.formatMessage(messages.CostCalculations),
          component: <Markup />,
        },
        {
          id: 3,
          name: intl.formatMessage(messages.CostModelsWizardStepsSources),
          component: <Sources />,
        },
        {
          id: 4,
          name: intl.formatMessage(messages.CostModelsWizardStepsReview),
          component: <Review />,
        },
      ],
      AWS: [
        {
          id: 1,
          name: intl.formatMessage(messages.CostModelsWizardStepsGenInfo),
          component: <GeneralInformation />,
        },
        {
          id: 2,
          name: intl.formatMessage(messages.CostCalculations),
          component: <Markup />,
        },
        {
          id: 3,
          name: intl.formatMessage(messages.CostModelsWizardStepsSources),
          component: <Sources />,
        },
        {
          id: 4,
          name: intl.formatMessage(messages.CostModelsWizardStepsReview),
          component: <Review />,
        },
      ],
      GCP: [
        {
          id: 1,
          name: intl.formatMessage(messages.CostModelsWizardStepsGenInfo),
          component: <GeneralInformation />,
        },
        {
          id: 2,
          name: intl.formatMessage(messages.CostCalculations),
          component: <Markup />,
        },
        {
          id: 3,
          name: intl.formatMessage(messages.CostModelsWizardStepsSources),
          component: <Sources />,
        },
        {
          id: 4,
          name: intl.formatMessage(messages.CostModelsWizardStepsReview),
          component: <Review />,
        },
      ],
      OCP: [
        {
          id: 1,
          name: intl.formatMessage(messages.CostModelsWizardStepsGenInfo),
          component: <GeneralInformation />,
        },
        {
          id: 2,
          name: intl.formatMessage(messages.PriceList),
          component: <PriceList />,
        },
        {
          id: 3,
          name: intl.formatMessage(messages.CostCalculations),
          component: <Markup />,
        },
        {
          id: 4,
          name: intl.formatMessage(messages.CostModelsWizardStepsSources),
          component: <Sources />,
        },
        {
          id: 5,
          name: intl.formatMessage(messages.CostModelsWizardStepsReview),
          component: <Review />,
        },
      ],
    });

    const CancelButton = (
      <Button key="cancel" variant="link" onClick={closeConfirmDialog}>
        {intl.formatMessage(messages.CreateCostModelNoContinue)}
      </Button>
    );
    const OkButton = (
      <Button key="ok" variant="primary" onClick={() => this.setState({ ...defaultState })}>
        {intl.formatMessage(messages.CreateCostModelExitYes)}
      </Button>
    );

    return (
      <CostModelContext.Provider
        value={{
          metricsHash,
          step: this.state.step,
          type: this.state.type,
          onTypeChange: value => this.setState({ type: value, dataFetched: false, loading: false }),
          name: this.state.name,
          dirtyName: this.state.dirtyName,
          onNameChange: value => this.setState({ name: value, dirtyName: true }),
          description: this.state.description,
          onDescChange: value => this.setState({ description: value }),
          distribution: this.state.distribution,
          handleDistributionChange: (_, event) => {
            const { value } = event.currentTarget;
            this.setState({ distribution: value });
          },
          markup: this.state.markup,
          handleMarkupDiscountChange: (_, event) => {
            const { value } = event.currentTarget;
            const regex = /^[0-9.]*$/;
            if (regex.test(value)) {
              this.setState({ markup: value });
            }
          },
          isDiscount: this.state.isDiscount,
          handleSignChange: (_, event) => {
            const { value } = event.currentTarget;
            this.setState({ isDiscount: value === 'true' });
          },
          markupValidator: () => {
            return /^\d*(\.?\d{1,2})?$/.test(this.state.markup) ? 'default' : 'error';
          },
          handleOnKeyDown: event => {
            // Prevent 'enter', '+', and '-'
            if (event.keyCode === 13 || event.keyCode === 187 || event.keyCode === 189) {
              event.preventDefault();
            }
          },
          error: this.state.error,
          apiError: this.state.apiError,
          sources: this.state.sources,
          dataFetched: this.state.dataFetched,
          setSources: sources => this.setState({ sources, dataFetched: true, loading: false }),
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
          onPerPageChange: (_evt, perPage) => this.setState({ page: 1, perPage }),
          perPage: this.state.perPage,
          filterName: this.state.filterName,
          onFilterChange: value => this.setState({ filterName: value }),
          query: this.state.query,
          clearQuery: () => this.setState({ query: {} }),
          loading: this.state.loading,
          tiers: this.state.tiers,
          submitTiers: (tiers: Rate[]) => {
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
          createSuccess: this.state.createSuccess,
          createError: this.state.createError,
          createProcess: this.state.createProcess,
          onClose: () => this.setState({ ...defaultState }, this.props.closeWizard),
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
            description: this.state.description,
            distribution: this.state.distribution,
            markup: this.state.isDiscount ? '-' + this.state.markup : this.state.markup,
            tiers: this.state.tiers,
            priceListCurrent: this.state.priceListCurrent,
            sources: this.state.sources.filter(src => src.selected),
          }}
        />
        <Modal
          aria-label={intl.formatMessage(messages.CreateCostModelExit)}
          isOpen={this.state.isDialogOpen}
          header={
            <Title headingLevel="h1" size={TitleSizes['2xl']}>
              <ExclamationTriangleIcon color="orange" /> {intl.formatMessage(messages.CreateCostModelExit)}
            </Title>
          }
          onClose={closeConfirmDialog}
          actions={[OkButton, CancelButton]}
          variant="small"
        >
          {intl.formatMessage(messages.CreateCostModelConfirmMsg)}
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

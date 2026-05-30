import './createCostModel.scss';

import type { MessageDescriptor } from '@formatjs/intl';
import { useWizardContext, Wizard, WizardFooter, WizardHeader, WizardStep } from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import type { Provider } from 'api/providers';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { routes } from 'routes';
import type { IntegrationContentHandle } from 'routes/settings/costModels/costModelBreakdown/integrations/components';
import type { PriceListContentHandle } from 'routes/settings/costModels/costModelBreakdown/priceLists/components';
import type { OrderPriceListContentHandle } from 'routes/settings/costModels/costModelBreakdown/priceLists/orderPriceListContent';
import { Distribution } from 'routes/settings/costModels/costModelCreate/components/steps/distribution';
import { GeneralInfo } from 'routes/settings/costModels/costModelCreate/components/steps/general';
import { Integration } from 'routes/settings/costModels/costModelCreate/components/steps/integrations';
import { Markup } from 'routes/settings/costModels/costModelCreate/components/steps/markup';
import { AddPriceList } from 'routes/settings/costModels/costModelCreate/components/steps/priceList';
import { OrderPriceList } from 'routes/settings/costModels/costModelCreate/components/steps/priceList';
import { ReviewDetails, ReviewSuccess } from 'routes/settings/costModels/costModelCreate/components/steps/review';
import {
  validateDescription,
  validateMarkup,
  validateName,
} from 'routes/settings/costModels/costModelCreate/components/utils';
import { useCostModelNotifications } from 'routes/settings/costModels/utils';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';
import { unFormat } from 'utils/format';
import { formatPath } from 'utils/paths';
import { getAccountCurrency } from 'utils/sessionStorage';

import { ExitModal } from './exitModal';

interface CostModelWizardOwnProps {
  canWrite?: boolean;
  onClose?: () => void;
}

interface CostModelWizardStateProps {
  costModelsAddError?: AxiosError;
  costModelsAddStatus?: FetchStatus;
}

type CostModelWizardProps = CostModelWizardOwnProps;

interface WizardFooterProps {
  contentRef: React.RefObject<IntegrationContentHandle | PriceListContentHandle | OrderPriceListContentHandle>;
  isNextDisabled?: boolean;
}

/** step-2a: optional assign step — Next always enabled; go to 2b only when more than one price list is selected. */
const AssignPriceListsWizardFooter: React.FC<{
  contentRef: React.RefObject<PriceListContentHandle>;
}> = ({ contentRef }) => {
  const { activeStep, close, goToPrevStep, goToStepById, goToStepByIndex, steps } = useWizardContext();

  const handleOnNext = () => {
    const selectionCount = contentRef.current?.save() ?? 0;

    if (selectionCount > 1) {
      const orderStep = steps.find(step => step.id === 'step-2b');
      if (orderStep?.index !== undefined) {
        // goToStepByIndex bypasses isHidden/isDisabled until parent state re-renders
        goToStepByIndex(orderStep.index);
      }
      return;
    }

    // Skip order step (0–1 selections); do not use goToNextStep() — 2b may still appear enabled briefly
    goToStepById('step-3');
  };

  return (
    <WizardFooter
      activeStep={activeStep}
      onBack={() => {
        contentRef.current?.save();
        goToPrevStep();
      }}
      onClose={close}
      onNext={handleOnNext}
    />
  );
};

const CostModelWizardFooter: React.FC<WizardFooterProps> = ({ contentRef, isNextDisabled }: WizardFooterProps) => {
  const { activeStep, close, goToNextStep, goToPrevStep } = useWizardContext();

  return (
    <WizardFooter
      activeStep={activeStep}
      isNextDisabled={isNextDisabled}
      onBack={() => {
        contentRef.current?.save();
        goToPrevStep();
      }}
      onClose={close}
      onNext={() => {
        contentRef.current?.save();
        goToNextStep();
      }}
    />
  );
};

/** Leave step-2b when ordering is no longer required (< 2 price lists). */
const OrderPriceListStepSync: React.FC<{ priceListCount: number }> = ({ priceListCount }) => {
  const { activeStep, goToStepById } = useWizardContext();

  useEffect(() => {
    if (activeStep?.id !== 'step-2b' || priceListCount >= 2) {
      return;
    }

    goToStepById(priceListCount === 0 ? 'step-2a' : 'step-3');
  }, [activeStep?.id, goToStepById, priceListCount]);

  return null;
};

const CostModelWizard: React.FC<CostModelWizardProps> = ({ canWrite, onClose }: CostModelWizardProps) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();

  const integrationContentRef = useRef<IntegrationContentHandle>(null);
  const priceListContentRef = useRef<PriceListContentHandle>(null);
  const priceListHandleRef = useRef<OrderPriceListContentHandle>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFinish, setIsFinish] = useState(false);

  const { costModelsAddError, costModelsAddStatus } = useMapToProps();

  // Step 1: General Info

  const [currency, setCurrency] = useState<string>(getAccountCurrency());
  const [description, setDescription] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState<MessageDescriptor>();
  const [distributeGpu, setDistributeGpu] = useState<boolean>(true);
  const [distributeNetwork, setDistributeNetwork] = useState<boolean>(true);
  const [distributePlatformUnallocated, setDistributePlatformUnallocated] = useState<boolean>(true);
  const [distributeStorage, setDistributeStorage] = useState<boolean>(true);
  const [distributeWorkerUnallocated, setDistributeWorkerUnallocated] = useState<boolean>(true);
  const [distributionType, setDistributionType] = useState<string>('cpu');
  const [isDiscount, setIsDiscount] = useState(false);
  const [markup, setMarkup] = useState('0');
  const [markupError, setMarkupError] = useState<MessageDescriptor>();
  const [name, setName] = useState<string>('');
  const [nameError, setNameError] = useState<MessageDescriptor>();
  const [priceLists, setPriceLists] = useState<PriceListData[]>([]);
  const [sources, setSources] = useState<Provider[]>([]);
  const [sourceType, setSourceType] = useState<string>(undefined);

  const isNameDirty = name !== undefined && name !== '';
  const isSourceTypeDirty = sourceType !== undefined;

  const isNameInvalid = (!name && isNameDirty) || nameError !== undefined;
  const isDescriptionInvalid = descriptionError !== undefined;

  const hasUnsavedGeneralInfoChanges = isSourceTypeDirty && isNameDirty && !isNameInvalid && !isDescriptionInvalid;
  const hasUnsavedMarkupChanges = !markupError;

  // Getters

  const getWizard = () => {
    return (
      <Wizard
        className="wizardOverride"
        header={
          <WizardHeader
            description={intl.formatMessage(messages.createCostModelDesc)}
            onClose={handleOnClose}
            title={intl.formatMessage(messages.createCostModelTitle)}
          />
        }
        isVisitRequired
        onClose={handleOnClose}
      >
        <WizardStep
          footer={{
            isNextDisabled: !hasUnsavedGeneralInfoChanges,
          }}
          id="step-1"
          name={intl.formatMessage(messages.costModelsWizardStepsGenInfo)}
        >
          <GeneralInfo
            currency={currency}
            description={description}
            descriptionError={descriptionError}
            name={name}
            nameError={nameError}
            onCurrencyChange={setCurrency}
            onDescriptionChange={handleOnDescriptionChange}
            onNameChange={handleOnNameChange}
            onSourceTypeChange={handleOnSourceTypeChange}
            sourceType={sourceType}
          />
        </WizardStep>
        <WizardStep
          id="steps-2"
          isDisabled={!hasUnsavedGeneralInfoChanges}
          isExpandable
          isHidden={!isSourceTypeDirty || sourceType !== 'OCP'}
          name={intl.formatMessage(messages.costModelsWizardPriceLists)}
          steps={[
            <WizardStep
              footer={<AssignPriceListsWizardFooter contentRef={priceListContentRef} />}
              id="step-2a"
              key="step-2a"
              name={intl.formatMessage(messages.assignPriceLists)}
            >
              <AddPriceList
                canWrite={canWrite}
                contentRef={priceListContentRef}
                currency={currency}
                onAdd={setPriceLists}
                priceLists={priceLists}
              />
            </WizardStep>,
            <WizardStep
              footer={<CostModelWizardFooter contentRef={priceListHandleRef} />}
              id="step-2b"
              isHidden={priceLists?.length < 2}
              key="step-2b"
              name={intl.formatMessage(messages.orderPriceLists)}
            >
              <OrderPriceListStepSync priceListCount={priceLists?.length ?? 0} />
              <OrderPriceList
                canWrite={canWrite}
                contentRef={priceListHandleRef}
                onRemove={items => {
                  setPriceLists(prev => prev?.filter(val => !items.some(item => item.uuid === val.uuid)) ?? []);
                }}
                onSave={setPriceLists}
                priceLists={priceLists}
              />
            </WizardStep>,
          ]}
        />
        <WizardStep
          footer={{
            isNextDisabled: !hasUnsavedMarkupChanges,
          }}
          id="step-3"
          isDisabled={!hasUnsavedGeneralInfoChanges}
          isHidden={!isSourceTypeDirty}
          name={intl.formatMessage(messages.costCalculations)}
        >
          <Markup
            isDiscount={isDiscount}
            markup={markup}
            markupError={markupError}
            onDiscountChange={setIsDiscount}
            onMarkupChange={handleOnMarkupChange}
          />
        </WizardStep>
        <WizardStep
          id="step-4"
          isDisabled={!hasUnsavedGeneralInfoChanges || !hasUnsavedMarkupChanges}
          isHidden={!isSourceTypeDirty || sourceType !== 'OCP'}
          name={intl.formatMessage(messages.costDistribution)}
        >
          <Distribution
            distributeGpu={distributeGpu}
            distributeNetwork={distributeNetwork}
            distributePlatformUnallocated={distributePlatformUnallocated}
            distributeStorage={distributeStorage}
            distributeWorkerUnallocated={distributeWorkerUnallocated}
            distributionType={distributionType}
            onDistributeGpuChange={setDistributeGpu}
            onDistributeNetworkChange={setDistributeNetwork}
            onDistributePlatformUnallocatedChange={setDistributePlatformUnallocated}
            onDistributeStorageChange={setDistributeStorage}
            onDistributeWorkerUnallocatedChange={setDistributeWorkerUnallocated}
            onDistributionTypeChange={setDistributionType}
          />
        </WizardStep>
        <WizardStep
          footer={<CostModelWizardFooter contentRef={integrationContentRef} />}
          id="step-5"
          isDisabled={!hasUnsavedGeneralInfoChanges || !hasUnsavedMarkupChanges}
          isHidden={!isSourceTypeDirty}
          name={intl.formatMessage(messages.costModelsWizardStepsSources)}
        >
          <Integration
            contentRef={integrationContentRef}
            onAdd={setSources}
            sources={sources}
            sourceType={sourceType}
          />
        </WizardStep>
        <WizardStep
          footer={{
            nextButtonText: intl.formatMessage(messages.create),
            onNext: handleOnCreate,
          }}
          id="step-6"
          isDisabled={!canWrite || !hasUnsavedGeneralInfoChanges || !hasUnsavedMarkupChanges}
          isHidden={!isSourceTypeDirty}
          name={intl.formatMessage(messages.costModelsWizardStepsReview)}
        >
          <ReviewDetails
            currency={currency}
            description={description}
            distributeGpu={distributeGpu}
            distributeNetwork={distributeNetwork}
            distributePlatformUnallocated={distributePlatformUnallocated}
            distributeStorage={distributeStorage}
            distributeWorkerUnallocated={distributeWorkerUnallocated}
            distributionType={distributionType}
            isDiscount={isDiscount}
            markup={markup}
            name={name}
            priceLists={priceLists}
            sources={sources}
            sourceType={sourceType}
          />
        </WizardStep>
      </Wizard>
    );
  };

  // Handlers

  const handleOnCreate = () => {
    if (costModelsAddStatus !== FetchStatus.inProgress) {
      const uuids = priceLists?.map(item => item.uuid) ?? [];
      dispatch(
        costModelsActions.addCostModel({
          currency,
          description,
          distribution_info: {
            distribution_type: distributionType,
            gpu_unallocated: distributeGpu,
            network_unattributed: distributeNetwork,
            platform_cost: distributePlatformUnallocated,
            storage_unattributed: distributeStorage,
            worker_cost: distributeWorkerUnallocated,
          },
          markup: {
            value: `${isDiscount ? '-' : ''}${unFormat(markup)}`,
            unit: 'percent',
          },
          name,
          price_list_uuids: uuids,
          source_type: sourceType,
          source_uuids: sources?.map(item => item.uuid),
        })
      );
    }
  };

  const handleOnDescriptionChange = (value: string) => {
    setDescription(value);

    const error = validateDescription(value);
    if (error) {
      setDescriptionError(error);
    } else {
      setDescriptionError(undefined);
    }
  };

  const handleOnMarkupChange = (value: string) => {
    setMarkup(value);

    const error = validateMarkup(value);
    if (error) {
      setMarkupError(error);
    } else {
      setMarkupError(undefined);
    }
  };

  const handleOnNameChange = (value: string) => {
    setName(value);

    const error = validateName(value);
    if (error) {
      setNameError(error);
    } else {
      setNameError(undefined);
    }
  };

  const handleOnClose = () => {
    if (isFinish) {
      handleOnModalConfirm();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleOnModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleOnModalConfirm = () => {
    setIsModalOpen(false);
    reset();
    onClose?.();

    navigate(formatPath(routes.settings.path), {
      replace: true,
      state: {
        ...(location?.state || {}),
        settingsState: {
          activeTabKey: 0,
        },
      },
    });
  };

  const handleOnSourceTypeChange = (value: string) => {
    setSourceType(value);
    reset(false);
  };

  const reset = (resetGeneralInfo: boolean = true) => {
    setDistributeGpu(true);
    setDistributeNetwork(true);
    setDistributePlatformUnallocated(true);
    setDistributeStorage(true);
    setDistributeWorkerUnallocated(true);
    setDistributionType('cpu');
    setIsDiscount(false);
    setIsFinish(false);
    setMarkup('0');
    setMarkupError(undefined);
    setPriceLists([]);
    setSources([]);

    if (resetGeneralInfo) {
      setCurrency(getAccountCurrency());
      setDescription('');
      setDescriptionError(undefined);
      setName('');
      setNameError(undefined);
      setSourceType(undefined);
    }
  };

  // Effects

  useEffect(() => {
    if (costModelsAddStatus === FetchStatus.complete && !costModelsAddError) {
      setIsFinish(true);
    }
  }, [costModelsAddError, costModelsAddStatus]);

  return (
    <>
      {isFinish ? <ReviewSuccess name={name} onClose={handleOnClose} /> : getWizard()}
      <ExitModal isOpen={isModalOpen} onCancel={handleOnModalCancel} onConfirm={handleOnModalConfirm} />
    </>
  );
};

const useMapToProps = (): CostModelWizardStateProps => {
  const costModelsAddError = useSelector((state: RootState) => costModelsSelectors.selectCostModelsAddError(state));
  const costModelsAddStatus = useSelector((state: RootState) => costModelsSelectors.selectCostModelsAddStatus(state));

  // Notifications
  useCostModelNotifications();

  return {
    costModelsAddError,
    costModelsAddStatus,
  };
};

export { CostModelWizard };

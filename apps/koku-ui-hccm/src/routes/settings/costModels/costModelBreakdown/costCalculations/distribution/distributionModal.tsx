import {
  Alert,
  Button,
  Checkbox,
  Content,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Radio,
  Stack,
  StackItem,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { type CostModel } from 'api/costModels';
import type { AxiosError } from 'axios';
import { useIsGpuToggleEnabled } from 'components/featureToggle';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { getSourceType } from 'routes/settings/costModels/costModel/utils';
import { parseApiError } from 'routes/settings/utils';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

import { styles } from './distribution.styles';

interface DistributionModalOwnProps {
  canWrite?: boolean;
  costModel?: CostModel;
  isDispatch?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (costModel: CostModel) => void;
}

interface DistributionModalStateProps {
  costModelsUpdateError: AxiosError;
  costModelsUpdateStatus: FetchStatus;
}

type DistributionModalProps = DistributionModalOwnProps;

const DistributionModal: React.FC<DistributionModalProps> = ({
  canWrite,
  costModel,
  isDispatch = true,
  isOpen,
  onClose,
  onSave,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();
  const isGpuToggleEnabled = useIsGpuToggleEnabled();

  const [distribution, setDistribution] = useState(costModel?.distribution_info?.distribution_type ?? 'cpu');
  const [distributeGpu, setDistributeGpu] = useState(costModel?.distribution_info?.gpu_unallocated === true);
  const [distributeNetwork, setDistributeNetwork] = useState(
    costModel?.distribution_info?.network_unattributed === true
  );
  const [distributePlatformUnallocated, setDistributePlatformUnallocated] = useState(
    costModel?.distribution_info?.platform_cost === true
  );
  const [distributeStorage, setDistributeStorage] = useState(
    costModel?.distribution_info?.storage_unattributed === true
  );
  const [distributeWorkerUnallocated, setDistributeWorkerUnallocated] = useState(
    costModel?.distribution_info?.worker_cost === true
  );

  const [isFinish, setIsFinish] = useState(false);
  const [payload, setPayload] = useState<CostModel>();

  const { costModelsUpdateError, costModelsUpdateStatus } = useMapToProps();

  // Handlers

  const handleOnDistributionChange = event => {
    const { value } = event.currentTarget;
    setDistribution(value);
  };

  const handleOnDistributeGpuChange = (_event, isChecked) => {
    setDistributeGpu(isChecked);
  };

  const handleOnDistributeNetworkChange = (_event, isChecked) => {
    setDistributeNetwork(isChecked);
  };

  const handleOnDistributePlatformUnallocatedChange = (_event, isChecked) => {
    setDistributePlatformUnallocated(isChecked);
  };

  const handleOnDistributeStorageChange = (_event, isChecked) => {
    setDistributeStorage(isChecked);
  };

  const handleOnDistributeWorkerUnallocatedChange = (_event, isChecked) => {
    setDistributeWorkerUnallocated(isChecked);
  };

  const handleOnSave = () => {
    if (costModelsUpdateStatus !== FetchStatus.inProgress) {
      const items = {
        ...costModel,
        source_uuids: costModel?.sources?.map(provider => provider.uuid),
        source_type: getSourceType(costModel?.source_type), // will always be OCP
        distribution_info: {
          distribution_type: distribution,
          gpu_unallocated: distributeGpu,
          network_unattributed: distributeNetwork,
          platform_cost: distributePlatformUnallocated,
          storage_unattributed: distributeStorage,
          worker_cost: distributeWorkerUnallocated,
        },
      };

      if (isDispatch) {
        setIsFinish(true);
        setPayload(items);
        dispatch(costModelsActions.updateCostModel(costModel?.uuid, items));
      } else {
        onSave?.(items);
      }
    }
  };

  // Effects

  useEffect(() => {
    if (isFinish && costModelsUpdateStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!costModelsUpdateError) {
        onSave?.(payload);
      }
    }
  }, [isFinish, costModelsUpdateError, costModelsUpdateStatus, onSave, payload]);

  const isLoading = costModelsUpdateStatus === FetchStatus.inProgress;

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant={ModalVariant.medium}>
      <ModalHeader
        description={
          <a href={intl.formatMessage(messages.docsCostModelsDistribution)} rel="noreferrer" target="_blank">
            {intl.formatMessage(messages.learnMore)}
          </a>
        }
        title={intl.formatMessage(messages.costDistribution)}
      />
      <ModalBody>
        <Stack hasGutter>
          <StackItem>
            {costModelsUpdateError && <Alert variant="danger" title={parseApiError(costModelsUpdateError)} />}
          </StackItem>
          <StackItem>
            <Title headingLevel="h3" size={TitleSizes.md}>
              {intl.formatMessage(messages.distributionType)}
            </Title>
            <Content>
              <Content component="p" style={styles.cardDescription}>
                {intl.formatMessage(messages.distributionModelDesc)}
              </Content>
            </Content>
          </StackItem>
          <StackItem isFilled>
            <Form>
              <FormGroup isInline fieldId="cost-distribution-type" isRequired>
                <Radio
                  isChecked={distribution === 'cpu'}
                  name="distribution-type"
                  label={intl.formatMessage(messages.cpuTitle)}
                  aria-label={intl.formatMessage(messages.cpuTitle)}
                  id="cpu-distribution"
                  value="cpu"
                  onChange={handleOnDistributionChange}
                />
                <Radio
                  isChecked={distribution === 'memory'}
                  name="distribution-type"
                  label={intl.formatMessage(messages.memoryTitle)}
                  aria-label={intl.formatMessage(messages.memoryTitle)}
                  id="memory-distribution"
                  value="memory"
                  onChange={handleOnDistributionChange}
                />
              </FormGroup>
            </Form>
          </StackItem>
          <StackItem>
            <Title headingLevel="h3" size={TitleSizes.md}>
              {intl.formatMessage(messages.distributeCostsToProjects)}
            </Title>
          </StackItem>
          <StackItem isFilled>
            <Form>
              <FormGroup fieldId="distribute-unallocated-costs" isRequired>
                <Checkbox
                  aria-label={intl.formatMessage(messages.distributePlatform)}
                  id="distribute-platform"
                  isChecked={distributePlatformUnallocated}
                  label={intl.formatMessage(messages.distributePlatform)}
                  onChange={handleOnDistributePlatformUnallocatedChange}
                />
                <Checkbox
                  aria-label={intl.formatMessage(messages.distributeWorker)}
                  id="distribute-worker"
                  isChecked={distributeWorkerUnallocated}
                  label={intl.formatMessage(messages.distributeWorker)}
                  onChange={handleOnDistributeWorkerUnallocatedChange}
                />
                <Checkbox
                  aria-label={intl.formatMessage(messages.distributeNetwork)}
                  id="distribute-network"
                  isChecked={distributeNetwork}
                  label={intl.formatMessage(messages.distributeNetwork)}
                  onChange={handleOnDistributeNetworkChange}
                />
                <Checkbox
                  aria-label={intl.formatMessage(messages.distributeStorage)}
                  id="distribute-storage"
                  isChecked={distributeStorage}
                  label={intl.formatMessage(messages.distributeStorage)}
                  onChange={handleOnDistributeStorageChange}
                />
                {isGpuToggleEnabled && (
                  <Checkbox
                    aria-label={intl.formatMessage(messages.distributeGpu)}
                    id="distribute-gpu"
                    isChecked={distributeGpu}
                    label={intl.formatMessage(messages.distributeGpu)}
                    onChange={handleOnDistributeGpuChange}
                  />
                )}
              </FormGroup>
            </Form>
          </StackItem>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button isDisabled={!canWrite || isLoading} key="save" onClick={handleOnSave} variant="primary">
          {intl.formatMessage(messages.save)}
        </Button>
        <Button isDisabled={isLoading} key="cancel" onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const useMapToProps = (): DistributionModalStateProps => {
  const costModelsUpdateError = useSelector((state: RootState) =>
    costModelsSelectors.selectCostModelsUpdateError(state)
  );
  const costModelsUpdateStatus = useSelector((state: RootState) =>
    costModelsSelectors.selectCostModelsUpdateStatus(state)
  );

  return {
    costModelsUpdateError,
    costModelsUpdateStatus,
  };
};

export { DistributionModal };

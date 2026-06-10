import {
  Button,
  ButtonVariant,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import type { Provider } from 'api/providers';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { getSourceType } from 'routes/settings/costModels/costModel/utils';
import type { IntegrationContentHandle } from 'routes/settings/costModels/costModelBreakdown/integrations/components';
import { IntegrationContent } from 'routes/settings/costModels/costModelBreakdown/integrations/components/integrationContent';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

interface AddIntegrationModalOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  isDispatch?: boolean;
  isOpen?: boolean;
  onAdd?: (uuids: string[]) => void;
  onClose?: () => void;
}

interface AddIntegrationModalStateProps {
  costModelsUpdateError?: AxiosError;
  costModelsUpdateStatus?: FetchStatus;
}

type AddIntegrationModalProps = AddIntegrationModalOwnProps;

const AddIntegrationModal: React.FC<AddIntegrationModalProps> = ({
  canWrite,
  costModel,
  isDispatch = true,
  isOpen,
  onAdd,
  onClose,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const contentRef = useRef<IntegrationContentHandle>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFinish, setIsFinish] = useState(false);
  const [payload, setPayload] = useState<string[]>();

  const { costModelsUpdateError, costModelsUpdateStatus } = useMapToProps();

  const handleOnAdd = (providers: Provider[]) => {
    if (costModelsUpdateStatus !== FetchStatus.inProgress) {
      const uuids = providers?.map(item => item.uuid) ?? [];
      setPayload(uuids);

      if (costModel?.uuid && isDispatch) {
        setIsFinish(true);

        dispatch(
          costModelsActions.updateCostModel(costModel?.uuid, {
            ...(costModel ?? {}),
            source_type: getSourceType(costModel?.source_type),
            source_uuids: uuids,
          })
        );
      } else {
        onAdd?.(uuids);
      }
    }
  };

  // Effects

  useEffect(() => {
    if (isFinish && costModelsUpdateStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!costModelsUpdateError) {
        onAdd?.(payload);
      }
    }
  }, [isFinish, costModel, costModelsUpdateError, costModelsUpdateStatus, onAdd, payload]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.large}>
      <ModalHeader title={intl.formatMessage(messages.costModelsAssignSources, { count: 2 })} />
      <ModalBody>
        {isOpen && (
          <IntegrationContent
            canWrite={canWrite}
            costModel={costModel}
            onAdd={handleOnAdd}
            onDisabled={setIsDisabled}
            ref={contentRef}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          isAriaDisabled={isDisabled || costModelsUpdateStatus === FetchStatus.inProgress}
          onClick={() => contentRef.current?.save()}
          variant={ButtonVariant.primary}
        >
          {intl.formatMessage(messages.save)}
        </Button>
        <Button onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const useMapToProps = (): AddIntegrationModalStateProps => {
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

export { AddIntegrationModal };

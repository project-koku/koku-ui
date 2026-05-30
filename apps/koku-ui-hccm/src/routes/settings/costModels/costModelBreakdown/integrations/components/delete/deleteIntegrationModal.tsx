import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import type { CostModel, CostModelProvider } from 'api/costModels';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { getSourceType } from 'routes/settings/costModels/costModel/utils';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

interface DeleteIntegrationModalOwnProps {
  costModel: CostModel;
  isDispatch?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onDelete?: (uuids: string[]) => void;
  sources?: CostModelProvider[];
  uuid?: string;
}

interface DeleteIntegrationModalStateProps {
  costModelsUpdateError: AxiosError;
  costModelsUpdateStatus: FetchStatus;
}

type DeleteIntegrationModalProps = DeleteIntegrationModalOwnProps;

const DeleteIntegrationModal: React.FC<DeleteIntegrationModalProps> = ({
  costModel,
  isDispatch = true,
  isOpen = false,
  onClose,
  onDelete,
  sources,
  uuid,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const [isFinish, setIsFinish] = useState(false);
  const [payload, setPayload] = useState<string[]>([]);

  const { costModelsUpdateError, costModelsUpdateStatus } = useMapToProps();

  // Handlers

  const handleOnDelete = () => {
    if (costModelsUpdateStatus !== FetchStatus.inProgress) {
      const newSources = sources?.filter(item => item.uuid !== uuid);
      const uuids = newSources?.map(item => item.uuid);
      setPayload(uuids);

      if (isDispatch) {
        setIsFinish(true);
        dispatch(
          costModelsActions.updateCostModel(costModel?.uuid, {
            ...(costModel ?? {}),
            source_type: getSourceType(costModel?.source_type),
            source_uuids: uuids,
          })
        );
      } else {
        onDelete?.(uuids);
      }
    }
  };

  // Effects

  useEffect(() => {
    if (isFinish && costModelsUpdateStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!costModelsUpdateError) {
        onDelete?.(payload);
      }
    }
  }, [isFinish, costModel, costModelsUpdateError, costModelsUpdateStatus, onDelete, payload]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.small}>
      <ModalHeader
        className="iconOverride"
        title={intl.formatMessage(messages.costModelsSourceDeleteSource)}
        titleIconVariant="warning"
      />
      <ModalBody>
        {intl.formatMessage(messages.costModelsSourceDeleteSourceDesc, {
          source: <b>{sources?.find(item => item?.uuid === uuid)?.name ?? ''}</b>,
          costModel: <b>{costModel?.name ?? ''}</b>,
        })}
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleOnDelete} variant="danger">
          {intl.formatMessage(messages.delete)}
        </Button>
        <Button onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const useMapToProps = (): DeleteIntegrationModalStateProps => {
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

export { DeleteIntegrationModal };

import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import type { CostModel, CostModelProvider } from 'api/costModels';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { getSourceType } from 'routes/settings/costModel/costModels/utils';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions } from 'store/costModels';

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
  costModelsError: AxiosError;
  costModelsStatus: FetchStatus;
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

  const { costModelsError, costModelsStatus } = useMapToProps();

  // Handlers

  const handleOnDelete = () => {
    if (costModelsStatus !== FetchStatus.inProgress) {
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
    if (isFinish && costModelsStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!costModelsError) {
        onDelete?.(payload);
      }
    }
  }, [isFinish, costModel, costModelsError, costModelsStatus, onDelete, payload]);

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
  const costModelsError = useSelector((state: RootState) => state.costModels.update.error);
  const costModelsStatus = useSelector((state: RootState) => state.costModels.update.status);

  return {
    costModelsError,
    costModelsStatus,
  };
};

export { DeleteIntegrationModal };

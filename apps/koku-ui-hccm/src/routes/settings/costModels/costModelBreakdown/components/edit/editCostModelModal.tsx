import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { getSourceType } from 'routes/settings/costModels/costModel/utils';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

import { EditCostModelContent, type EditCostModelContentHandle } from './editCostModelContent';

interface EditCostModelModalOwnProps {
  costModel: CostModel;
  isDispatch?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (costModel: CostModel) => void;
}

interface EditCostModelModalStateProps {
  costModelsUpdateError: AxiosError;
  costModelsUpdateStatus: FetchStatus;
}

type EditCostModelModalProps = EditCostModelModalOwnProps;

const EditCostModelModal: React.FC<EditCostModelModalProps> = ({
  costModel,
  isDispatch = true,
  isOpen = false,
  onClose,
  onSave,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const contentRef = useRef<EditCostModelContentHandle>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFinish, setIsFinish] = useState(false);
  const [payload, setPayload] = useState<CostModel>();

  const { costModelsUpdateError, costModelsUpdateStatus } = useMapToProps();

  // Handlers

  const handleOnSave = (item: CostModel) => {
    if (costModelsUpdateStatus !== FetchStatus.inProgress) {
      const newCostModel = {
        ...(costModel ?? {}),
        ...item,
        source_type: getSourceType(costModel?.source_type),
      };
      setPayload(newCostModel);

      if (isDispatch) {
        setIsFinish(true);
        dispatch(costModelsActions.updateCostModel(costModel?.uuid, newCostModel));
      } else {
        onSave?.(newCostModel);
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
  }, [isFinish, costModel, costModelsUpdateError, costModelsUpdateStatus, onSave, payload]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.small}>
      <ModalHeader title={intl.formatMessage(messages.editCostModel)} />
      <ModalBody>
        {isOpen && (
          <EditCostModelContent
            costModel={costModel}
            onDisabled={setIsDisabled}
            onSave={handleOnSave}
            ref={contentRef}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          isAriaDisabled={isDisabled || costModelsUpdateStatus === FetchStatus.inProgress}
          onClick={() => contentRef.current?.save()}
          variant="primary"
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

const useMapToProps = (): EditCostModelModalStateProps => {
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

export { EditCostModelModal };

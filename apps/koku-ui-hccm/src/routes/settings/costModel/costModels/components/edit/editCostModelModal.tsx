import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions } from 'store/costModels';

import { EditCostModelContent, type EditCostModelContentHandle } from './editCostModelContent';
import { getSourceType } from './utils';

interface EditCostModelModalOwnProps {
  costModel: CostModel;
  isDispatch?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (costModel: CostModel) => void;
}

interface EditCostModelModalStateProps {
  costModelsError: AxiosError;
  costModelsStatus: FetchStatus;
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

  const { costModelsError, costModelsStatus } = useMapToProps();

  // Handlers

  const handleOnSave = (item: CostModel) => {
    if (costModelsStatus !== FetchStatus.inProgress) {
      if (isDispatch) {
        setIsFinish(true);
        dispatch(
          costModelsActions.updateCostModel(costModel?.uuid, {
            ...(costModel ?? {}),
            ...item,
            source_type: getSourceType(costModel?.source_type),
          })
        );
      } else {
        onSave?.(item);
      }
    }
  };

  // Effects

  useEffect(() => {
    if (isFinish && costModelsStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!costModelsError) {
        onSave?.(costModel);
      }
    }
  }, [isFinish, costModel, costModelsError, costModelsStatus, onSave]);

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
          isAriaDisabled={isDisabled || costModelsStatus === FetchStatus.inProgress}
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
  const costModelsError = useSelector((state: RootState) => state.costModels.update.error);
  const costModelsStatus = useSelector((state: RootState) => state.costModels.update.status);

  return {
    costModelsError,
    costModelsStatus,
  };
};

export { EditCostModelModal };

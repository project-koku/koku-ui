import './deleteCostModelModal.scss';

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
import { costModelsActions, costModelsSelectors } from 'store/costModels';

import type { DeleteCostModelContentHandle } from './deleteCostModelContent';
import { DeleteCostModelContent } from './deleteCostModelContent';

interface DeleteCostModelModalOwnProps {
  costModel: CostModel;
  isDispatch?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onDelete?: (costModel: CostModel) => void;
}

interface DeleteCostModelModalStateProps {
  costModelsDeleteError?: AxiosError;
  costModelsDeleteStatus?: FetchStatus;
}

type DeleteCostModelModalProps = DeleteCostModelModalOwnProps;

const DeleteCostModelModal: React.FC<DeleteCostModelModalProps> = ({
  costModel,
  isDispatch = true,
  isOpen,
  onClose,
  onDelete,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const contentRef = useRef<DeleteCostModelContentHandle>(null);
  const [isFinish, setIsFinish] = useState(false);

  const { costModelsDeleteError, costModelsDeleteStatus } = useMapToProps();

  const handleOnDelete = (item: CostModel) => {
    if (costModelsDeleteStatus !== FetchStatus.inProgress) {
      if (costModel?.uuid && isDispatch) {
        setIsFinish(true);
        dispatch(costModelsActions.deleteCostModel(costModel?.uuid));
      } else {
        onDelete?.(item);
      }
    }
  };

  // Effects

  useEffect(() => {
    if (isFinish && costModelsDeleteStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!costModelsDeleteError) {
        onDelete?.(costModel);
      }
    }
  }, [isFinish, costModel, costModelsDeleteError, costModelsDeleteStatus, onDelete]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.small}>
      <ModalHeader
        className="iconOverride"
        title={intl.formatMessage(messages.costModelsDelete)}
        titleIconVariant="warning"
      />
      <ModalBody>
        {isOpen && <DeleteCostModelContent costModel={costModel} onDelete={handleOnDelete} ref={contentRef} />}
      </ModalBody>
      <ModalFooter>
        {costModel?.sources?.length === 0 && (
          <Button onClick={() => contentRef.current?.delete()} variant="danger">
            {intl.formatMessage(messages.costModelsDelete)}
          </Button>
        )}
        <Button onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const useMapToProps = (): DeleteCostModelModalStateProps => {
  const costModelsDeleteError = useSelector((state: RootState) =>
    costModelsSelectors.selectCostModelsDeleteError(state)
  );
  const costModelsDeleteStatus = useSelector((state: RootState) =>
    costModelsSelectors.selectCostModelsDeleteStatus(state)
  );

  return {
    costModelsDeleteError,
    costModelsDeleteStatus,
  };
};

export { DeleteCostModelModal };

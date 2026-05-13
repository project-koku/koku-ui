import './deleteCostModelModal.scss';

import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useRef } from 'react';
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
  costModelsError?: AxiosError;
  costModelsStatus?: FetchStatus;
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
  const { costModelsStatus } = useMapToProps();

  const handleOnDelete = (costModelToDelete: CostModel) => {
    if (costModelsStatus !== FetchStatus.inProgress) {
      onDelete?.(costModelToDelete);

      if (isDispatch) {
        dispatch(costModelsActions.deleteCostModel(costModel?.uuid));
      }
    }
  };

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
  const costModelsError = useSelector((state: RootState) => costModelsSelectors.error(state));
  const costModelsStatus = useSelector((state: RootState) => costModelsSelectors.status(state));

  return {
    costModelsError,
    costModelsStatus,
  };
};

export { DeleteCostModelModal };

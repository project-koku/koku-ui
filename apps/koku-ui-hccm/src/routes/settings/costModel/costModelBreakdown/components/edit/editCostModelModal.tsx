import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import type { CostModel, CostModelRequest } from 'api/costModels';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
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
  costModelsError?: AxiosError;
  costModelsStatus?: FetchStatus;
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

  const { costModelsStatus } = useMapToProps();

  // Handlers

  const handleOnSave = (item: CostModel) => {
    onSave?.(item);

    if (isDispatch) {
      dispatch(costModelsActions.updateCostModel(item?.uuid, item as CostModelRequest));
    }
  };

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
  const costModelsError = useSelector((state: RootState) => costModelsSelectors.error(state));
  const costModelsStatus = useSelector((state: RootState) => costModelsSelectors.status(state));

  return {
    costModelsError,
    costModelsStatus,
  };
};

export { EditCostModelModal };

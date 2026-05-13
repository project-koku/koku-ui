import './deleteCostModelModal.scss';

import {
  Button,
  Content,
  ContentVariants,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import type { CostModels } from 'api/costModels';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { costModelsActions, costModelsSelectors } from 'store/costModels';

interface DeleteCostModelModalOwnProps {
  costModels: CostModels;
  costModelsIndex?: number;
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

interface DeleteCostModelModalStateProps {
  costModelsError?: AxiosError;
  costModelsStatus?: FetchStatus;
}

type DeleteCostModelModalProps = DeleteCostModelModalOwnProps;

const DeleteCostModelModal: React.FC<DeleteCostModelModalProps> = ({
  costModels,
  costModelsIndex,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const costModel = costModelsIndex < costModels?.data?.length ? costModels?.data?.[costModelsIndex] : undefined;
  const hasSources = costModel?.sources?.length > 0;
  const [isFinish, setIsFinish] = useState(false);

  const { costModelsError, costModelsStatus } = useMapToProps();

  const handleOnDelete = () => {
    if (costModelsStatus !== FetchStatus.inProgress) {
      setIsFinish(true);
      if (costModelsIndex <= costModels?.data?.length - 1) {
        dispatch(costModelsActions.deleteCostModel(costModel?.uuid));
      }
    }
  };

  useEffect(() => {
    if (isFinish && costModelsStatus === FetchStatus.complete && !costModelsError) {
      onSuccess?.();
    }
  }, [isFinish, costModelsError, costModelsStatus]);

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
        <Stack hasGutter>
          {hasSources ? (
            <>
              <StackItem>{intl.formatMessage(messages.costModelsDeleteSource)}</StackItem>
              <StackItem>
                {intl.formatMessage(messages.costModelsCanNotDelete, {
                  name: <b>{costModel?.name}</b>,
                })}
              </StackItem>
              <StackItem>
                <Content component={ContentVariants.ol}>
                  {costModel?.sources?.map((source, index) => (
                    <Content component={ContentVariants.li} key={`cost-model-${index}`}>
                      {source?.name || ''}
                    </Content>
                  ))}
                </Content>
              </StackItem>
            </>
          ) : (
            <StackItem>
              {intl.formatMessage(messages.costModelsDeleteDesc, {
                costModel: <b>{costModel?.name}</b>,
              })}
            </StackItem>
          )}
        </Stack>
      </ModalBody>
      <ModalFooter>
        {!hasSources && (
          <Button onClick={handleOnDelete} variant="danger">
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

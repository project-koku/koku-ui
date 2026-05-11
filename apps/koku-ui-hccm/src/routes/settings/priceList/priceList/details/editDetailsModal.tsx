import './editDetailsModal.scss';

import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceList';

import { DetailsContent, type DetailsContentHandle } from './detailsContent';

interface EditDetailsModalOwnProps {
  isOpen?: boolean;
  onClose?: () => void;
  onEdit?: (payload: PriceListData) => void;
  onSuccess?: () => void;
  priceList: PriceListData;
}

interface EditDetailsModalStateProps {
  priceListUpdateError?: AxiosError;
  priceListUpdateStatus?: FetchStatus;
}

type EditDetailsModalProps = EditDetailsModalOwnProps;

const EditDetailsModal: React.FC<EditDetailsModalProps> = ({ isOpen, onClose, onEdit, onSuccess, priceList }) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const contentRef = useRef<DetailsContentHandle>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFinish, setIsFinish] = useState(false);

  const { priceListUpdateError, priceListUpdateStatus } = useMapToProps();

  // Handlers

  const handleOnSave = (payload: PriceListData) => {
    setIsFinish(true);
    if (onEdit) {
      onEdit?.(payload);
    } else {
      dispatch(
        priceListActions.updatePriceList(PriceListType.priceListUpdate, priceList?.uuid, {
          ...(priceList ?? {}),
          ...payload,
        })
      );
    }
  };

  // Effects

  useEffect(() => {
    if (isOpen) {
      setIsFinish(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isFinish && priceListUpdateStatus === FetchStatus.complete && !priceListUpdateError) {
      onSuccess?.();
    }
  }, [isFinish, onSuccess, priceListUpdateError, priceListUpdateStatus]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.medium}>
      <ModalHeader title={intl.formatMessage(messages.editPriceListTitle)} />
      <ModalBody className="modalBodyOverride">
        {isOpen && (
          <DetailsContent
            isEditDetails
            onDisabled={setIsDisabled}
            onSave={handleOnSave}
            priceList={priceList}
            ref={contentRef}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          isAriaDisabled={isDisabled || priceListUpdateStatus === FetchStatus.inProgress}
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

const useMapToProps = (): EditDetailsModalStateProps => {
  const priceListUpdateError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateError(state, PriceListType.priceListUpdate, undefined)
  );
  const priceListUpdateStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateStatus(state, PriceListType.priceListUpdate, undefined)
  );

  return {
    priceListUpdateError,
    priceListUpdateStatus,
  };
};

export { EditDetailsModal };

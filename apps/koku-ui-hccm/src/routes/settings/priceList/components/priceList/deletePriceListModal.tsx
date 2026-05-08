import './deletePriceListModal.scss';

import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceList';

interface DeletePriceListModalOwnProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  priceList: PriceListData;
}

interface DeletePriceListModalMapProps {
  priceListType: PriceListType;
}

interface DeletePriceListModalStateProps {
  priceListUpdateError?: AxiosError;
  priceListUpdateStatus?: FetchStatus;
}

type DeletePriceListModalProps = DeletePriceListModalOwnProps;

const DeletePriceListModal: React.FC<DeletePriceListModalProps> = ({ isOpen, onClose, onSuccess, priceList }) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const priceListType = PriceListType.priceListRemove;
  const [isFinish, setIsFinish] = useState(false);
  const { priceListUpdateError, priceListUpdateStatus } = useMapToProps({ priceListType });

  const handleOnDelete = () => {
    if (priceListUpdateStatus !== FetchStatus.inProgress) {
      setIsFinish(true);
      dispatch(priceListActions.updatePriceList(priceListType, priceList?.uuid));
    }
  };

  useEffect(() => {
    if (isFinish && priceListUpdateStatus === FetchStatus.complete && !priceListUpdateError) {
      onSuccess?.();
    }
  }, [isFinish, priceListUpdateError, priceListUpdateStatus]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.medium}>
      <ModalHeader
        className="iconOverride"
        title={intl.formatMessage(messages.deletePriceListTitle)}
        titleIconVariant="warning"
      />
      <ModalBody>
        {intl.formatMessage(messages.deletePriceListDesc, {
          value: <b>{priceList?.name}</b>,
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

const useMapToProps = ({ priceListType }: DeletePriceListModalMapProps): DeletePriceListModalStateProps => {
  const priceListUpdateError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateError(state, priceListType, undefined)
  );
  const priceListUpdateStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateStatus(state, priceListType, undefined)
  );

  return {
    priceListUpdateError,
    priceListUpdateStatus,
  };
};

export { DeletePriceListModal };

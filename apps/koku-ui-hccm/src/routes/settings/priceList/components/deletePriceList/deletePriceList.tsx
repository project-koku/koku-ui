import './deletePriceList.scss';

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

interface DeletePriceListOwnProps {
  isOpen?: boolean;
  item: PriceListData;
  onClose?: () => void;
}

interface DeletePriceListMapProps {
  priceListType: PriceListType;
}

interface DeletePriceListStateProps {
  priceListUpdateError?: AxiosError;
  priceListUpdateFetchStatus?: FetchStatus;
}

type DeletePriceListProps = DeletePriceListOwnProps;

const DeletePriceList: React.FC<DeletePriceListProps> = ({ isOpen, item, onClose }) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const priceListType = PriceListType.priceListRemove;
  const [isFinish, setIsFinish] = useState(false);
  const { priceListUpdateError, priceListUpdateFetchStatus } = useMapToProps({ priceListType });

  const handleOnDelete = () => {
    if (priceListUpdateFetchStatus !== FetchStatus.inProgress) {
      setIsFinish(true);
      dispatch(priceListActions.updatePriceList(priceListType, item.uuid));
    }
  };

  useEffect(() => {
    if (isFinish && priceListUpdateFetchStatus === FetchStatus.complete && !priceListUpdateError) {
      onClose();
    }
  }, [isFinish, priceListUpdateError, priceListUpdateFetchStatus]);

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
          value: <b>{item.name}</b>,
        })}
      </ModalBody>
      <ModalFooter>
        <Button key="confirm" onClick={handleOnDelete} variant="danger">
          {intl.formatMessage(messages.delete)}
        </Button>
        <Button key="cancel" onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const useMapToProps = ({ priceListType }: DeletePriceListMapProps): DeletePriceListStateProps => {
  const priceListUpdateFetchStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateFetchStatus(state, priceListType)
  );
  const priceListUpdateError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateError(state, priceListType)
  );

  return {
    priceListUpdateError,
    priceListUpdateFetchStatus,
  };
};

export default DeletePriceList;

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
import { priceListActions, priceListSelectors } from 'store/priceLists';

interface DeletePriceListModalOwnProps {
  isDispatch?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onDelete?: (priceList: PriceListData) => void;
  priceList: PriceListData;
}

interface DeletePriceListModalStateProps {
  priceListError?: AxiosError;
  priceListFetchStatus?: FetchStatus;
}

type DeletePriceListModalProps = DeletePriceListModalOwnProps;

const DeletePriceListModal: React.FC<DeletePriceListModalProps> = ({
  isDispatch = true,
  isOpen,
  onClose,
  onDelete,
  priceList,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const [isFinish, setIsFinish] = useState(false);

  const { priceListError, priceListFetchStatus } = useMapToProps();

  const handleOnDelete = () => {
    if (priceListFetchStatus !== FetchStatus.inProgress) {
      if (isDispatch) {
        setIsFinish(true);
        dispatch(priceListActions.updatePriceList(PriceListType.priceListRemove, priceList?.uuid));
      } else {
        onDelete?.(priceList);
      }
    }
  };

  // Effects

  useEffect(() => {
    if (isFinish && priceListFetchStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!priceListError) {
        onDelete?.(priceList);
      }
    }
  }, [isFinish, onDelete, priceList, priceListError, priceListFetchStatus, onDelete]);

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

const useMapToProps = (): DeletePriceListModalStateProps => {
  const priceListError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListError(state, PriceListType.priceListRemove, undefined)
  );
  const priceListFetchStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListFetchStatus(state, PriceListType.priceListRemove, undefined)
  );

  return {
    priceListError,
    priceListFetchStatus,
  };
};

export { DeletePriceListModal };

import './deleteRateModal.scss';

import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import type { Rate } from 'api/rates';
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

import { DeleteRateContent, type DeleteRateContentHandle } from './deleteRateContent';

interface DeleteRateModalOwnProps {
  isOpen?: boolean;
  onClose?: () => void;
  onDelete?: (rates: Rate[]) => void;
  onDeleteSuccess?: () => void;
  priceList: PriceListData;
  rateIndex: number;
}

interface DeleteRateModalMapProps {
  priceListType: PriceListType;
}

interface DeleteRateModalStateProps {
  priceListUpdateError?: AxiosError;
  priceListUpdateStatus?: FetchStatus;
}

type DeleteRateModalProps = DeleteRateModalOwnProps;

const DeleteRateModal: React.FC<DeleteRateModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  onDeleteSuccess,
  priceList,
  rateIndex,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const priceListType = PriceListType.priceListUpdate;
  const rateContentRef = useRef<DeleteRateContentHandle>(null);

  const [isFinish, setIsFinish] = useState(false);
  const { priceListUpdateError, priceListUpdateStatus } = useMapToProps({ priceListType });

  const handleOnDelete = (rates: Rate[]) => {
    if (priceListUpdateStatus !== FetchStatus.inProgress) {
      setIsFinish(true);
      if (onDelete) {
        onDelete?.(rates);
      } else {
        dispatch(
          priceListActions.updatePriceList(priceListType, priceList?.uuid, {
            ...(priceList ?? {}),
            rates,
          })
        );
      }
    }
  };

  useEffect(() => {
    if (isFinish && priceListUpdateStatus === FetchStatus.complete && !priceListUpdateError) {
      onDeleteSuccess?.();
    }
  }, [isFinish, priceListUpdateError, priceListUpdateStatus]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.medium}>
      <ModalHeader
        className="iconOverride"
        title={intl.formatMessage(messages.deleteRateTitle)}
        titleIconVariant="warning"
      />
      <ModalBody>
        <DeleteRateContent onDelete={handleOnDelete} priceList={priceList} ref={rateContentRef} rateIndex={rateIndex} />
      </ModalBody>
      <ModalFooter>
        <Button
          isAriaDisabled={priceListUpdateStatus === FetchStatus.inProgress}
          onClick={() => rateContentRef.current?.submit()}
          variant="danger"
        >
          {intl.formatMessage(messages.delete)}
        </Button>
        <Button onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const useMapToProps = ({ priceListType }: DeleteRateModalMapProps): DeleteRateModalStateProps => {
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

export { DeleteRateModal };

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
import { priceListActions, priceListSelectors } from 'store/priceLists';

import { DeleteRateContent, type DeleteRateContentHandle } from './deleteRateContent';

interface DeleteRateModalOwnProps {
  isDispatch?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onDelete?: (rates: Rate[]) => void;
  priceList: PriceListData;
  rateIndex: number;
}

interface DeleteRateModalStateProps {
  priceListError?: AxiosError;
  priceListFetchStatus?: FetchStatus;
}

type DeleteRateModalProps = DeleteRateModalOwnProps;

const DeleteRateModal: React.FC<DeleteRateModalProps> = ({
  isDispatch = true,
  isOpen,
  onClose,
  onDelete,
  priceList,
  rateIndex,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const contentRef = useRef<DeleteRateContentHandle>(null);
  const [isFinish, setIsFinish] = useState(false);
  const [rates, setRates] = useState<Rate[]>([]);

  const { priceListError, priceListFetchStatus } = useMapToProps();

  const handleOnDelete = (items: Rate[]) => {
    if (priceListFetchStatus !== FetchStatus.inProgress) {
      if (isDispatch) {
        setIsFinish(true);
        setRates(items);

        dispatch(
          priceListActions.updatePriceList(PriceListType.priceListUpdate, priceList?.uuid, {
            ...(priceList ?? {}),
            rates: items,
          })
        );
      } else {
        onDelete?.(items);
      }
    }
  };

  // Effects

  useEffect(() => {
    if (isFinish && priceListFetchStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!priceListError) {
        onDelete?.(rates);
      }
    }
  }, [isFinish, onDelete, priceListError, priceListFetchStatus, rates]);

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
        {isOpen && (
          <DeleteRateContent onDelete={handleOnDelete} priceList={priceList} ref={contentRef} rateIndex={rateIndex} />
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          isAriaDisabled={priceListFetchStatus === FetchStatus.inProgress}
          onClick={() => contentRef.current?.delete()}
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

const useMapToProps = (): DeleteRateModalStateProps => {
  const priceListError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListError(state, PriceListType.priceListUpdate, undefined)
  );
  const priceListFetchStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListFetchStatus(state, PriceListType.priceListUpdate, undefined)
  );

  return {
    priceListError,
    priceListFetchStatus,
  };
};

export { DeleteRateModal };

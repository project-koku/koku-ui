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

import { RatesContent, type RatesContentHandle } from '../ratesContent';
import { styles } from './addRateModal.styles';

interface AddRateModalOwnProps {
  isDispatch?: boolean;
  isOpen?: boolean;
  onAdd?: (rates: Rate[]) => void;
  onClose?: () => void;
  onSuccess?: () => void;
  priceList: PriceListData;
  rateIndex?: number;
}

interface AddRateModalStateProps {
  priceListUpdateError?: AxiosError;
  priceListUpdateStatus?: FetchStatus;
}

type AddRateModalProps = AddRateModalOwnProps;

/**
 * Modal shell around {@link RatesContent}: footer Save calls `RateContent`’s `submit()` imperatively;
 * `RateContent` builds merged `rates[]` and reports them via `onCommitRates` for the PUT payload.
 */
const AddRateModal: React.FC<AddRateModalProps> = ({
  isDispatch = true,
  isOpen,
  onAdd,
  onClose,
  onSuccess,
  priceList,
  rateIndex,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const contentRef = useRef<RatesContentHandle>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFinish, setIsFinish] = useState(false);

  const { priceListUpdateError, priceListUpdateStatus } = useMapToProps();

  // Handlers

  const handleOnSave = (rates: Rate[]) => {
    setIsFinish(true);
    onAdd?.(rates);

    if (isDispatch) {
      dispatch(
        priceListActions.updatePriceList(PriceListType.priceListUpdate, priceList?.uuid, {
          ...(priceList ?? {}),
          rates,
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

  return (
    <Modal
      className="costManagement"
      isOpen={isOpen}
      onClose={onClose}
      style={styles.modal}
      variant={ModalVariant.large}
    >
      <ModalHeader title={intl.formatMessage(messages.priceListAddRate)} />
      <ModalBody>
        <RatesContent
          isAddRate
          onDisabled={setIsDisabled}
          onSave={handleOnSave}
          priceList={priceList}
          rateIndex={rateIndex}
          ref={contentRef}
        />
      </ModalBody>
      <ModalFooter>
        <Button
          isAriaDisabled={isDisabled || priceListUpdateStatus === FetchStatus.inProgress}
          onClick={() => contentRef.current?.save()}
          variant="primary"
        >
          {intl.formatMessage(messages.priceListAddRate)}
        </Button>
        <Button onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const useMapToProps = (): AddRateModalStateProps => {
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

export { AddRateModal };

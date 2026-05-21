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

import { RateContent, type RateContentHandle } from '../rateContent';
import { styles } from './addRateModal.styles';

interface AddRateModalOwnProps {
  isDispatch?: boolean;
  isOpen?: boolean;
  onAdd?: (rates: Rate[]) => void;
  onClose?: () => void;
  priceList: PriceListData;
}

interface AddRateModalStateProps {
  priceListUpdateError?: AxiosError;
  priceListUpdateStatus?: FetchStatus;
}

type AddRateModalProps = AddRateModalOwnProps;

/**
 * Modal shell around {@link RateContent}: footer Save calls `RateContent`’s `submit()` imperatively;
 * `RateContent` builds merged `rates[]` and reports them via `onCommitRates` for the PUT payload.
 */
const AddRateModal: React.FC<AddRateModalProps> = ({ isDispatch = true, isOpen, onAdd, onClose, priceList }) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const contentRef = useRef<RateContentHandle>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFinish, setIsFinish] = useState(false);
  const [rates, setRates] = useState<Rate[]>([]);

  const { priceListUpdateError, priceListUpdateStatus } = useMapToProps();

  // Handlers

  const handleOnSave = (items: Rate[]) => {
    if (priceListUpdateStatus !== FetchStatus.inProgress) {
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
        onAdd?.(items);
      }
    }
  };

  // Effects

  useEffect(() => {
    if (isFinish && priceListUpdateStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!priceListUpdateError) {
        onAdd?.(rates);
      }
    }
  }, [isFinish, onAdd, priceListUpdateError, priceListUpdateStatus, rates]);

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
        {isOpen && (
          <RateContent
            isAddRate
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

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
import { priceListActions, priceListSelectors } from 'store/priceLists';

import { DetailContent, type DetailContentHandle } from './detailContent';

interface EditDetailModalOwnProps {
  isDispatch?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onEdit?: (priceList: PriceListData) => void;
  priceList: PriceListData;
}

interface EditDetailModalStateProps {
  priceListError?: AxiosError;
  priceListFetchStatus?: FetchStatus;
}

type EditDetailModalProps = EditDetailModalOwnProps;

const EditDetailModal: React.FC<EditDetailModalProps> = ({ isDispatch = true, isOpen, onClose, onEdit, priceList }) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const contentRef = useRef<DetailContentHandle>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFinish, setIsFinish] = useState(false);
  const [pList, setPricelist] = useState<PriceListData>();

  const { priceListError, priceListFetchStatus } = useMapToProps();

  // Handlers

  const handleOnSave = (item: PriceListData) => {
    if (priceListFetchStatus !== FetchStatus.inProgress) {
      if (priceList?.uuid && isDispatch) {
        setIsFinish(true);
        setPricelist(item);

        dispatch(
          priceListActions.updatePriceList(PriceListType.priceListUpdate, priceList?.uuid, {
            ...(priceList ?? {}),
            ...item,
          })
        );
      } else {
        onEdit?.(item);
      }
    }
  };

  // Effects

  useEffect(() => {
    if (isFinish && priceListFetchStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!priceListError) {
        onEdit?.(pList);
      }
    }
  }, [isFinish, onEdit, priceListError, priceListFetchStatus, pList]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.medium}>
      <ModalHeader title={intl.formatMessage(messages.editPriceListTitle)} />
      <ModalBody>
        {isOpen && (
          <DetailContent
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
          isAriaDisabled={isDisabled || priceListFetchStatus === FetchStatus.inProgress}
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

const useMapToProps = (): EditDetailModalStateProps => {
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

export { EditDetailModal };

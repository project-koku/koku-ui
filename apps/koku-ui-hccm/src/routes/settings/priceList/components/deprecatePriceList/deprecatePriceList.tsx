import './deprecatePriceList.scss';

import {
  Button,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import { getQuery } from 'api/queries/query';
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

interface DeprecatePriceListOwnProps {
  isOpen?: boolean;
  item: PriceListData;
  onClose?: () => void;
}

interface DeprecatePriceListMapProps {
  priceListType: PriceListType;
}

interface DeprecatePriceListStateProps {
  priceListUpdateError?: AxiosError;
  priceListUpdateFetchStatus?: FetchStatus;
}

type DeprecatePriceListProps = DeprecatePriceListOwnProps;

const DeprecatePriceList: React.FC<DeprecatePriceListProps> = ({ isOpen, item, onClose }) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const priceListType = PriceListType.priceListUpdate;
  const [isFinish, setIsFinish] = useState(false);
  const { priceListUpdateError, priceListUpdateFetchStatus } = useMapToProps({ priceListType });

  const handleOnDeprecate = () => {
    if (priceListUpdateFetchStatus !== FetchStatus.inProgress) {
      setIsFinish(true);
      const query = {
        uuid: item.uuid,
      };
      const queryString = getQuery(query);
      dispatch(
        priceListActions.updatePriceList(priceListType, queryString, {
          enable: false,
        })
      );
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
        title={intl.formatMessage(messages.deprecatePriceListTitle)}
        titleIconVariant="warning"
      />
      <ModalBody>
        <p>{intl.formatMessage(messages.deprecatePriceListDesc)}</p>
        <br />
        <List>
          <ListItem>{intl.formatMessage(messages.deprecatePriceListItem1)}</ListItem>
          <ListItem>{intl.formatMessage(messages.deprecatePriceListItem2)}</ListItem>
          <ListItem>{intl.formatMessage(messages.deprecatePriceListItem3)}</ListItem>
        </List>
      </ModalBody>
      <ModalFooter>
        <Button key="confirm" onClick={handleOnDeprecate}>
          {intl.formatMessage(messages.deprecate)}
        </Button>
        <Button key="cancel" onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const useMapToProps = ({ priceListType }: DeprecatePriceListMapProps): DeprecatePriceListStateProps => {
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

export default DeprecatePriceList;

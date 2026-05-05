import './deleteRateModal.scss';

import {
  Button,
  Content,
  ContentVariants,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  Stack,
  StackItem,
} from '@patternfly/react-core';
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

interface DeleteRateModalOwnProps {
  isOpen?: boolean;
  onClose?: () => void;
  onUpdateSuccess?: () => void;
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
  onUpdateSuccess,
  priceList,
  rateIndex,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const priceListType = PriceListType.priceListUpdate;
  const [isFinish, setIsFinish] = useState(false);
  const { priceListUpdateError, priceListUpdateStatus } = useMapToProps({ priceListType });

  const handleOnDelete = () => {
    if (priceListUpdateStatus !== FetchStatus.inProgress) {
      setIsFinish(true);
      dispatch(
        priceListActions.updatePriceList(priceListType, priceList?.uuid, {
          rates: priceList?.rates?.filter((_, index) => index !== rateIndex) ?? [],
        })
      );
    }
  };

  useEffect(() => {
    if (isFinish && priceListUpdateStatus === FetchStatus.complete && !priceListUpdateError) {
      onUpdateSuccess?.();
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
        <Stack hasGutter>
          <StackItem>
            <Content>
              {intl.formatMessage(messages.deleteRateDesc, {
                metric: (
                  <b>
                    {priceList?.rates?.[rateIndex]?.metric?.label_metric || priceList?.rates?.[rateIndex]?.metric?.name}
                  </b>
                ),
                priceList: <b>{priceList?.name || ''}</b>,
                count: priceList?.assigned_cost_model_count > 0 ? 2 : 1,
              })}
            </Content>
          </StackItem>
          {priceList?.assigned_cost_model_count > 0 && (
            <>
              <StackItem>
                <Content component={ContentVariants.ol}>
                  {priceList?.assigned_cost_models?.map((costModel, index) => (
                    <Content component={ContentVariants.li} key={`cost-model-${index}`}>
                      {costModel?.name || ''}
                    </Content>
                  ))}
                </Content>
              </StackItem>
              <StackItem>
                <Content component={ContentVariants.ul}>
                  <Content component={ContentVariants.li}>
                    {intl.formatMessage(messages.recalculateCurrentMonthDesc)}
                  </Content>
                  <Content component={ContentVariants.li}>
                    {intl.formatMessage(messages.recalculatePreviousMonthDesc)}
                  </Content>
                </Content>
              </StackItem>
            </>
          )}
        </Stack>
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

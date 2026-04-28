import { useAddNotification } from '@redhat-cloud-services/frontend-components-notifications/hooks';
import type { PriceListData } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import type { AxiosError } from 'axios';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceList';

interface PriceListUpdateProps {
  type: PriceListType;
}

interface PriceListNotificationProps {
  error: AxiosError;
  notification: Notification;
  status: FetchStatus;
}

export function usePriceListDuplicate(item: PriceListData, onUpdateSuccess?: () => void) {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const [isAwaitingUpdate, setIsAwaitingUpdate] = useState(false);
  const onSuccessRef = useRef(onUpdateSuccess);

  useLayoutEffect(() => {
    onSuccessRef.current = onUpdateSuccess;
  }, [onUpdateSuccess]);

  const priceListUpdateStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateStatus(state, PriceListType.priceListDuplicate)
  );
  const priceListUpdateError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateError(state, PriceListType.priceListDuplicate)
  );

  const duplicatePriceList = () => {
    if (priceListUpdateStatus !== FetchStatus.inProgress) {
      setIsAwaitingUpdate(true);
      dispatch(priceListActions.updatePriceList(PriceListType.priceListDuplicate, item.uuid));
    }
  };

  useEffect(() => {
    if (!isAwaitingUpdate || priceListUpdateStatus !== FetchStatus.complete) {
      return;
    }
    if (priceListUpdateError) {
      setIsAwaitingUpdate(false);
      return;
    }
    setIsAwaitingUpdate(false);
    onSuccessRef.current?.();
  }, [isAwaitingUpdate, priceListUpdateError, priceListUpdateStatus]);

  return { duplicatePriceList };
}

export function usePriceListEnabledToggle(item: PriceListData, onUpdateSuccess?: () => void) {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const [isAwaitingUpdate, setIsAwaitingUpdate] = useState(false);
  const onSuccessRef = useRef(onUpdateSuccess);

  useLayoutEffect(() => {
    onSuccessRef.current = onUpdateSuccess;
  }, [onUpdateSuccess]);

  const priceListUpdateStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateStatus(state, PriceListType.priceListUpdate)
  );
  const priceListUpdateError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateError(state, PriceListType.priceListUpdate)
  );

  const togglePriceListEnabled = () => {
    if (priceListUpdateStatus !== FetchStatus.inProgress) {
      setIsAwaitingUpdate(true);
      dispatch(
        priceListActions.updatePriceList(PriceListType.priceListUpdate, item.uuid, {
          name: item.name,
          effective_end_date: item.effective_end_date,
          effective_start_date: item.effective_start_date,
          enabled: !item.enabled,
        })
      );
    }
  };

  useEffect(() => {
    if (!isAwaitingUpdate || priceListUpdateStatus !== FetchStatus.complete) {
      return;
    }
    if (priceListUpdateError) {
      setIsAwaitingUpdate(false);
      return;
    }
    setIsAwaitingUpdate(false);
    onSuccessRef.current?.();
  }, [isAwaitingUpdate, priceListUpdateError, priceListUpdateStatus]);

  return { togglePriceListEnabled };
}

export const usePriceListUpdate = ({ type }: PriceListUpdateProps): PriceListNotificationProps => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const addNotification = useAddNotification();

  const error = useSelector((state: RootState) => priceListSelectors.selectPriceListUpdateError(state, type)) as
    | AxiosError
    | undefined;
  const notification = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateNotification(state, type)
  );
  const status = useSelector((state: RootState) => priceListSelectors.selectPriceListUpdateStatus(state, type));

  useEffect(() => {
    if (status === FetchStatus.complete && notification) {
      addNotification(notification as any);
      dispatch(priceListActions.resetNotification());
      dispatch(priceListActions.resetStatus());
    }
  }, [addNotification, dispatch, error, notification, status]);

  return { error, notification, status };
};

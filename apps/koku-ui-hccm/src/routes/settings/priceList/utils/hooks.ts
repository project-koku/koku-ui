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
  isNotificationEnabled?: boolean;
  priceListType: PriceListType;
  uuid?: string;
  queryString?: string;
}

interface PriceListNotificationProps {
  error: AxiosError;
  notification: Notification;
  status: FetchStatus;
}

export function usePriceListDuplicate(priceList: PriceListData, onUpdateSuccess?: () => void) {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const [isAwaitingUpdate, setIsAwaitingUpdate] = useState(false);
  const onSuccessRef = useRef(onUpdateSuccess);

  useLayoutEffect(() => {
    onSuccessRef.current = onUpdateSuccess;
  }, [onUpdateSuccess]);

  const priceListUpdateStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateStatus(state, PriceListType.priceListDuplicate, undefined)
  );
  const priceListUpdateError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateError(state, PriceListType.priceListDuplicate, undefined)
  );

  const duplicatePriceList = () => {
    if (priceListUpdateStatus !== FetchStatus.inProgress) {
      setIsAwaitingUpdate(true);
      dispatch(priceListActions.updatePriceList(PriceListType.priceListDuplicate, priceList?.uuid));
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

export function usePriceListEnabledToggle(priceList: PriceListData, onUpdateSuccess?: () => void) {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const [isAwaitingUpdate, setIsAwaitingUpdate] = useState(false);
  const onSuccessRef = useRef(onUpdateSuccess);

  useLayoutEffect(() => {
    onSuccessRef.current = onUpdateSuccess;
  }, [onUpdateSuccess]);

  const priceListUpdateStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateStatus(state, PriceListType.priceListUpdate, undefined)
  );
  const priceListUpdateError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateError(state, PriceListType.priceListUpdate, undefined)
  );

  const togglePriceListEnabled = () => {
    if (priceListUpdateStatus !== FetchStatus.inProgress) {
      setIsAwaitingUpdate(true);
      dispatch(
        priceListActions.updatePriceList(PriceListType.priceListUpdate, priceList?.uuid, {
          name: priceList?.name,
          effective_end_date: priceList?.effective_end_date,
          effective_start_date: priceList?.effective_start_date,
          enabled: !priceList?.enabled,
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

export const usePriceListUpdate = ({
  isNotificationEnabled = true,
  priceListType,
  queryString,
}: PriceListUpdateProps): PriceListNotificationProps => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const addNotification = useAddNotification();

  const error = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateError(state, priceListType, queryString)
  ) as AxiosError | undefined;
  const notification = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateNotification(state, priceListType, queryString)
  );
  const status = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateStatus(state, priceListType, queryString)
  );

  useEffect(() => {
    if (status === FetchStatus.complete && notification) {
      if (isNotificationEnabled) {
        addNotification(notification as any);
      }
      dispatch(priceListActions.resetNotification());
      dispatch(priceListActions.resetStatus());
    }
  }, [addNotification, dispatch, error, isNotificationEnabled, notification, status]);

  return { error, notification, status };
};

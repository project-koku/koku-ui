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
import { priceListActions, priceListSelectors } from 'store/priceLists';

interface NotificationProps {
  error: AxiosError;
  isNotificationEnabled?: boolean;
  notification: Notification;
  status: FetchStatus;
}

export function usePriceListDuplicate(priceList: PriceListData, onUpdateSuccess?: () => void) {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const [isAwaitingUpdate, setIsAwaitingUpdate] = useState(false);
  const currentRef = useRef(onUpdateSuccess);

  useLayoutEffect(() => {
    currentRef.current = onUpdateSuccess;
  }, [onUpdateSuccess]);

  const priceListError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListError(state, PriceListType.priceListDuplicate, undefined)
  );
  const priceListFetchStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListFetchStatus(state, PriceListType.priceListDuplicate, undefined)
  );

  const duplicatePriceList = () => {
    if (priceList?.uuid && priceListFetchStatus !== FetchStatus.inProgress) {
      setIsAwaitingUpdate(true);
      dispatch(priceListActions.updatePriceList(PriceListType.priceListDuplicate, priceList?.uuid));
    }
  };

  useEffect(() => {
    if (!isAwaitingUpdate || priceListFetchStatus !== FetchStatus.complete) {
      return;
    }
    if (priceListError) {
      setIsAwaitingUpdate(false);
      return;
    }
    setIsAwaitingUpdate(false);
    currentRef.current?.();
  }, [isAwaitingUpdate, priceListError, priceListFetchStatus]);

  return { duplicatePriceList };
}

export function usePriceListEnabledToggle(priceList: PriceListData, onDeprecate?: () => void) {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const [isAwaitingUpdate, setIsAwaitingUpdate] = useState(false);
  const currentRef = useRef(onDeprecate);

  useLayoutEffect(() => {
    currentRef.current = onDeprecate;
  }, [onDeprecate]);

  const priceListError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListError(state, PriceListType.priceListUpdate, undefined)
  );
  const priceListFetchStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListFetchStatus(state, PriceListType.priceListUpdate, undefined)
  );

  const togglePriceListEnabled = () => {
    if (priceList?.uuid && priceListFetchStatus !== FetchStatus.inProgress) {
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
    if (!isAwaitingUpdate || priceListFetchStatus !== FetchStatus.complete) {
      return;
    }
    if (priceListError) {
      setIsAwaitingUpdate(false);
      return;
    }
    setIsAwaitingUpdate(false);
    currentRef.current?.();
  }, [isAwaitingUpdate, priceListError, priceListFetchStatus]);

  return { togglePriceListEnabled };
}

// Notifications

const useNotification = ({ error, isNotificationEnabled = true, notification, status }: NotificationProps) => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>();
  const addNotification = useAddNotification();

  useEffect(() => {
    if ((error || status === FetchStatus.complete) && notification) {
      if (isNotificationEnabled) {
        addNotification(notification as any);
      }
      dispatch(priceListActions.resetNotifications());
      dispatch(priceListActions.resetStatus());
    }
  }, [addNotification, dispatch, error, isNotificationEnabled, notification, status]);
};

export const usePriceListAddNotification = (isNotificationEnabled: boolean) => {
  const error = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListError(state, PriceListType.priceListAdd, undefined)
  ) as AxiosError | undefined;
  const notification = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListNotification(state, PriceListType.priceListAdd, undefined)
  );
  const status = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListFetchStatus(state, PriceListType.priceListAdd, undefined)
  );

  useNotification({ error, isNotificationEnabled, notification, status });
};

export const usePriceListDuplicateNotification = (isNotificationEnabled: boolean) => {
  const error = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListError(state, PriceListType.priceListDuplicate, undefined)
  ) as AxiosError | undefined;
  const notification = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListNotification(state, PriceListType.priceListDuplicate, undefined)
  );
  const status = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListFetchStatus(state, PriceListType.priceListDuplicate, undefined)
  );

  useNotification({ error, isNotificationEnabled, notification, status });
};

export const usePriceListRemoveNotification = (isNotificationEnabled: boolean) => {
  const error = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListError(state, PriceListType.priceListRemove, undefined)
  ) as AxiosError | undefined;
  const notification = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListNotification(state, PriceListType.priceListRemove, undefined)
  );
  const status = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListFetchStatus(state, PriceListType.priceListRemove, undefined)
  );

  useNotification({ error, isNotificationEnabled, notification, status });
};

export const usePriceListUpdateNotification = (isNotificationEnabled: boolean) => {
  const error = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListError(state, PriceListType.priceListUpdate, undefined)
  ) as AxiosError | undefined;
  const notification = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListNotification(state, PriceListType.priceListUpdate, undefined)
  );
  const status = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListFetchStatus(state, PriceListType.priceListUpdate, undefined)
  );

  useNotification({ error, isNotificationEnabled, notification, status });
};

export const usePriceListNotifications = (isNotificationEnabled = true) => {
  usePriceListAddNotification(isNotificationEnabled);
  usePriceListDuplicateNotification(isNotificationEnabled);
  usePriceListRemoveNotification(isNotificationEnabled);
  usePriceListUpdateNotification(isNotificationEnabled);
};

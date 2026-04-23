import type { PriceListData } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceList';

const priceListType = PriceListType.priceListUpdate;

export function usePriceListEnabledToggle(item: PriceListData, onUpdateSuccess?: () => void) {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const [isAwaitingUpdate, setIsAwaitingUpdate] = useState(false);
  const onSuccessRef = useRef(onUpdateSuccess);

  useLayoutEffect(() => {
    onSuccessRef.current = onUpdateSuccess;
  }, [onUpdateSuccess]);

  const PriceListUpdateStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateStatus(state, priceListType)
  );
  const priceListUpdateError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListUpdateError(state, priceListType)
  );

  const togglePriceListEnabled = () => {
    if (PriceListUpdateStatus !== FetchStatus.inProgress) {
      setIsAwaitingUpdate(true);
      dispatch(
        priceListActions.updatePriceList(priceListType, item.uuid, {
          enabled: !item.enabled,
          name: item.name,
        })
      );
    }
  };

  useEffect(() => {
    if (!isAwaitingUpdate || PriceListUpdateStatus !== FetchStatus.complete) {
      return;
    }
    if (priceListUpdateError) {
      setIsAwaitingUpdate(false);
      return;
    }
    setIsAwaitingUpdate(false);
    onSuccessRef.current?.();
  }, [isAwaitingUpdate, priceListUpdateError, PriceListUpdateStatus]);

  return { togglePriceListEnabled };
}

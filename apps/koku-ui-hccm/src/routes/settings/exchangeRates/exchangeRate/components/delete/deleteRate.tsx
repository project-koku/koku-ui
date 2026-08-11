import type { SettingsData, SettingsRateData } from 'api/settings';
import { SettingsType } from 'api/settings';
import type { AxiosError } from 'axios';
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { settingsActions, settingsSelectors } from 'store/settings';

export interface DeleteRateHandle {
  delete: () => void;
}

interface DeleteRateOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  isDispatch?: boolean;
  onClose?: () => void;
  onDelete?: (rate: SettingsRateData) => void;
  settings: SettingsData[];
  uuid?: string;
}

interface DeleteRateStateProps {
  settingsError?: AxiosError;
  settingsFetchStatus?: FetchStatus;
}

type DeleteRateProps = DeleteRateOwnProps;

const findRateByUuid = (settings: SettingsData[] | undefined, uuid?: string) =>
  settings?.flatMap(item => item.static_rates ?? []).find(item => item.uuid === uuid);

const DeleteRate = forwardRef<DeleteRateHandle, DeleteRateProps>((props, ref) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const { isDispatch = true, onDelete, settings, uuid } = props;

  const [isFinish, setIsFinish] = useState(false);
  const [rate, setRate] = useState<SettingsRateData>();

  /** Latest delete handler for imperative `delete()` — updated in layout effect (not during render). */
  const currentHandlerRef = useRef<() => void>(() => {});

  const { settingsError, settingsFetchStatus } = useMapToProps();

  useImperativeHandle(
    ref,
    () => ({
      delete: () => {
        currentHandlerRef.current();
      },
    }),
    []
  );

  // Handlers

  const handleOnDelete = () => {
    if (uuid && settingsFetchStatus !== FetchStatus.inProgress) {
      const deletedRate = findRateByUuid(settings, uuid);

      if (isDispatch) {
        setIsFinish(true);
        setRate(deletedRate);

        dispatch(
          settingsActions.updateCurrencySettings({
            settingsType: SettingsType.currencyDelete,
            uuid,
          })
        );
      } else {
        onDelete?.(deletedRate);
      }
    }
  };

  useLayoutEffect(() => {
    currentHandlerRef.current = handleOnDelete;
  });

  // Effects

  useEffect(() => {
    if (isFinish && settingsFetchStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!settingsError) {
        onDelete?.(rate);
      }
    }
  }, [isFinish, onDelete, settingsError, settingsFetchStatus, rate]);

  return null;
});

const useMapToProps = (): DeleteRateStateProps => {
  const settingsError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsError(state, SettingsType.currencyDelete, undefined)
  );
  const settingsFetchStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsFetchStatus(state, SettingsType.currencyDelete, undefined)
  );

  return {
    settingsError,
    settingsFetchStatus,
  };
};

DeleteRate.displayName = 'DeleteRate';

export { DeleteRate };

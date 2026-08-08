import { Switch } from '@patternfly/react-core';
import type { SettingsCurrencyData } from 'api/settings';
import { SettingsType } from 'api/settings';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { settingsActions, settingsSelectors } from 'store/settings';

interface EnableRateOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  isDispatch?: boolean;
  onEnable?: (isEnabled) => void;
  settings?: SettingsCurrencyData;
}

export interface EnableRateMapProps {
  isEnabled?: boolean;
}

interface EnableRateStateProps {
  settingsError?: AxiosError;
  settingsFetchStatus?: FetchStatus;
}

type EnableRateProps = EnableRateOwnProps;

const EnableRate: React.FC<EnableRateProps> = ({ canWrite, isDisabled, isDispatch = true, onEnable, settings }) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const [isEnabled, setEnabled] = useState(settings?.enabled);
  const [isEnabledBaseline] = useState(settings?.enabled);
  const [isFinish, setIsFinish] = useState(false);

  const { settingsError, settingsFetchStatus } = useMapToProps({ isEnabled });

  // Handlers

  const handleOnChange = (checked: boolean) => {
    if (settings?.code && settingsFetchStatus !== FetchStatus.inProgress) {
      if (isDispatch) {
        setIsFinish(true);
        setEnabled(checked);

        dispatch(
          settingsActions.updateCurrencySettings({
            settingsType: checked ? SettingsType.currencyEnable : SettingsType.currencyDisable,
            code: settings.code,
          })
        );
      } else {
        onEnable?.(checked);
      }
    }
  };

  // Effects

  useEffect(() => {
    setEnabled(settings?.enabled);
  }, [settings?.code, settings?.enabled]);

  useEffect(() => {
    if (isFinish && settingsFetchStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!settingsError) {
        onEnable?.(isEnabled);
      } else {
        setEnabled(isEnabledBaseline); // Restore baseline upon failure
      }
    }
  }, [isEnabled, isFinish, onEnable, settingsError, settingsFetchStatus]);

  return (
    <Switch
      aria-label={intl.formatMessage(messages.exchangeRateEnableAriaLabel)}
      id={`currency-enable-${settings?.code ?? ''}`}
      isChecked={isEnabled}
      onChange={(_evt, checked: boolean) => handleOnChange(checked)}
      isDisabled={!canWrite || isDisabled}
    />
  );
};

const useMapToProps = ({ isEnabled }: EnableRateMapProps): EnableRateStateProps => {
  const settingsType = isEnabled ? SettingsType.currencyEnable : SettingsType.currencyDisable;

  const settingsError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsError(state, settingsType, undefined)
  );
  const settingsFetchStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsFetchStatus(state, settingsType, undefined)
  );

  return {
    settingsError,
    settingsFetchStatus,
  };
};

export { EnableRate };

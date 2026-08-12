import { Divider, Switch, Tooltip } from '@patternfly/react-core';
import { AccountSettingsType } from 'api/accountSettings';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { ResourcePathsType } from 'api/resources/resource';
import type { SettingsData, SettingsRateData } from 'api/settings';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { Currency } from 'routes/components/currency';
import { BasicToolbar } from 'routes/components/dataToolbar';
import type { ToolbarChipGroupExt } from 'routes/components/dataToolbar/utils/common';
import type { Filter } from 'routes/utils/filter';
import type { RootState } from 'store';
import { accountSettingsActions, accountSettingsSelectors } from 'store/accountSettings';
import { FetchStatus } from 'store/common';
import { getAccountCurrency } from 'utils/sessionStorage';

import { AddRate } from './components/add';

interface ExchangeRateToolbarOwnProps {
  canWrite?: boolean;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  isShowDisabled?: boolean;
  itemsPerPage?: number;
  itemsTotal?: number;
  onAdd?: (rate: SettingsRateData) => void;
  onClose?: () => void;
  onCurrency?: () => void;
  onFilterAdded(filter: Filter);
  onFilterRemoved(filter: Filter);
  onShowDeprecated(checked: boolean);
  pagination?: React.ReactNode;
  query?: OcpQuery;
  settings?: SettingsData[];
}

export interface ExchangeRateStateProps {
  settingsError?: AxiosError;
  settingsFetchStatus?: FetchStatus;
}

type ExchangeRateToolbarProps = ExchangeRateToolbarOwnProps;

const ExchangeRateToolbar: React.FC<ExchangeRateToolbarProps> = ({
  canWrite,
  isAllSelected,
  isDisabled,
  isShowDisabled,
  itemsPerPage,
  itemsTotal,
  onAdd,
  onClose,
  onCurrency,
  onFilterAdded,
  onFilterRemoved,
  onShowDeprecated,
  pagination,
  query,
  settings,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  // Getters

  const getActions = () => {
    const addRateAction = (
      <AddRate canWrite={canWrite} isDisabled={isDisabled} onAdd={onAdd} onClose={onClose} settings={settings} />
    );

    return (
      <>
        <span>
          <Switch
            id="disabled-rates-toggle"
            label={intl.formatMessage(messages.showDisabled)}
            isChecked={isShowDisabled}
            onChange={handleOnChange}
          />
        </span>
        {getTooltip(addRateAction)}
      </>
    );
  };

  const getCategoryOptions = (): ToolbarChipGroupExt[] => {
    const options = [
      {
        ariaLabelKey: 'currency',
        placeholderKey: 'currency',
        key: 'currency',
        name: intl.formatMessage(messages.filterByValues, { value: 'currency' }),
      },
    ];
    return options;
  };

  const getTooltip = (comp: React.ReactElement) => {
    return !canWrite ? (
      <Tooltip content={intl.formatMessage(messages.readOnlyPermissions)}>
        <span style={{ display: 'inline-block' }} tabIndex={0}>
          {comp}
        </span>
      </Tooltip>
    ) : (
      comp
    );
  };

  // Handlers

  const handleOnChange = (_event: React.FormEvent<HTMLInputElement>, checked: boolean) => {
    if (onShowDeprecated) {
      onShowDeprecated(checked);
    }
  };

  const handleOnCurrency = (value: string) => {
    if (settingsFetchStatus !== FetchStatus.inProgress) {
      setIsFinish(true);
      dispatch(
        accountSettingsActions.updateAccountSettings(AccountSettingsType.currency, {
          currency: value,
        })
      );
    }
  };

  // Effects

  // Same pattern as EnableRate — child effect runs before parent notification reset
  useEffect(() => {
    if (isFinish && settingsFetchStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!settingsError) {
        setCurrency(getAccountCurrency());
        onCurrency?.();
      }
    }
  }, [isFinish, onCurrency, settingsError, settingsFetchStatus]);

  return (
    <BasicToolbar
      actions={getActions()}
      categoryOptions={getCategoryOptions()}
      isAllSelected={isAllSelected}
      isDisabled={isDisabled}
      isReadOnly={!canWrite}
      itemsPerPage={itemsPerPage}
      itemsTotal={itemsTotal}
      onFilterAdded={onFilterAdded}
      onFilterRemoved={onFilterRemoved}
      pagination={pagination}
      query={query}
      resourcePathsType={ResourcePathsType.ocp}
      showFilter
    />
  );
};

const useMapToProps = (): ExchangeRateStateProps => {
  const settingsError = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsError(state, AccountSettingsType.currency)
  );
  const settingsFetchStatus = useSelector((state: RootState) =>
    accountSettingsSelectors.selectAccountSettingsFetchStatus(state, AccountSettingsType.currency)
  );

  return {
    settingsError,
    settingsFetchStatus,
  };
};

export { ExchangeRateToolbar };

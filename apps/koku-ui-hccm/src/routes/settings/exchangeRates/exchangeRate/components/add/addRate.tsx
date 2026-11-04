import { Button, ButtonVariant } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { Settings, SettingsRateData } from 'api/settings';
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

import { AddRateModal } from './addRateModal';

interface AddRateOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  isDispatch?: boolean;
  onAdd?: (rate: SettingsRateData) => void;
  onClose?: () => void;
}

interface AddRateStateProps {
  settings?: Settings;
  settingsError?: AxiosError;
  settingsFetchStatus?: FetchStatus;
  settingsQueryString?: string;
}

type AddRateProps = AddRateOwnProps;

/** Own fetch for overlap validation: full currency list, including disabled (not the table page). */
const baseQuery: Query = {
  limit: 1000,
  offset: 0,
  order_by: {
    code: 'asc',
  },
};

/**
 * Create exchange rate action in the exchange rates toolbar and empty states.
 */
const AddRate: React.FC<AddRateProps> = ({ canWrite, isDisabled, isDispatch, onAdd, onClose }) => {
  const intl = useIntl();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { settings } = useMapToProps({ isAddModalOpen });

  // Handlers

  const handleOnAddModalAdd = (rate: SettingsRateData) => {
    setIsAddModalOpen(false);
    onAdd?.(rate);
  };

  const handleOnAddModalClick = () => {
    setIsAddModalOpen(true);
  };

  const handleOnAddModalClose = () => {
    setIsAddModalOpen(false);
    onClose?.();
  };

  return (
    <>
      <AddRateModal
        isDispatch={isDispatch}
        isOpen={isAddModalOpen}
        onAdd={handleOnAddModalAdd}
        onClose={handleOnAddModalClose}
        settings={settings?.data}
      />
      <Button isAriaDisabled={!canWrite || isDisabled} onClick={handleOnAddModalClick} variant={ButtonVariant.primary}>
        {intl.formatMessage(messages.exchangeRateAdd)}
      </Button>
    </>
  );
};

interface AddRateMapProps {
  isAddModalOpen?: boolean;
}

const useMapToProps = ({ isAddModalOpen }: AddRateMapProps): AddRateStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const settingsQueryString = getQuery(baseQuery);
  const settings = useSelector((state: RootState) =>
    settingsSelectors.selectSettings(state, SettingsType.currency, settingsQueryString)
  );
  const settingsError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsError(state, SettingsType.currency, settingsQueryString)
  );
  const settingsFetchStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsFetchStatus(state, SettingsType.currency, settingsQueryString)
  );

  // Refetch when the modal opens so overlap checks see rates added/edited/deleted since last open.
  useEffect(() => {
    if (!isAddModalOpen) {
      return;
    }
    if (settingsFetchStatus !== FetchStatus.inProgress) {
      dispatch(settingsActions.fetchSettings(SettingsType.currency, settingsQueryString));
    }
  }, [dispatch, isAddModalOpen, settingsQueryString]);

  return {
    settings,
    settingsError,
    settingsFetchStatus,
    settingsQueryString,
  };
};

export { AddRate };

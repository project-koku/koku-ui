import './deleteRateModal.scss';

import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import type { SettingsData, SettingsRateData } from 'api/settings';
import { SettingsType } from 'api/settings';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { getEffectiveDate } from 'routes/settings/exchangeRates/exchangeRate/components/utils';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { settingsActions, settingsSelectors } from 'store/settings';

interface DeleteRateModalOwnProps {
  isDispatch?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onDelete?: (rate: SettingsRateData) => void;
  settings: SettingsData[];
  uuid?: string;
}

interface DeleteRateModalStateProps {
  settingsError?: AxiosError;
  settingsFetchStatus?: FetchStatus;
}

type DeleteRateModalProps = DeleteRateModalOwnProps;

const findRateByUuid = (settings: SettingsData[] | undefined, uuid?: string) =>
  settings?.flatMap(item => item.static_rates ?? []).find(item => item.uuid === uuid);

/** Confirmation modal for deleting a static exchange rate; used by DeleteRate. */
const DeleteRateModal: React.FC<DeleteRateModalProps> = ({
  isDispatch = true,
  isOpen,
  onClose,
  onDelete,
  settings,
  uuid,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const [isFinish, setIsFinish] = useState(false);
  const [rate, setRate] = useState<SettingsRateData>();

  const { settingsError, settingsFetchStatus } = useMapToProps();

  const deletedRate = findRateByUuid(settings, uuid);

  // Handlers

  const handleOnDelete = () => {
    if (uuid && settingsFetchStatus !== FetchStatus.inProgress) {
      const rateToDelete = findRateByUuid(settings, uuid);

      if (isDispatch) {
        setIsFinish(true);
        setRate(rateToDelete);

        dispatch(
          settingsActions.updateCurrencySettings({
            settingsType: SettingsType.currencyDelete,
            uuid,
          })
        );
      } else {
        onDelete?.(rateToDelete);
      }
    }
  };

  // Effects

  useEffect(() => {
    if (isFinish && settingsFetchStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!settingsError) {
        onDelete?.(rate);
      }
    }
  }, [isFinish, onDelete, settingsError, settingsFetchStatus, rate]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal className="costManagement" isOpen={isOpen} onClose={onClose} variant={ModalVariant.medium}>
      <ModalHeader
        className="iconOverride"
        title={intl.formatMessage(messages.deleteExchangeRateTitle)}
        titleIconVariant="warning"
      />
      <ModalBody>
        {intl.formatMessage(messages.deleteExchangeRateDesc, {
          base: <b>{deletedRate?.base_currency || ''}</b>,
          endDate: (
            <b>
              {deletedRate?.end_date
                ? intl.formatDate(getEffectiveDate(deletedRate.end_date), {
                    month: 'short',
                    year: 'numeric',
                  })
                : ''}
            </b>
          ),
          startDate: (
            <b>
              {deletedRate?.start_date
                ? intl.formatDate(getEffectiveDate(deletedRate.start_date), {
                    month: 'short',
                    year: 'numeric',
                  })
                : ''}
            </b>
          ),
          target: <b>{deletedRate?.target_currency || ''}</b>,
        })}
      </ModalBody>
      <ModalFooter>
        <Button
          isAriaDisabled={settingsFetchStatus === FetchStatus.inProgress}
          onClick={handleOnDelete}
          variant="danger"
        >
          {intl.formatMessage(messages.delete)}
        </Button>
        <Button onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const useMapToProps = (): DeleteRateModalStateProps => {
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

export { DeleteRateModal };

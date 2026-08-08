import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import type { SettingsData, SettingsRateData } from 'api/settings';
import { SettingsType } from 'api/settings';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { settingsActions, settingsSelectors } from 'store/settings';

import { RateContent, type RateContentHandle } from '../rateContent';
import { styles } from './addRateModal.styles';

interface AddRateModalOwnProps {
  isDispatch?: boolean;
  isOpen?: boolean;
  onAdd?: (rate: SettingsRateData) => void;
  onClose?: () => void;
  settings?: SettingsData[];
}

interface AddRateModalStateProps {
  settingsError?: AxiosError;
  settingsFetchStatus?: FetchStatus;
}

type AddRateModalProps = AddRateModalOwnProps;

/**
 * Modal shell around {@link RateContent}: footer Save calls `RateContent`’s `submit()` imperatively;
 * `RateContent` builds merged `rates[]` and reports them via `onCommitRates` for the PUT payload.
 */
const AddRateModal: React.FC<AddRateModalProps> = ({ isDispatch = true, isOpen, onAdd, onClose, settings }) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const contentRef = useRef<RateContentHandle>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFinish, setIsFinish] = useState(false);
  const [rates, setRates] = useState<SettingsRateData>();

  const { settingsError, settingsFetchStatus } = useMapToProps();

  // Handlers

  const handleOnSave = (rate: SettingsRateData) => {
    if (rate && settingsFetchStatus !== FetchStatus.inProgress) {
      if (isDispatch) {
        setIsFinish(true);
        setRates(rate);

        dispatch(
          settingsActions.updateCurrencySettings({
            settingsType: SettingsType.currencyAdd,
            payload: rate,
          })
        );
      } else {
        onAdd?.(rate);
      }
    }
  };

  // Effects

  useEffect(() => {
    if (isFinish && settingsFetchStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!settingsError) {
        onAdd?.(rates);
      }
    }
  }, [isFinish, onAdd, settingsError, settingsFetchStatus, rates]);

  return (
    <Modal
      className="costManagement"
      isOpen={isOpen}
      onClose={onClose}
      style={styles.modal}
      variant={ModalVariant.large}
    >
      <ModalHeader title={intl.formatMessage(messages.exchangeRateAddTitle)} />
      <ModalBody>
        {isOpen && (
          <RateContent
            isAddRate
            onDisabled={setIsDisabled}
            onSave={handleOnSave}
            ref={contentRef}
            settings={settings}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          isAriaDisabled={isDisabled || settingsFetchStatus === FetchStatus.inProgress}
          onClick={() => contentRef.current?.save()}
          variant="primary"
        >
          {intl.formatMessage(messages.create)}
        </Button>
        <Button onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const useMapToProps = (): AddRateModalStateProps => {
  const settingsError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsError(state, SettingsType.currencyAdd, undefined)
  );
  const settingsFetchStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsFetchStatus(state, SettingsType.currencyAdd, undefined)
  );

  return {
    settingsError,
    settingsFetchStatus,
  };
};

export { AddRateModal };

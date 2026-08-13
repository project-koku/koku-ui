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
import { styles } from './editRateModal.styles';

interface EditRateModalOwnProps {
  isDispatch?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onEdit?: (rate: SettingsRateData) => void;
  settings?: SettingsData[];
  uuid?: string;
}

interface EditRateModalStateProps {
  settingsError?: AxiosError;
  settingsFetchStatus?: FetchStatus;
}

type EditRateModalProps = EditRateModalOwnProps;

/**
 * Modal shell around {@link RateContent}: footer Save calls `RateContent`’s `submit()` imperatively;
 * `RateContent` builds merged `rates[]` and reports them via `onCommitRates` for the PUT payload.
 */
const EditRateModal: React.FC<EditRateModalProps> = ({
  isDispatch = true,
  isOpen = false,
  onClose,
  onEdit,
  settings,
  uuid,
}) => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const intl = useIntl();

  const contentRef = useRef<RateContentHandle>(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFinish, setIsFinish] = useState(false);
  const [rates, setRates] = useState<SettingsRateData>();

  const { settingsError, settingsFetchStatus } = useMapToProps();

  // Handlers

  const handleOnSave = (item: SettingsRateData) => {
    if (item && uuid && settingsFetchStatus !== FetchStatus.inProgress) {
      if (isDispatch) {
        setIsFinish(true);
        setRates(item);

        dispatch(
          settingsActions.updateCurrencySettings({
            settingsType: SettingsType.currencyEdit,
            payload: item,
            uuid,
          })
        );
      } else {
        onEdit?.(item);
      }
    }
  };

  // Effects

  useEffect(() => {
    if (isFinish && settingsFetchStatus === FetchStatus.complete) {
      setIsFinish(false);

      if (!settingsError) {
        onEdit?.(rates);
      }
    }
  }, [isFinish, onEdit, settingsError, settingsFetchStatus, rates]);

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <Modal
      className="costManagement"
      isOpen={isOpen}
      onClose={onClose}
      style={styles.modal}
      variant={ModalVariant.large}
    >
      <ModalHeader title={intl.formatMessage(messages.exchangeRateEditTitle)} />
      <ModalBody>
        {isOpen && (
          <RateContent
            onDisabled={setIsDisabled}
            onSave={handleOnSave}
            ref={contentRef}
            settings={settings}
            uuid={uuid}
          />
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          isAriaDisabled={isDisabled || settingsFetchStatus === FetchStatus.inProgress}
          onClick={() => contentRef.current?.save()}
          variant="primary"
        >
          {intl.formatMessage(messages.save)}
        </Button>
        <Button onClick={onClose} variant="link">
          {intl.formatMessage(messages.cancel)}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

const useMapToProps = (): EditRateModalStateProps => {
  const settingsError = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsError(state, SettingsType.currencyEdit, undefined)
  );
  const settingsFetchStatus = useSelector((state: RootState) =>
    settingsSelectors.selectSettingsFetchStatus(state, SettingsType.currencyEdit, undefined)
  );

  return {
    settingsError,
    settingsFetchStatus,
  };
};

export { EditRateModal };

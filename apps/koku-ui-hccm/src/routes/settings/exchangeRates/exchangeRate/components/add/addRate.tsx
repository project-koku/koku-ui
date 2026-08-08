import { Button, ButtonVariant } from '@patternfly/react-core';
import type { SettingsData, SettingsRateData } from 'api/settings';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { AddRateModal } from './addRateModal';

interface AddRateOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  isDispatch?: boolean;
  onAdd?: (rate: SettingsRateData) => void;
  onClose?: () => void;
  settings?: SettingsData[];
}

type AddRateProps = AddRateOwnProps;

const AddRate: React.FC<AddRateProps> = ({ canWrite, isDisabled, isDispatch, onAdd, onClose, settings }) => {
  const intl = useIntl();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
        settings={settings}
      />
      <Button isAriaDisabled={!canWrite || isDisabled} onClick={handleOnAddModalClick} variant={ButtonVariant.primary}>
        {intl.formatMessage(messages.exchangeRateAdd)}
      </Button>
    </>
  );
};

export { AddRate };

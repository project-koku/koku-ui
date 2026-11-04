import { Button, ButtonVariant } from '@patternfly/react-core';
import type { SettingsRateData } from 'api/settings';
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
}

type AddRateProps = AddRateOwnProps;

/**
 * Create exchange rate action in the exchange rates toolbar and empty states.
 * Overlap validation uses the same settings/currency fetch as the currency dropdowns
 * ({@link useCurrencySettings} in RateContent / CurrencySettingsWrapper).
 */
const AddRate: React.FC<AddRateProps> = ({ canWrite, isDisabled, isDispatch, onAdd, onClose }) => {
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
      />
      <Button isAriaDisabled={!canWrite || isDisabled} onClick={handleOnAddModalClick} variant={ButtonVariant.primary}>
        {intl.formatMessage(messages.exchangeRateAdd)}
      </Button>
    </>
  );
};

export { AddRate };

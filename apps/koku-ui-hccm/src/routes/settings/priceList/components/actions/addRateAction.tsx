import { Button, ButtonVariant } from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { ConfirmEditRateModal } from '../confirmEditRate';
import { EditRateModal } from '../editRate';

interface AddRateActionOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  onAddRate?: () => void;
  onClose?: () => void;
  priceList: PriceListData;
}

type AddRateActionProps = AddRateActionOwnProps;

const AddRateAction: React.FC<AddRateActionProps> = ({ canWrite, isDisabled, onAddRate, onClose, priceList }) => {
  const intl = useIntl();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOnConfirmModalClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleOnConfirmModalClose = () => {
    setIsConfirmModalOpen(false);
  };

  const handleOnConfirmModalContinue = () => {
    setIsConfirmModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleOnEditModalClick = () => {
    setIsEditModalOpen(true);
  };

  const handleOnEditModalClose = () => {
    setIsEditModalOpen(false);
    onClose?.();
  };

  const handleOnEditModalUpdateSuccess = () => {
    setIsEditModalOpen(false);
    onAddRate?.();
  };

  return (
    <>
      <ConfirmEditRateModal
        isOpen={isConfirmModalOpen}
        onClose={handleOnConfirmModalClose}
        onContinue={handleOnConfirmModalContinue}
        priceList={priceList}
      />
      <EditRateModal
        isAddRate
        isOpen={isEditModalOpen}
        onClose={handleOnEditModalClose}
        onUpdateSuccess={handleOnEditModalUpdateSuccess}
        priceList={priceList}
      />
      <Button
        isAriaDisabled={!canWrite || isDisabled}
        onClick={priceList?.assigned_cost_model_count > 0 ? handleOnConfirmModalClick : handleOnEditModalClick}
        variant={ButtonVariant.primary}
      >
        {intl.formatMessage(messages.priceListAddRate)}
      </Button>
    </>
  );
};

export { AddRateAction };

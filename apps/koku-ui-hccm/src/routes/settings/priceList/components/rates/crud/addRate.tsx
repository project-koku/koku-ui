import { Button, ButtonVariant } from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import type { Rate } from 'api/rates';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { ImpactReviewModal } from 'routes/settings/priceList/components/review';

import { AddRateModal } from './addRateModal';

interface AddRateOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  onAdd?: (rates: Rate[]) => void;
  onAddSuccess?: () => void;
  onClose?: () => void;
  priceList: PriceListData;
}

type AddRateProps = AddRateOwnProps;

const AddRate: React.FC<AddRateProps> = ({ canWrite, isDisabled, onAdd, onAddSuccess, onClose, priceList }) => {
  const intl = useIntl();

  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleOnImpactModalClick = () => {
    setIsImpactModalOpen(true);
  };

  const handleOnImpactModalClose = () => {
    setIsImpactModalOpen(false);
  };

  const handleOnImpactModalContinue = () => {
    setIsImpactModalOpen(false);
    setIsAddModalOpen(true);
  };

  const handleOnAddModalClick = () => {
    setIsAddModalOpen(true);
  };

  const handleOnAddModalClose = () => {
    setIsAddModalOpen(false);
    onClose?.();
  };

  const handleOnAddModalSuccess = () => {
    setIsAddModalOpen(false);
    onAddSuccess?.();
  };

  return (
    <>
      <ImpactReviewModal
        isOpen={isImpactModalOpen}
        onClose={handleOnImpactModalClose}
        onSuccess={handleOnImpactModalContinue}
        priceList={priceList}
      />
      <AddRateModal
        isOpen={isAddModalOpen}
        onAdd={onAdd}
        onClose={handleOnAddModalClose}
        onSuccess={handleOnAddModalSuccess}
        priceList={priceList}
      />
      <Button
        isAriaDisabled={!canWrite || isDisabled}
        onClick={priceList?.assigned_cost_model_count > 0 ? handleOnImpactModalClick : handleOnAddModalClick}
        variant={ButtonVariant.primary}
      >
        {intl.formatMessage(messages.priceListAddRate)}
      </Button>
    </>
  );
};

export { AddRate };

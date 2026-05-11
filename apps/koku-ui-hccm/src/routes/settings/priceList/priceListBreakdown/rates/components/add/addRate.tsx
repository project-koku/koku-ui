import { Button, ButtonVariant } from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import type { Rate } from 'api/rates';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { ReviewModal } from 'routes/settings/priceList/priceListBreakdown/rates/components/review';

import { AddRateModal } from './addRateModal';

interface AddRateOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  isDispatch?: boolean;
  onAdd?: (rates: Rate[]) => void;
  onClose?: () => void;
  onSuccess?: () => void;
  priceList: PriceListData;
}

type AddRateProps = AddRateOwnProps;

const AddRate: React.FC<AddRateProps> = ({
  canWrite,
  isDisabled,
  isDispatch,
  onAdd,
  onClose,
  onSuccess,
  priceList,
}) => {
  const intl = useIntl();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Handlers

  const handleOnAddModalAdd = (rates: Rate[]) => {
    if (!isDispatch) {
      setIsAddModalOpen(false);
    }
    onAdd?.(rates);
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
    onSuccess?.();
  };

  const handleOnReviewModalClick = () => {
    setIsReviewModalOpen(true);
  };

  const handleOnReviewModalClose = () => {
    setIsReviewModalOpen(false);
  };

  const handleOnReviewModalConfirm = () => {
    setIsReviewModalOpen(false);
    setIsAddModalOpen(true);
  };

  return (
    <>
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleOnReviewModalClose}
        onConfirm={handleOnReviewModalConfirm}
        priceList={priceList}
      />
      <AddRateModal
        isDispatch={isDispatch}
        isOpen={isAddModalOpen}
        onAdd={handleOnAddModalAdd}
        onClose={handleOnAddModalClose}
        onSuccess={handleOnAddModalSuccess}
        priceList={priceList}
      />
      <Button
        isAriaDisabled={!canWrite || isDisabled}
        onClick={priceList?.assigned_cost_model_count > 0 ? handleOnReviewModalClick : handleOnAddModalClick}
        variant={ButtonVariant.primary}
      >
        {intl.formatMessage(messages.priceListAddRate)}
      </Button>
    </>
  );
};

export { AddRate };

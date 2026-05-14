import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { AddPriceListModal } from 'routes/settings/costModel/costModelBreakdown/priceLists/components/add';
import { ReviewChangeModal } from 'routes/settings/costModel/costModelBreakdown/priceLists/components/review';

interface AddPriceListActionOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  isDisabled?: boolean;
  onAdd?: (priceLists: PriceListData[]) => void;
  onClose?: () => void;
}

type AddPriceListActionProps = AddPriceListActionOwnProps;

const AddPriceListAction: React.FC<AddPriceListActionProps> = ({ canWrite, costModel, isDisabled, onAdd, onClose }) => {
  const intl = useIntl();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const getActions = () => {
    const getTooltip = children => {
      const msg = intl.formatMessage(messages.readOnlyPermissions);
      return <Tooltip content={msg}>{children}</Tooltip>;
    };

    const button = (
      <Button
        aria-label={intl.formatMessage(messages.assignPriceLists)}
        isAriaDisabled={!canWrite || isDisabled}
        onClick={() => handleOnReviewModalClick()}
        variant={ButtonVariant.primary}
      >
        {intl.formatMessage(messages.assignPriceLists)}
      </Button>
    );
    return canWrite ? button : getTooltip(button);
  };

  // Handlers

  const handleOnAddModalAdd = (items: PriceListData[]) => {
    setIsAddModalOpen(false);
    onAdd?.(items);
  };

  const handleonAddModalClose = () => {
    setIsAddModalOpen(false);
    onClose?.();
  };

  const handleOnReviewModalClick = () => {
    setIsReviewModalOpen(true);
  };

  const handleOnReviewModalClose = () => {
    setIsReviewModalOpen(false);
    onClose?.();
  };

  const handleOnReviewModalConfirm = () => {
    setIsReviewModalOpen(false);
    setIsAddModalOpen(true);
  };

  return (
    <>
      <ReviewChangeModal
        costModel={costModel}
        isOpen={isReviewModalOpen}
        onClose={handleOnReviewModalClose}
        onConfirm={handleOnReviewModalConfirm}
      />
      <AddPriceListModal
        costModel={costModel}
        isOpen={isAddModalOpen}
        onAdd={handleOnAddModalAdd}
        onClose={handleonAddModalClose}
      />
      {getActions()}
    </>
  );
};

export { AddPriceListAction };

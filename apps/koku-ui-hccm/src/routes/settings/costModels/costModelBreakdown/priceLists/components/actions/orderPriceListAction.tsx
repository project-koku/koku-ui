import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { ReviewOrderModal } from 'routes/settings/costModels/costModelBreakdown/priceLists/components/review';

interface OrderPriceListActionOwnProps {
  canWrite?: boolean;
  costModel?: CostModel;
  isDisabled?: boolean;
  isDraggable?: boolean;
  onClose?: () => void;
  onOrder?: () => void;
}

type OrderPriceListActionProps = OrderPriceListActionOwnProps;

const OrderPriceListAction: React.FC<OrderPriceListActionProps> = ({
  canWrite,
  costModel,
  isDisabled,
  isDraggable,
  onClose,
  onOrder,
}) => {
  const intl = useIntl();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const getActions = () => {
    const getTooltip = children => {
      const msg = intl.formatMessage(messages.readOnlyPermissions);
      return <Tooltip content={msg}>{children}</Tooltip>;
    };

    const button = (
      <Button
        aria-label={intl.formatMessage(isDraggable ? messages.cancelOrdering : messages.orderPriceLists)}
        isAriaDisabled={!canWrite || isDisabled}
        onClick={() => (isDraggable ? onOrder?.() : handleOnReviewModalClick())}
        variant={ButtonVariant.link}
      >
        {intl.formatMessage(isDraggable ? messages.cancelOrdering : messages.orderPriceLists)}
      </Button>
    );
    return canWrite ? button : getTooltip(button);
  };

  // Handlers

  const handleOnReviewModalClick = () => {
    setIsReviewModalOpen(true);
  };

  const handleOnReviewModalClose = () => {
    setIsReviewModalOpen(false);
    onClose?.();
  };

  const handleOnReviewModalConfirm = () => {
    setIsReviewModalOpen(false);
    onOrder?.();
  };

  return (
    <>
      <ReviewOrderModal
        costModel={costModel}
        isOpen={isReviewModalOpen}
        onClose={handleOnReviewModalClose}
        onConfirm={handleOnReviewModalConfirm}
      />
      {getActions()}
    </>
  );
};

export { OrderPriceListAction };

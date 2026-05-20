import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons';
import type { CostModel } from 'api/costModels';
import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { RemovePriceListModal } from 'routes/settings/costModel/costModelBreakdown/priceLists/components/remove';

interface RemovePriceListActionOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  isDisabled?: boolean;
  onClose?: () => void;
  onRemove?: (priceList: PriceListData[]) => void;
  priceList: PriceListData;
}

type RemovePriceListActionProps = RemovePriceListActionOwnProps;

const RemovePriceListAction: React.FC<RemovePriceListActionProps> = ({
  canWrite,
  costModel,
  isDisabled,
  onClose,
  onRemove,
  priceList,
}) => {
  const intl = useIntl();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const getActions = () => {
    const getTooltip = children => {
      const msg = intl.formatMessage(!canWrite ? messages.readOnlyPermissions : messages.unassignPriceList);
      return <Tooltip content={msg}>{children}</Tooltip>;
    };

    return getTooltip(
      <Button
        icon={<MinusCircleIcon />}
        aria-label={intl.formatMessage(messages.unassignPriceList)}
        isAriaDisabled={!canWrite || isDisabled}
        onClick={() => handleOnReviewModalClick()}
        size="sm"
        variant={ButtonVariant.plain}
      ></Button>
    );
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
    onRemove?.([priceList]);
  };

  return (
    <>
      <RemovePriceListModal
        costModel={costModel}
        isOpen={isReviewModalOpen}
        onClose={handleOnReviewModalClose}
        onRemove={handleOnReviewModalConfirm}
        selectedItems={[priceList]}
      />
      {getActions()}
    </>
  );
};

export { RemovePriceListAction };

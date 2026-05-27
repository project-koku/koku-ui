import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons';
import type { CostModel } from 'api/costModels';
import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { RemovePriceListModal } from 'routes/settings/costModels/costModelBreakdown/priceLists/components/remove';

interface RemovePriceListActionOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  isDisabled?: boolean;
  isDispatch?: boolean;
  onClose?: () => void;
  onRemove?: (priceList: PriceListData[]) => void;
  priceList: PriceListData;
}

type RemovePriceListActionProps = RemovePriceListActionOwnProps;

const RemovePriceListAction: React.FC<RemovePriceListActionProps> = ({
  canWrite,
  costModel,
  isDisabled,
  isDispatch,
  onClose,
  onRemove,
  priceList,
}) => {
  const intl = useIntl();

  const [isModalOpen, setIsModalOpen] = useState(false);

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
        onClick={() => handleOnModalClick()}
        size="sm"
        variant={ButtonVariant.plain}
      ></Button>
    );
  };

  // Handlers

  const handleOnModalClick = () => {
    setIsModalOpen(true);
  };

  const handleOnModalClose = () => {
    setIsModalOpen(false);
    onClose?.();
  };

  const handleOnModalConfirm = () => {
    setIsModalOpen(false);
    onRemove?.([priceList]);
  };

  return (
    <>
      <RemovePriceListModal
        costModel={costModel}
        isDispatch={isDispatch}
        isOpen={isModalOpen}
        onClose={handleOnModalClose}
        onRemove={handleOnModalConfirm}
        selectedItems={[priceList]}
      />
      {getActions()}
    </>
  );
};

export { RemovePriceListAction };

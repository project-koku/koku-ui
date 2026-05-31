import type { CostModel } from 'api/costModels';
import type { PriceListData } from 'api/priceList';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import { RemovePriceListModal } from './removePriceListModal';

export interface RemovePriceListHandle {
  /** Opens confirm (when cost models assigned) or the edit modal. Same as the primary button. */
  open: () => void;
}

interface RemovePriceListOwnProps {
  costModel: CostModel;
  isDispatch?: boolean;
  onClose?: () => void;
  onRemove?: (priceList: PriceListData[]) => void;
  selectedItems: PriceListData[];
}

type RemovePriceListProps = RemovePriceListOwnProps;

const RemovePriceList = forwardRef<RemovePriceListHandle, RemovePriceListProps>((props, ref) => {
  const { costModel, isDispatch, onClose, onRemove, selectedItems } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openFlow = useCallback(() => {
    setIsModalOpen(true);
  }, [costModel, selectedItems]);

  useImperativeHandle(ref, () => ({ open: openFlow }), [openFlow]);

  // Handlers

  const handleOnModalClose = () => {
    setIsModalOpen(false);
    onClose?.();
  };

  const handleOnModalRemove = (items: PriceListData[]) => {
    setIsModalOpen(false);
    onRemove?.(items);
  };

  return (
    <RemovePriceListModal
      costModel={costModel}
      isDispatch={isDispatch}
      isOpen={isModalOpen}
      onClose={handleOnModalClose}
      onRemove={handleOnModalRemove}
      selectedItems={selectedItems}
    />
  );
});

RemovePriceList.displayName = 'RemovePriceList';

export { RemovePriceList };

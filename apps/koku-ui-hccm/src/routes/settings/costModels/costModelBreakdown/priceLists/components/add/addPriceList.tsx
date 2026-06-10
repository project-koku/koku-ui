import type { CostModel } from 'api/costModels';
import type { PriceListData } from 'api/priceList';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import { AddPriceListModal } from './addPriceListModal';

export interface AddPriceListHandle {
  /** Opens confirm (when cost models Added) or the Add modal. Same as the primary button. */
  open: () => void;
}

interface AddPriceListOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  isDispatch?: boolean;
  onAdd?: (priceLists: PriceListData[]) => void;
  onClose?: () => void;
}

type AddPriceListProps = AddPriceListOwnProps;

const AddPriceList = forwardRef<AddPriceListHandle, AddPriceListProps>((props, ref) => {
  const { canWrite, costModel, isDispatch, onAdd, onClose } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openFlow = useCallback(() => {
    setIsModalOpen(true);
  }, [costModel]);

  useImperativeHandle(ref, () => ({ open: openFlow }), [openFlow]);

  // Handlers

  const handleOnModalAdd = (items: PriceListData[]) => {
    setIsModalOpen(false);
    onAdd?.(items);
  };

  const handleonModalClose = () => {
    setIsModalOpen(false);
    onClose?.();
  };

  return (
    <AddPriceListModal
      canWrite={canWrite}
      costModel={costModel}
      isDispatch={isDispatch}
      isOpen={isModalOpen}
      onAdd={handleOnModalAdd}
      onClose={handleonModalClose}
    />
  );
});

AddPriceList.displayName = 'AddPriceList';

export { AddPriceList };

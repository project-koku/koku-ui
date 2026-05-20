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

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openAddFlow = useCallback(() => {
    setIsAddModalOpen(true);
  }, [costModel]);

  useImperativeHandle(ref, () => ({ open: openAddFlow }), [openAddFlow]);

  // Handlers

  const handleOnAddModalAdd = (items: PriceListData[]) => {
    setIsAddModalOpen(false);
    onAdd?.(items);
  };

  const handleonAddModalClose = () => {
    setIsAddModalOpen(false);
    onClose?.();
  };

  return (
    <AddPriceListModal
      canWrite={canWrite}
      costModel={costModel}
      isDispatch={isDispatch}
      isOpen={isAddModalOpen}
      onAdd={handleOnAddModalAdd}
      onClose={handleonAddModalClose}
    />
  );
});

AddPriceList.displayName = 'AddPriceList';

export { AddPriceList };

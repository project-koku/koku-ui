import type { PriceListData } from 'api/priceList';
import type { Rate } from 'api/rates';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { ReviewModal } from 'routes/settings/priceList/priceListBreakdown/rates/components/review';

import { DeleteRateModal } from './deleteRateModal';

export interface DeleteRateHandle {
  /** Opens confirm (when cost models assigned) or the delete modal. Same as the primary button. */
  open: () => void;
}

interface DeleteRateOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  isDispatch?: boolean;
  onClose?: () => void;
  onDelete?: (rates: Rate[]) => void;
  priceList: PriceListData;
  rateIndex?: number;
}

type DeleteRateProps = DeleteRateOwnProps;

const DeleteRate = forwardRef<DeleteRateHandle, DeleteRateProps>((props, ref) => {
  const { isDispatch, onClose, onDelete, priceList, rateIndex } = props;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const openDeleteFlow = useCallback(() => {
    if (priceList?.assigned_cost_model_count > 0) {
      setIsReviewModalOpen(true);
    } else {
      setIsDeleteModalOpen(true);
    }
  }, [priceList?.assigned_cost_model_count]);

  useImperativeHandle(ref, () => ({ open: openDeleteFlow }), [openDeleteFlow]);

  // Handlers

  const handleOnReviewModalClose = () => {
    setIsReviewModalOpen(false);
  };

  const handleOnReviewModalConfirm = () => {
    setIsReviewModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleOnDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    onClose?.();
  };

  const handleOnDeleteModalDelete = (rates: Rate[]) => {
    if (!isDispatch) {
      setIsDeleteModalOpen(false);
    }
    onDelete?.(rates);
  };

  return (
    <>
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleOnReviewModalClose}
        onConfirm={handleOnReviewModalConfirm}
        priceList={priceList}
      />
      <DeleteRateModal
        isDispatch={isDispatch}
        isOpen={isDeleteModalOpen}
        onClose={handleOnDeleteModalClose}
        onDelete={handleOnDeleteModalDelete}
        priceList={priceList}
        rateIndex={rateIndex}
      />
    </>
  );
});

DeleteRate.displayName = 'DeleteRate';

export { DeleteRate };

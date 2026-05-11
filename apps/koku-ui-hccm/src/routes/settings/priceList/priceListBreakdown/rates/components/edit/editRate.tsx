import type { PriceListData } from 'api/priceList';
import type { Rate } from 'api/rates';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { ReviewModal } from 'routes/settings/priceList/priceListBreakdown/rates/components/review';

import { EditRateModal } from './editRateModal';

export interface EditRateHandle {
  /** Opens confirm (when cost models assigned) or the edit modal. Same as the primary button. */
  open: () => void;
}

interface EditRateOwnProps {
  isDispatch?: boolean;
  onClose?: () => void;
  onEdit?: (rates: Rate[]) => void;
  onSuccess?: () => void;
  priceList: PriceListData;
  rateIndex?: number;
}

type EditRateProps = EditRateOwnProps;

const EditRate = forwardRef<EditRateHandle, EditRateProps>((props, ref) => {
  const { isDispatch, onClose, onEdit, onSuccess, priceList, rateIndex } = props;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const openEditFlow = useCallback(() => {
    if (priceList?.assigned_cost_model_count > 0) {
      setIsReviewModalOpen(true);
    } else {
      setIsEditModalOpen(true);
    }
  }, [priceList?.assigned_cost_model_count]);

  useImperativeHandle(ref, () => ({ open: openEditFlow }), [openEditFlow]);

  // Handlers

  const handleOnEditModalClose = () => {
    setIsEditModalOpen(false);
    onClose?.();
  };

  const handleOnEditModalEdit = (rates: Rate[]) => {
    if (!isDispatch) {
      setIsEditModalOpen(false);
    }
    onEdit?.(rates);
  };

  const handleOnEditModalSuccess = () => {
    setIsEditModalOpen(false);
    onSuccess?.();
  };

  const handleOnReviewModalClose = () => {
    setIsReviewModalOpen(false);
  };

  const handleOnReviewModalConfirm = () => {
    setIsReviewModalOpen(false);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleOnReviewModalClose}
        onConfirm={handleOnReviewModalConfirm}
        priceList={priceList}
      />
      <EditRateModal
        isDispatch={isDispatch}
        isOpen={isEditModalOpen}
        onEdit={handleOnEditModalEdit}
        onClose={handleOnEditModalClose}
        onSuccess={handleOnEditModalSuccess}
        priceList={priceList}
        rateIndex={rateIndex}
      />
    </>
  );
});

EditRate.displayName = 'EditRate';

export { EditRate };

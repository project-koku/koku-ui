import type { PriceListData } from 'api/priceList';
import type { Rate } from 'api/rates';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { ImpactReviewModal } from 'routes/settings/priceList/components/review';

import { DeleteRateModal } from './deleteRateModal';

export interface DeleteRateHandle {
  /** Opens confirm (when cost models assigned) or the delete modal. Same as the primary button. */
  open: () => void;
}

interface DeleteRateOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  onClose?: () => void;
  onDelete?: (rates: Rate[]) => void;
  onDeleteSuccess?: () => void;
  priceList: PriceListData;
  rateIndex?: number;
}

type DeleteRateProps = DeleteRateOwnProps;

const DeleteRate = forwardRef<DeleteRateHandle, DeleteRateProps>((props, ref) => {
  const { onClose, onDelete, onDeleteSuccess, priceList, rateIndex } = props;

  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOnImpactModalClose = () => {
    setIsImpactModalOpen(false);
  };

  const handleOnImpactModalContinue = () => {
    setIsImpactModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const openDeleteFlow = useCallback(() => {
    if (priceList?.assigned_cost_model_count > 0) {
      setIsImpactModalOpen(true);
    } else {
      setIsDeleteModalOpen(true);
    }
  }, [priceList?.assigned_cost_model_count]);

  useImperativeHandle(ref, () => ({ open: openDeleteFlow }), [openDeleteFlow]);

  const handleOnDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    onClose?.();
  };

  return (
    <>
      <ImpactReviewModal
        isOpen={isImpactModalOpen}
        onClose={handleOnImpactModalClose}
        onSuccess={handleOnImpactModalContinue}
        priceList={priceList}
      />
      <DeleteRateModal
        isOpen={isDeleteModalOpen}
        onClose={handleOnDeleteModalClose}
        onDelete={onDelete}
        onDeleteSuccess={onDeleteSuccess}
        priceList={priceList}
        rateIndex={rateIndex}
      />
    </>
  );
});

DeleteRate.displayName = 'DeleteRate';

export { DeleteRate };

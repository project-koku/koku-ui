import type { PriceListData } from 'api/priceList';
import type { Rate } from 'api/rates';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { ImpactReviewModal } from 'routes/settings/priceList/components/review';

import { EditRateModal } from './editRateModal';

export interface EditRateHandle {
  /** Opens confirm (when cost models assigned) or the edit modal. Same as the primary button. */
  open: () => void;
}

interface EditRateOwnProps {
  onClose?: () => void;
  onEdit?: (rates: Rate[]) => void;
  onEditSuccess?: () => void;
  priceList: PriceListData;
  rateIndex?: number;
}

type EditRateProps = EditRateOwnProps;

const EditRate = forwardRef<EditRateHandle, EditRateProps>((props, ref) => {
  const { onClose, onEdit, onEditSuccess, priceList, rateIndex } = props;

  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOnImpactModalClose = () => {
    setIsImpactModalOpen(false);
  };

  const handleOnImpactModalContinue = () => {
    setIsImpactModalOpen(false);
    setIsEditModalOpen(true);
  };

  const openEditFlow = useCallback(() => {
    if (priceList?.assigned_cost_model_count > 0) {
      setIsImpactModalOpen(true);
    } else {
      setIsEditModalOpen(true);
    }
  }, [priceList?.assigned_cost_model_count]);

  useImperativeHandle(ref, () => ({ open: openEditFlow }), [openEditFlow]);

  const handleOnEditModalClose = () => {
    setIsEditModalOpen(false);
    onClose?.();
  };

  const handleOnEditModalSuccess = () => {
    setIsEditModalOpen(false);
    onEditSuccess?.();
  };

  return (
    <>
      <ImpactReviewModal
        isOpen={isImpactModalOpen}
        onClose={handleOnImpactModalClose}
        onSuccess={handleOnImpactModalContinue}
        priceList={priceList}
      />
      <EditRateModal
        isOpen={isEditModalOpen}
        onEdit={onEdit}
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

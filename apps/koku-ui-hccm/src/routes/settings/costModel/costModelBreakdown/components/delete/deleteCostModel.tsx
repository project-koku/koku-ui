import type { CostModel } from 'api/costModels';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { ReviewModal } from 'routes/settings/costModel/costModelBreakdown/components/review';

import { DeleteCostModelModal } from './deleteCostModelModal';

export interface DeleteCostModelHandle {
  /** Opens confirm (when cost models assigned) or the delete modal. Same as the primary button. */
  open: () => void;
}

interface DeleteCostModelOwnProps {
  costModel: CostModel;
  isDispatch?: boolean;
  onClose?: () => void;
  onDelete?: (costModel: CostModel) => void;
}

type DeleteCostModelProps = DeleteCostModelOwnProps;

const DeleteCostModel = forwardRef<DeleteCostModelHandle, DeleteCostModelProps>((props, ref) => {
  const { costModel, isDispatch = true, onClose, onDelete } = props;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const openDeleteFlow = useCallback(() => {
    if (costModel?.sources?.length > 0) {
      setIsReviewModalOpen(true);
    } else {
      setIsDeleteModalOpen(true);
    }
  }, [costModel]);

  useImperativeHandle(ref, () => ({ open: openDeleteFlow }), [openDeleteFlow]);

  // Handlers

  const handleOnDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    onClose?.();
  };

  const handleOnDeleteModalDelete = (costModelToDelete: CostModel) => {
    setIsDeleteModalOpen(false);
    onDelete?.(costModelToDelete);
  };

  const handleOnReviewModalClose = () => {
    setIsReviewModalOpen(false);
  };

  return (
    <>
      <ReviewModal costModel={costModel} isOpen={isReviewModalOpen} onClose={handleOnReviewModalClose} />
      <DeleteCostModelModal
        costModel={costModel}
        isDispatch={isDispatch}
        isOpen={isDeleteModalOpen}
        onClose={handleOnDeleteModalClose}
        onDelete={handleOnDeleteModalDelete}
      />
    </>
  );
});

DeleteCostModel.displayName = 'DeleteCostModel';

export { DeleteCostModel };

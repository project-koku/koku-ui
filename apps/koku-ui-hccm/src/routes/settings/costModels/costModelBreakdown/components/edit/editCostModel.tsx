import type { CostModel } from 'api/costModels';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import { EditCostModelModal } from './editCostModelModal';

export interface EditCostModelHandle {
  /** Opens confirm (when cost models assigned) or the edit modal. Same as the primary button. */
  open: () => void;
}

interface EditCostModelOwnProps {
  costModel: CostModel;
  isDispatch?: boolean;
  onClose?: () => void;
  onSave?: (costModel: CostModel) => void;
}

type EditCostModelProps = EditCostModelOwnProps;

const EditCostModel = forwardRef<EditCostModelHandle, EditCostModelProps>((props, ref) => {
  const { costModel, isDispatch, onClose, onSave } = props;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditFlow = useCallback(() => {
    setIsEditModalOpen(true);
  }, [costModel]);

  useImperativeHandle(ref, () => ({ open: openEditFlow }), [openEditFlow]);

  // Handlers

  const handleOnEditModalClose = () => {
    setIsEditModalOpen(false);
    onClose?.();
  };

  const handleOnEditModalSave = (item: CostModel) => {
    setIsEditModalOpen(false);
    onSave?.(item);
  };

  return (
    <EditCostModelModal
      costModel={costModel}
      isDispatch={isDispatch}
      isOpen={isEditModalOpen}
      onSave={handleOnEditModalSave}
      onClose={handleOnEditModalClose}
    />
  );
});

EditCostModel.displayName = 'EditCostModel';

export { EditCostModel };

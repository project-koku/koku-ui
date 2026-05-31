import type { CostModel } from 'api/costModels';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import { AddIntegrationModal } from './addIntegrationModal';

export interface AddIntegrationHandle {
  /** Opens confirm (when cost models Added) or the Add modal. Same as the primary button. */
  open: () => void;
}

interface AddIntegrationOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  isDispatch?: boolean;
  onAdd?: (uuids: string[]) => void;
  onClose?: () => void;
}

type AddIntegrationProps = AddIntegrationOwnProps;

const AddIntegration = forwardRef<AddIntegrationHandle, AddIntegrationProps>((props, ref) => {
  const { canWrite, costModel, isDispatch, onAdd, onClose } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openFlow = useCallback(() => {
    setIsModalOpen(true);
  }, [costModel]);

  useImperativeHandle(ref, () => ({ open: openFlow }), [openFlow]);

  // Handlers

  const handleOnModalAdd = (uuids: string[]) => {
    setIsModalOpen(false);
    onAdd?.(uuids);
  };

  const handleonModalClose = () => {
    setIsModalOpen(false);
    onClose?.();
  };

  return (
    <AddIntegrationModal
      canWrite={canWrite}
      costModel={costModel}
      isDispatch={isDispatch}
      isOpen={isModalOpen}
      onAdd={handleOnModalAdd}
      onClose={handleonModalClose}
    />
  );
});

AddIntegration.displayName = 'AddIntegration';

export { AddIntegration };

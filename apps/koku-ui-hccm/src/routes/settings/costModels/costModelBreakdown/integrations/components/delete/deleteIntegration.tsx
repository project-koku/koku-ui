import type { CostModel, CostModelProvider } from 'api/costModels';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import { DeleteIntegrationModal } from './deleteIntegrationModal';

export interface DeleteIntegrationHandle {
  /** Opens confirm (when cost models assigned) or the edit modal. Same as the primary button. */
  open: () => void;
}

interface DeleteIntegrationOwnProps {
  costModel: CostModel;
  isDispatch?: boolean;
  onClose?: () => void;
  onDelete?: (uuids: string[]) => void;
  sources?: CostModelProvider[];
  uuid?: string;
}

type DeleteIntegrationProps = DeleteIntegrationOwnProps;

const DeleteIntegration = forwardRef<DeleteIntegrationHandle, DeleteIntegrationProps>((props, ref) => {
  const { costModel, isDispatch, onClose, onDelete, sources, uuid } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openFlow = useCallback(() => {
    setIsModalOpen(true);
  }, [costModel, sources]);

  useImperativeHandle(ref, () => ({ open: openFlow }), [openFlow]);

  // Handlers

  const handleOnModalClose = () => {
    setIsModalOpen(false);
    onClose?.();
  };

  const handleOnModalDelete = (uuids: string[]) => {
    setIsModalOpen(false);
    onDelete?.(uuids);
  };

  return (
    <DeleteIntegrationModal
      costModel={costModel}
      isDispatch={isDispatch}
      isOpen={isModalOpen}
      onClose={handleOnModalClose}
      onDelete={handleOnModalDelete}
      sources={sources}
      uuid={uuid}
    />
  );
});

DeleteIntegration.displayName = 'DeleteIntegration';

export { DeleteIntegration };

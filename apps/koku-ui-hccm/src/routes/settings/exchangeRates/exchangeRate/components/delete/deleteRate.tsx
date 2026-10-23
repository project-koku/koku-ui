import type { SettingsData, SettingsRateData } from 'api/settings';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { DeleteRateModal } from './deleteRateModal';

export interface DeleteRateHandle {
  /** Opens the delete confirmation modal. Same as the primary button. */
  open: () => void;
}

interface DeleteRateOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  isDispatch?: boolean;
  onClose?: () => void;
  onDelete?: (rate: SettingsRateData) => void;
  settings: SettingsData[];
  uuid?: string;
}

type DeleteRateProps = DeleteRateOwnProps;

/** Delete static exchange rate action; used by RateActions kebab. */
const DeleteRate = forwardRef<DeleteRateHandle, DeleteRateProps>((props, ref) => {
  const { isDispatch, onClose, onDelete, settings, uuid } = props;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useImperativeHandle(ref, () => ({ open: () => setIsDeleteModalOpen(true) }), []);

  // Handlers

  const handleOnDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    onClose?.();
  };

  const handleOnDeleteModalDelete = (rate: SettingsRateData) => {
    setIsDeleteModalOpen(false);
    onDelete?.(rate);
  };

  return (
    <DeleteRateModal
      isDispatch={isDispatch}
      isOpen={isDeleteModalOpen}
      onClose={handleOnDeleteModalClose}
      onDelete={handleOnDeleteModalDelete}
      settings={settings}
      uuid={uuid}
    />
  );
});

DeleteRate.displayName = 'DeleteRate';

export { DeleteRate };

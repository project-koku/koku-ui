import type { SettingsData, SettingsRateData } from 'api/settings';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { EditRateModal } from './editRateModal';

export interface EditRateHandle {
  /** Opens the edit modal. Same as the primary button. */
  open: () => void;
}

interface EditRateOwnProps {
  isDispatch?: boolean;
  onClose?: () => void;
  onEdit?: (rate: SettingsRateData) => void;
  settings: SettingsData[];
  uuid?: string;
}

type EditRateProps = EditRateOwnProps;

const EditRate = forwardRef<EditRateHandle, EditRateProps>((props, ref) => {
  const { isDispatch, onClose, onEdit, settings, uuid } = props;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useImperativeHandle(ref, () => ({ open: () => setIsEditModalOpen(true) }), []);

  // Handlers

  const handleOnEditModalClose = () => {
    setIsEditModalOpen(false);
    onClose?.();
  };

  const handleOnEditModalEdit = (item: SettingsRateData) => {
    setIsEditModalOpen(false);
    onEdit?.(item);
  };

  return (
    <EditRateModal
      isDispatch={isDispatch}
      isOpen={isEditModalOpen}
      onEdit={handleOnEditModalEdit}
      onClose={handleOnEditModalClose}
      settings={settings}
      uuid={uuid}
    />
  );
});

EditRate.displayName = 'EditRate';

export { EditRate };

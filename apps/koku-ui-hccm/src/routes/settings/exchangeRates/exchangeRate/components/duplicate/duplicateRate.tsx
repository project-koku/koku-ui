import type { SettingsData, SettingsRateData } from 'api/settings';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { DuplicateRateModal } from './duplicateRateModal';

export interface DuplicateRateHandle {
  /** Opens the edit modal. Same as the primary button. */
  open: () => void;
}

interface DuplicateRateOwnProps {
  isDispatch?: boolean;
  onClose?: () => void;
  onDuplicate: (rate: SettingsRateData) => void;
  settings: SettingsData[];
  uuid?: string;
}

type DuplicateRateProps = DuplicateRateOwnProps;

const DuplicateRate = forwardRef<DuplicateRateHandle, DuplicateRateProps>((props, ref) => {
  const { isDispatch, onClose, onDuplicate, settings, uuid } = props;

  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);

  useImperativeHandle(ref, () => ({ open: () => setIsDuplicateModalOpen(true) }), []);

  // Handlers

  const handleOnDuplicateModalClose = () => {
    setIsDuplicateModalOpen(false);
    onClose?.();
  };

  const handleOnDuplicateModalDuplicate = (item: SettingsRateData) => {
    setIsDuplicateModalOpen(false);
    onDuplicate?.(item);
  };

  return (
    <DuplicateRateModal
      isDispatch={isDispatch}
      isOpen={isDuplicateModalOpen}
      onClose={handleOnDuplicateModalClose}
      onDuplicate={handleOnDuplicateModalDuplicate}
      settings={settings}
      uuid={uuid}
    />
  );
});

DuplicateRate.displayName = 'DuplicateRate';

export { DuplicateRate };

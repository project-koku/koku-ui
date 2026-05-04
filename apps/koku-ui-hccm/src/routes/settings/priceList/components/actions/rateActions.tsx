import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import type { DropdownWrapperItem } from 'routes/components/dropdownWrapper';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';

import { ConfirmEditRateModal } from '../confirmEditRate';
import { DeleteRateModal } from '../deleteRate';
import { EditRateModal } from '../editRate';

interface RateActionsOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  onClose?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  priceList: PriceListData;
  rateIndex: number;
}

type RateActionsProps = RateActionsOwnProps;

const RateActions: React.FC<RateActionsProps> = ({
  canWrite,
  isDisabled,
  onClose,
  onDelete,
  onEdit,
  priceList,
  rateIndex,
}) => {
  const intl = useIntl();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const getItems = () => {
    const items: DropdownWrapperItem[] = [
      {
        isDisabled: isDisabled || !canWrite,
        onClick: priceList?.assigned_cost_model_count > 0 ? handleOnConfirmModalClick : handleOnEditModalClick,
        toString: () => intl.formatMessage(messages.priceListEditRate),
        ...(!canWrite && {
          tooltipProps: {
            content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
          },
        }),
      },
      {
        isDisabled: isDisabled || !canWrite,
        onClick: handleOnDeleteModalClick,
        toString: () => intl.formatMessage(messages.delete),
        ...(!canWrite && {
          tooltipProps: {
            content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
          },
        }),
      },
    ];
    return items;
  };

  const handleOnConfirmModalClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleOnConfirmModalClose = () => {
    setIsConfirmModalOpen(false);
  };

  const handleOnConfirmModalContinue = () => {
    setIsConfirmModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleOnDeleteModalClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleOnDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    onClose?.();
  };

  const handleOnDeleteModalUpdateSuccess = () => {
    setIsDeleteModalOpen(false);
    onDelete?.();
  };

  const handleOnEditModalClick = () => {
    setIsEditModalOpen(true);
  };

  const handleOnEditModalClose = () => {
    setIsEditModalOpen(false);
    onClose?.();
  };

  const handleOnEditModalUpdateSuccess = () => {
    setIsEditModalOpen(false);
    onEdit?.();
  };

  return (
    <>
      <ConfirmEditRateModal
        isOpen={isConfirmModalOpen}
        onClose={handleOnConfirmModalClose}
        onContinue={handleOnConfirmModalContinue}
        priceList={priceList}
      />
      <DeleteRateModal
        isOpen={isDeleteModalOpen}
        onClose={handleOnDeleteModalClose}
        onUpdateSuccess={handleOnDeleteModalUpdateSuccess}
        priceList={priceList}
        rateIndex={rateIndex}
      />
      <EditRateModal
        isOpen={isEditModalOpen}
        onClose={handleOnEditModalClose}
        onUpdateSuccess={handleOnEditModalUpdateSuccess}
        priceList={priceList}
        rateIndex={rateIndex}
      />
      <DropdownWrapper isKebab items={getItems()} position="right" />
    </>
  );
};

export { RateActions };

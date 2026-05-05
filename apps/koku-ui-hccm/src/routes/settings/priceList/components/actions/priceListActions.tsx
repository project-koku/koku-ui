import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import type { DropdownWrapperItem } from 'routes/components/dropdownWrapper';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';
import { usePriceListDuplicate, usePriceListEnabledToggle } from 'routes/settings/priceList/utils/hooks';

import { DeletePriceListModal } from '../deletePriceList';
import { DeprecatePriceListModal } from '../deprecatePriceList';

interface PriceListActionsOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  onClose?: () => void;
  onDelete?: () => void;
  onDeprecate?: () => void;
  onDuplicate?: () => void;
  priceList: PriceListData;
}

type PriceListActionsProps = PriceListActionsOwnProps;

const PriceListActions: React.FC<PriceListActionsProps> = ({
  canWrite,
  isDisabled,
  onClose,
  onDelete,
  onDeprecate,
  onDuplicate,
  priceList,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeprecateModalOpen, setIsDeprecateModalOpen] = useState(false);
  const intl = useIntl();

  const { duplicatePriceList } = usePriceListDuplicate(priceList, onDuplicate);
  const { togglePriceListEnabled } = usePriceListEnabledToggle(priceList, onDeprecate);

  const getItems = () => {
    const isDeprecated = priceList?.enabled === false;
    const items: DropdownWrapperItem[] = [
      {
        isDisabled: isDisabled || !canWrite,
        onClick: handleOnDeleteModalClick,
        toString: () => intl.formatMessage(messages.deletePriceList),
        ...(!canWrite && {
          tooltipProps: {
            content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
          },
        }),
      },
      {
        isDisabled: isDisabled || !canWrite,
        onClick: isDeprecated ? togglePriceListEnabled : handleOnDeprecateModalClick,
        toString: () => intl.formatMessage(isDeprecated ? messages.restore : messages.deprecate),
        ...(!canWrite && {
          tooltipProps: {
            content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
          },
        }),
      },
      {
        isDisabled: isDisabled || !canWrite,
        onClick: duplicatePriceList,
        toString: () => intl.formatMessage(messages.duplicatePriceList),
        ...(!canWrite && {
          tooltipProps: {
            content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
          },
        }),
      },
    ];
    return items;
  };

  const handleOnDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    onClose?.();
  };

  const handleOnDeleteModalUpdateSuccess = () => {
    setIsDeleteModalOpen(false);
    onDelete?.();
  };

  const handleOnDeleteModalClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleOnDeprecateModalClose = () => {
    setIsDeprecateModalOpen(false);
    onClose?.();
  };

  const handleOnDeprecateModalUpdateSuccess = () => {
    setIsDeprecateModalOpen(false);
    onDeprecate?.();
  };

  const handleOnDeprecateModalClick = () => {
    setIsDeprecateModalOpen(true);
  };

  return (
    <>
      <DeletePriceListModal
        isOpen={isDeleteModalOpen}
        onClose={handleOnDeleteModalClose}
        onUpdateSuccess={handleOnDeleteModalUpdateSuccess}
        priceList={priceList}
      />
      <DeprecatePriceListModal
        isOpen={isDeprecateModalOpen}
        onClose={handleOnDeprecateModalClose}
        onUpdateSuccess={handleOnDeprecateModalUpdateSuccess}
        priceList={priceList}
      />
      <DropdownWrapper isKebab items={getItems()} position="right" />
    </>
  );
};

export { PriceListActions };

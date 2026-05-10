import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import type { DropdownWrapperItem } from 'routes/components/dropdownWrapper';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';
import { DeletePriceListModal } from 'routes/settings/priceList/priceList/delete';
import { DeprecatePriceListModal } from 'routes/settings/priceList/priceList/deprecate';
import { usePriceListDuplicate, usePriceListEnabledToggle } from 'routes/settings/priceList/utils/hooks';

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
        isDisabled: isDisabled || !canWrite || priceList?.assigned_cost_model_count > 0,
        onClick: handleOnDeleteModalClick,
        toString: () => intl.formatMessage(messages.deletePriceList),
        ...(!canWrite && {
          tooltipProps: {
            content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
          },
        }),
        ...(priceList?.assigned_cost_model_count > 0 && {
          tooltipProps: {
            content: <div>{intl.formatMessage(messages.noPriceListDelete)}</div>,
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
        onSuccess={handleOnDeleteModalUpdateSuccess}
        priceList={priceList}
      />
      <DeprecatePriceListModal
        isOpen={isDeprecateModalOpen}
        onClose={handleOnDeprecateModalClose}
        onSuccess={handleOnDeprecateModalUpdateSuccess}
        priceList={priceList}
      />
      <DropdownWrapper isKebab items={getItems()} position="right" />
    </>
  );
};

export { PriceListActions };

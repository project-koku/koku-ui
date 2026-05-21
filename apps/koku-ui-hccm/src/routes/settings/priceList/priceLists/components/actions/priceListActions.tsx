import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import type { DropdownWrapperItem } from 'routes/components/dropdownWrapper';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';
import { DeletePriceListModal } from 'routes/settings/priceList/priceLists/components/delete';
import { DeprecatePriceListModal } from 'routes/settings/priceList/priceLists/components/deprecate';
import { usePriceListDuplicate, usePriceListEnabledToggle } from 'routes/settings/priceList/utils';

interface PriceListActionsOwnProps {
  canWrite?: boolean;
  isDeleteAction?: boolean;
  isDeprecateAction?: boolean;
  isDisabled?: boolean;
  isDuplicateAction?: boolean;
  onClose?: () => void;
  onDelete?: (priceList: PriceListData) => void;
  onDeprecate?: () => void;
  onDuplicate?: () => void;
  priceList: PriceListData;
}

type PriceListActionsProps = PriceListActionsOwnProps;

const PriceListActions: React.FC<PriceListActionsProps> = ({
  canWrite = true,
  isDeleteAction = true,
  isDeprecateAction = true,
  isDuplicateAction = true,
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
    const items: DropdownWrapperItem[] = [];

    if (isDeleteAction) {
      items.push({
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
      });
    }
    if (isDeprecateAction) {
      items.push({
        isDisabled: isDisabled || !canWrite,
        onClick: isDeprecated ? togglePriceListEnabled : handleOnDeprecateModalClick,
        toString: () => intl.formatMessage(isDeprecated ? messages.restore : messages.deprecate),
        ...(!canWrite && {
          tooltipProps: {
            content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
          },
        }),
      });
    }
    if (isDuplicateAction) {
      items.push({
        isDisabled: isDisabled || !canWrite,
        onClick: duplicatePriceList,
        toString: () => intl.formatMessage(messages.duplicatePriceList),
        ...(!canWrite && {
          tooltipProps: {
            content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
          },
        }),
      });
    }
    return items;
  };

  const handleOnDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    onClose?.();
  };

  const handleOnDeleteModalDelete = (item: PriceListData) => {
    setIsDeleteModalOpen(false);
    onDelete?.(item);
  };

  const handleOnDeleteModalClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleOnDeprecateModalClose = () => {
    setIsDeprecateModalOpen(false);
    onClose?.();
  };

  const handleOnDeprecateModalDeprecate = () => {
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
        onDelete={handleOnDeleteModalDelete}
        priceList={priceList}
      />
      <DeprecatePriceListModal
        isOpen={isDeprecateModalOpen}
        onClose={handleOnDeprecateModalClose}
        onDeprecate={handleOnDeprecateModalDeprecate}
        priceList={priceList}
      />
      <DropdownWrapper isKebab items={getItems()} position="right" />
    </>
  );
};

export { PriceListActions };

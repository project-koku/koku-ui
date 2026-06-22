import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import type { DropdownWrapperItem } from 'routes/components/dropdownWrapper';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';
import { DeletePriceListModal } from 'routes/settings/priceLists/priceList/components/delete';
import { DeprecatePriceListModal } from 'routes/settings/priceLists/priceList/components/deprecate';
import { usePriceListDuplicate, usePriceListEnabledToggle } from 'routes/settings/priceLists/utils';
import { formatPath } from 'utils/paths';

interface PriceListActionsOwnProps {
  canWrite?: boolean;
  isDeleteAction?: boolean;
  isDeprecateAction?: boolean;
  isDisabled?: boolean;
  isDuplicateAction?: boolean;
  isRemovePriceListAction?: boolean;
  isViewPriceListAction?: boolean;
  onClose?: () => void;
  onDelete?: (priceList: PriceListData) => void;
  onDeprecate?: () => void;
  onDuplicate?: () => void;
  onRemove?: (priceList: PriceListData) => void;
  priceList: PriceListData;
}

type PriceListActionsProps = PriceListActionsOwnProps;

const PriceListActions: React.FC<PriceListActionsProps> = ({
  canWrite = true,
  isDeleteAction,
  isDeprecateAction,
  isDuplicateAction,
  isRemovePriceListAction,
  isViewPriceListAction,
  isDisabled,
  onClose,
  onDelete,
  onDeprecate,
  onDuplicate,
  onRemove,
  priceList,
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeprecateModalOpen, setIsDeprecateModalOpen] = useState(false);

  const { duplicatePriceList } = usePriceListDuplicate(priceList, onDuplicate);
  const { togglePriceListEnabled } = usePriceListEnabledToggle(priceList, onDeprecate);

  const getItems = () => {
    const isDeprecated = priceList?.enabled === false;
    const items: DropdownWrapperItem[] = [];

    if (isViewPriceListAction) {
      items.push({
        isDisabled: !canWrite || isDisabled,
        onClick: handleOnViewPriceList,
        toString: () => intl.formatMessage(messages.viewPriceList),
      });
    }
    if (isRemovePriceListAction) {
      items.push({
        isDisabled: !canWrite || isDisabled,
        onClick: () => onRemove?.(priceList),
        toString: () => intl.formatMessage(messages.removePriceList),
      });
    }
    if (isDeleteAction) {
      items.push({
        isDisabled: !canWrite || isDisabled || priceList?.assigned_cost_model_count > 0,
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
        isDisabled: !canWrite || isDisabled,
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
        isDisabled: !canWrite || isDisabled,
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

  const handleOnViewPriceList = () => {
    navigate(`${formatPath(routes.priceListBreakdown.basePath)}/${priceList?.uuid}`, {
      replace: true,
      state: {
        ...(location?.state || {}),
      },
    });
    onClose?.();
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

import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import type { DropdownWrapperItem } from 'routes/components/dropdownWrapper';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';
import { usePriceListDuplicate, usePriceListEnabledToggle } from 'routes/settings/priceList/utils/hooks';

import { DeletePriceList } from '../deletePriceList';
import { DeprecatePriceList } from '../deprecatePriceList';

interface ActionsOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  item: PriceListData;
  onClose?: () => void;
}

type ActionsProps = ActionsOwnProps;

const Actions: React.FC<ActionsProps> = ({ canWrite, isDisabled, item, onClose }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeprecateModalOpen, setIsDeprecateModalOpen] = useState(false);
  const intl = useIntl();

  const handleRestoreSuccess = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const { duplicatePriceList } = usePriceListDuplicate(item, handleRestoreSuccess);
  const { togglePriceListEnabled } = usePriceListEnabledToggle(item, handleRestoreSuccess);

  const getItems = () => {
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
        onClick: !item?.enabled ? togglePriceListEnabled : handleOnDeprecateModalClick,
        toString: () => intl.formatMessage(!item?.enabled ? messages.restore : messages.deprecate),
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
    if (onClose) {
      onClose();
    }
  };

  const handleOnDeleteModalClick = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleOnDeprecateModalClose = () => {
    setIsDeprecateModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleOnDeprecateModalClick = () => {
    setIsDeprecateModalOpen(!isDeprecateModalOpen);
  };

  return (
    <>
      <DeletePriceList isOpen={isDeleteModalOpen} item={item} onClose={handleOnDeleteModalClose} />
      <DeprecatePriceList isOpen={isDeprecateModalOpen} item={item} onClose={handleOnDeprecateModalClose} />
      <DropdownWrapper isKebab items={getItems()} position="right" />
    </>
  );
};

export default Actions;

import type { PriceListData } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import type { DropdownWrapperItem } from 'routes/components/dropdownWrapper';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';

import { FetchStatus } from '../../../../../store/common';
import { priceListActions } from '../../../../../store/priceList';
import { DeletePriceList } from '../deletePriceList';
import { DeprecatePriceList } from '../deprecatePriceList';

interface ActionsOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  item: PriceListData;
  onClose?: () => void;
  onDeprecate?: () => void;
  onDuplicate?: () => void;
}

type ActionsProps = ActionsOwnProps;

const Actions: React.FC<ActionsProps> = ({ canWrite, isDisabled, item, onClose, onDuplicate }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeprecateModalOpen, setIsDeprecateModalOpen] = useState(false);
  const intl = useIntl();

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
        onClick: !item?.enabled ? handleOnRestore : handleOnDeprecateModalClick,
        toString: () => intl.formatMessage(!item?.enabled ? messages.restore : messages.deprecate),
        ...(!canWrite && {
          tooltipProps: {
            content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
          },
        }),
      },
      {
        isDisabled: isDisabled || !canWrite,
        onClick: handleOnDuplicate,
        toString: () => intl.formatMessage(messages.duplicatePriceList),
        ...(!canWrite && {
          tooltipProps: {
            content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
          },
        }),
      },
    ];
    return items.sort((a, b) => a.toString().localeCompare(b.toString()));
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

  const handleOnDuplicate = () => {
    // eslint-disable-next-line no-console
    console.log(`onDuplicate clicked`);
    if (onDuplicate) {
      onDuplicate();
    }
  };

  const handleOnRestore = () => {};

  return (
    <>
      <DeletePriceList isOpen={isDeleteModalOpen} item={item} onClose={handleOnDeleteModalClose} />
      <DeprecatePriceList isOpen={isDeprecateModalOpen} item={item} onClose={handleOnDeprecateModalClose} />
      <DropdownWrapper isKebab items={getItems()} position="right" />
    </>
  );
};

export default Actions;

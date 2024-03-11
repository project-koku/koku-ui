import type { SettingsData } from 'api/settings';
import { SettingsType } from 'api/settings';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import type { DropdownWrapperItem } from 'routes/components/dropdownWrapper';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';

import { DeleteModal } from '../deleteModal';

interface ActionsKebabOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  item: SettingsData;
  onDelete();
}

type ActionsKebabProps = ActionsKebabOwnProps;

const ActionnsKebab: React.FC<ActionsKebabProps> = ({ canWrite, isDisabled, item, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const intl = useIntl();

  const getItems = () => {
    const items: DropdownWrapperItem[] = [
      {
        isDisabled: isDisabled || !canWrite,
        onClick: handleOnClick,
        toString: () => intl.formatMessage(messages.tagMappingDelete),
        ...(!canWrite && {
          tooltipProps: {
            content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
          },
        }),
      },
    ];
    return items;
  };

  const handleOnClose = () => {
    setIsOpen(false);
  };

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <DeleteModal
        isOpen={isOpen}
        item={item}
        onClose={handleOnClose}
        onDelete={onDelete}
        settingsType={SettingsType.tagsMappingsParentRemove}
      />
      <DropdownWrapper isKebab items={getItems()} position="right" />
    </>
  );
};

export default ActionnsKebab;

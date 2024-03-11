import type { SettingsData } from 'api/settings';
import { SettingsType } from 'api/settings';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import type { DropdownWrapperItem } from 'routes/components/dropdownWrapper';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';

import { DeleteModal } from '../deleteModal';
import { TagMappingModal } from '../tagMappingModal';

interface ActionsKebabOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  item: SettingsData;
  onUpdate();
}

type ActionsKebabProps = ActionsKebabOwnProps;

const ActionnsKebab: React.FC<ActionsKebabProps> = ({ canWrite, isDisabled, item, onUpdate }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTagMappingModalOpen, setIsTagMappingModalOpen] = useState(false);
  const intl = useIntl();

  const getItems = () => {
    const items: DropdownWrapperItem[] = [
      {
        isDisabled: isDisabled || !canWrite,
        onClick: handleOnTagMappingModalClick,
        toString: () => intl.formatMessage(messages.tagMappingAddChildTags),
        ...(!canWrite && {
          tooltipProps: {
            content: <div>{intl.formatMessage(messages.readOnlyPermissions)}</div>,
          },
        }),
      },
      {
        isDisabled: isDisabled || !canWrite,
        onClick: handleOnDeleteModalClick,
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

  const handleOnDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const handleOnDeleteModalClick = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleOnTagMappingModalClose = () => {
    setIsTagMappingModalOpen(false);
  };

  const handleOnTagMappingModalClick = () => {
    setIsTagMappingModalOpen(!isTagMappingModalOpen);
  };

  return (
    <>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        item={item}
        onClose={handleOnDeleteModalClose}
        onUpdate={onUpdate}
        settingsType={SettingsType.tagsMappingsParentRemove}
      />
      <TagMappingModal
        isOpen={isTagMappingModalOpen}
        onClose={handleOnTagMappingModalClose}
        onUpdate={onUpdate}
        item={item}
      />
      <DropdownWrapper isKebab items={getItems()} position="right" />
    </>
  );
};

export default ActionnsKebab;

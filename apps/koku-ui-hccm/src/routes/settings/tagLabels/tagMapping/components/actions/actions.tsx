import type { SettingsData } from 'api/settings';
import { SettingsType } from 'api/settings';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import type { DropdownWrapperItem } from 'routes/components/dropdownWrapper';
import { DropdownWrapper } from 'routes/components/dropdownWrapper';
import { ChildTagMapping } from 'routes/settings/tagLabels/tagMapping/components/childTagMapping';
import { DeleteTagMapping } from 'routes/settings/tagLabels/tagMapping/components/deleteTagMapping';

interface ActionsOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  item: SettingsData;
  onClose?: () => void;
}

type ActionsProps = ActionsOwnProps;

const Actions: React.FC<ActionsProps> = ({ canWrite, isDisabled, item, onClose }) => {
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
    if (onClose) {
      onClose();
    }
  };

  const handleOnDeleteModalClick = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleOnTagMappingModalClose = () => {
    setIsTagMappingModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleOnTagMappingModalClick = () => {
    setIsTagMappingModalOpen(!isTagMappingModalOpen);
  };

  return (
    <>
      <DeleteTagMapping
        isOpen={isDeleteModalOpen}
        item={item}
        onClose={handleOnDeleteModalClose}
        settingsType={SettingsType.tagsMappingsParentRemove}
      />
      <ChildTagMapping isOpen={isTagMappingModalOpen} onClose={handleOnTagMappingModalClose} item={item} />
      <DropdownWrapper isKebab items={getItems()} position="right" />
    </>
  );
};

export default Actions;

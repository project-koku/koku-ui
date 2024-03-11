import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { Modal, ModalBody, ModalHeader, ModalVariant } from '@patternfly/react-core/next';
import type { SettingsData } from 'api/settings';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { ChildTags } from 'routes/settings/tagLabels/tagMapping/components/childTags';
import { useStateCallback } from 'utils/hooks';

interface TagMappingModalOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
}

type TagMappingModalProps = TagMappingModalOwnProps;

const TagMappingModal: React.FC<TagMappingModalProps> = ({ canWrite, isDisabled }: TagMappingModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useStateCallback([]);

  const intl = useIntl();

  const getActions = () => {
    const getTooltip = children => {
      if (!canWrite) {
        const disableTagsTooltip = intl.formatMessage(messages.readOnlyPermissions);
        return <Tooltip content={disableTagsTooltip}>{children}</Tooltip>;
      }
      return children;
    };

    return getTooltip(
      <Button isAriaDisabled={isDisabled} onClick={handleOnClick} variant={ButtonVariant.primary}>
        {intl.formatMessage(messages.createTagMapping)}
      </Button>
    );
  };

  const handleOnBulkSelect = (items: SettingsData[]) => {
    setSelectedItems(items);
  };

  const handleOnClose = () => {
    setIsOpen(false);
  };

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOnSelect = (items: SettingsData[], isSelected: boolean = false) => {
    let newItems = [...selectedItems];
    if (items && items.length > 0) {
      if (isSelected) {
        items.map(item => newItems.push(item));
      } else {
        items.map(item => {
          newItems = newItems.filter(val => val.uuid !== item.uuid);
        });
      }
    }
    setSelectedItems(newItems);
  };

  // const handleOnCreateTagMapping = () => {
  //   // TBD...
  // };

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <>
      {getActions()}
      <Modal className="costManagement" isOpen={isOpen} onClose={handleOnClose} variant={ModalVariant.medium}>
        <ModalHeader title={intl.formatMessage(messages.clusterInfo)} />
        <ModalBody>
          <ChildTags onBulkSelect={handleOnBulkSelect} onSelect={handleOnSelect} />
        </ModalBody>
      </Modal>
    </>
  );
};

export default TagMappingModal;

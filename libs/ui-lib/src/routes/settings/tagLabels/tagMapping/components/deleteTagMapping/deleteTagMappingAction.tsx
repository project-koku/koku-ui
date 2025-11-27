import './deleteTagMapping.scss';

import type { SettingsData } from '@koku-ui/api/settings';
import { SettingsType } from '@koku-ui/api/settings';
import messages from '@koku-ui/i18n/locales/messages';
import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import DeleteTagMapping from './deleteTagMapping';

interface DeleteTagMappingActionOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  item: SettingsData;
  onClose?: () => void;
}

type DeleteTagMappingActionProps = DeleteTagMappingActionOwnProps;

const DeleteTagMappingAction: React.FC<DeleteTagMappingActionProps> = ({ canWrite, isDisabled, item, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const intl = useIntl();

  const getActions = () => {
    const getTooltip = children => {
      const msg = intl.formatMessage(!canWrite ? messages.readOnlyPermissions : messages.tagMappingRemove);
      return <Tooltip content={msg}>{children}</Tooltip>;
    };

    return getTooltip(
      <Button
        icon={<MinusCircleIcon />}
        aria-label={intl.formatMessage(messages.tagMappingRemove)}
        isAriaDisabled={!canWrite || isDisabled}
        onClick={() => handleOnClick()}
        size="sm"
        variant={ButtonVariant.plain}
      ></Button>
    );
  };

  const handleOnClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <>
      {getActions()}
      <DeleteTagMapping
        isOpen={isOpen}
        isChild
        item={item}
        onClose={handleOnClose}
        settingsType={SettingsType.tagsMappingsChildRemove}
      />
    </>
  );
};

export default DeleteTagMappingAction;

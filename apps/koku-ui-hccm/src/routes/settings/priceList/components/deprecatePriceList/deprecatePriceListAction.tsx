import './deprecatePriceList.scss';

import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import type { SettingsData } from 'api/settings';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import DeprecatePriceList from './deprecatePriceList';

interface DeprecatePriceListActionOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  item: SettingsData;
  onClose?: () => void;
}

type DeprecatePriceListActionProps = DeprecatePriceListActionOwnProps;

const DeprecatePriceListAction: React.FC<DeprecatePriceListActionProps> = ({ canWrite, isDisabled, item, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const intl = useIntl();

  const getActions = () => {
    const actionMsg = !item?.enabled ? messages.restore : messages.deprecate;

    const getTooltip = children => {
      const msg = intl.formatMessage(!canWrite ? messages.readOnlyPermissions : actionMsg);
      return <Tooltip content={msg}>{children}</Tooltip>;
    };

    return getTooltip(
      <Button
        icon={<MinusCircleIcon />}
        aria-label={intl.formatMessage(actionMsg)}
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
      <DeprecatePriceList isOpen={isOpen} item={item} onClose={handleOnClose} />
    </>
  );
};

export default DeprecatePriceListAction;

import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/minus-circle-icon';
import type { PriceListData } from 'api/priceList';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { EditRateModal } from './editRateModal';

interface EditRateActionOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  onClose?: () => void;
  priceList: PriceListData;
}

type EditRateActionProps = EditRateActionOwnProps;

const EditRateAction: React.FC<EditRateActionProps> = ({ canWrite, isDisabled, onClose, priceList }) => {
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
    onClose?.();
  };

  const handleOnClick = () => {
    setIsOpen(!isOpen);
  };

  // PatternFly modal appends to document.body, which is outside the scoped "costManagement" dom tree.
  // Use className="costManagement" to override PatternFly styles or append the modal to an element within the tree

  return (
    <>
      {getActions()}
      <EditRateModal isOpen={isOpen} onClose={handleOnClose} priceList={priceList} />
    </>
  );
};

export { EditRateAction };

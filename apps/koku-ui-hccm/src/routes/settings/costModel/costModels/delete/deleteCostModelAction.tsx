import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons';
import type { CostModels } from 'api/costModels';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

import { DeleteCostModelModal } from './deleteCostModelModal';

interface DeleteCostModelActionOwnProps {
  canWrite?: boolean;
  costModels: CostModels;
  costModelsIndex?: number;
  isDisabled?: boolean;
  onClose?: () => void;
  onDelete?: () => void;
}

type DeleteCostModelActionProps = DeleteCostModelActionOwnProps;

const DeleteCostModelAction: React.FC<DeleteCostModelActionProps> = ({
  canWrite,
  costModels,
  costModelsIndex,
  isDisabled,
  onClose,
  onDelete,
}) => {
  const intl = useIntl();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getActions = () => {
    const getTooltip = children => {
      const msg = intl.formatMessage(!canWrite ? messages.readOnlyPermissions : messages.costModelsDelete);
      return <Tooltip content={msg}>{children}</Tooltip>;
    };

    return getTooltip(
      <Button
        icon={<MinusCircleIcon />}
        aria-label={intl.formatMessage(messages.costModelsDelete)}
        isAriaDisabled={!canWrite || isDisabled}
        onClick={() => handleOnModalClick()}
        size="sm"
        variant={ButtonVariant.plain}
      ></Button>
    );
  };
  // Handlers

  const handleOnModalClick = () => {
    setIsModalOpen(true);
  };

  const handleOnModalClose = () => {
    setIsModalOpen(false);
    onClose?.();
  };

  const handleOnModalDelete = () => {
    setIsModalOpen(false);
    onDelete?.();
  };

  return (
    <>
      <DeleteCostModelModal
        costModels={costModels}
        costModelsIndex={costModelsIndex}
        isOpen={isModalOpen}
        onClose={handleOnModalClose}
        onSuccess={handleOnModalDelete}
      />
      {getActions()}
    </>
  );
};

export { DeleteCostModelAction };

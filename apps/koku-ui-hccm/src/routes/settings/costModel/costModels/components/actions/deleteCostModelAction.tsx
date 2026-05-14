import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons';
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { DeleteCostModelModal } from 'routes/settings/costModel/costModelBreakdown/components/delete';

interface DeleteCostModelActionOwnProps {
  costModel: CostModel;
  canWrite?: boolean;
  isDisabled?: boolean;
  onClose?: () => void;
  onDelete?: () => void;
}

type DeleteCostModelActionProps = DeleteCostModelActionOwnProps;

const DeleteCostModelAction: React.FC<DeleteCostModelActionProps> = ({
  costModel,
  canWrite,
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
        costModel={costModel}
        isOpen={isModalOpen}
        onClose={handleOnModalClose}
        onDelete={handleOnModalDelete}
      />
      {getActions()}
    </>
  );
};

export { DeleteCostModelAction };

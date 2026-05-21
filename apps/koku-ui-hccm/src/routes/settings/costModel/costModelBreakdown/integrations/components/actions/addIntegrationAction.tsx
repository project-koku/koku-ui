import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import type { CostModel } from 'api/costModels';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { AddIntegrationModal } from 'routes/settings/costModel/costModelBreakdown/integrations/components/add';

interface AddIntegrationActionOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  isDisabled?: boolean;
  onAdd?: (uuids: string[]) => void;
  onClose?: () => void;
}

type AddIntegrationActionProps = AddIntegrationActionOwnProps;

const AddIntegrationAction: React.FC<AddIntegrationActionProps> = ({
  canWrite,
  costModel,
  isDisabled,
  onAdd,
  onClose,
}) => {
  const intl = useIntl();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getActions = () => {
    const getTooltip = children => {
      const msg = intl.formatMessage(messages.readOnlyPermissions);
      return <Tooltip content={msg}>{children}</Tooltip>;
    };

    const button = (
      <Button
        aria-label={intl.formatMessage(messages.costModelsAssignSources, { count: 1 })}
        isAriaDisabled={!canWrite || isDisabled}
        onClick={() => handleOnModalClick()}
        variant={ButtonVariant.primary}
      >
        {intl.formatMessage(messages.costModelsAssignSources, { count: 1 })}
      </Button>
    );
    return canWrite ? button : getTooltip(button);
  };

  // Handlers

  const handleOnModalAdd = (uuids: string[]) => {
    setIsModalOpen(false);
    onAdd?.(uuids);
  };

  const handleOnModalClick = () => {
    setIsModalOpen(true);
  };

  const handleOnModalClose = () => {
    setIsModalOpen(false);
    onClose?.();
  };

  return (
    <>
      <AddIntegrationModal
        costModel={costModel}
        isOpen={isModalOpen}
        onAdd={handleOnModalAdd}
        onClose={handleOnModalClose}
      />
      {getActions()}
    </>
  );
};

export { AddIntegrationAction };

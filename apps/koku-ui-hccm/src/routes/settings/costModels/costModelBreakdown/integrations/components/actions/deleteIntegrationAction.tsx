import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons';
import type { CostModel, CostModelProvider } from 'api/costModels';
import messages from 'locales/messages';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { DeleteIntegrationModal } from 'routes/settings/costModels/costModelBreakdown/integrations/components/delete';

interface DeleteIntegrationActionOwnProps {
  canWrite?: boolean;
  costModel: CostModel;
  isDisabled?: boolean;
  onClose?: () => void;
  onDelete?: (uuids: string[]) => void;
  sources?: CostModelProvider[];
  uuid?: string;
}

type DeleteIntegrationActionProps = DeleteIntegrationActionOwnProps;

const DeleteIntegrationAction: React.FC<DeleteIntegrationActionProps> = ({
  canWrite,
  costModel,
  isDisabled,
  onClose,
  onDelete,
  sources,
  uuid,
}) => {
  const intl = useIntl();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getActions = () => {
    const getTooltip = children => {
      const msg = intl.formatMessage(!canWrite ? messages.readOnlyPermissions : messages.costModelsSourceDeleteSource);
      return <Tooltip content={msg}>{children}</Tooltip>;
    };

    return getTooltip(
      <Button
        icon={<MinusCircleIcon />}
        aria-label={intl.formatMessage(messages.costModelsSourceDeleteSource)}
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

  const handleOnModalDelete = (uuids: string[]) => {
    setIsModalOpen(false);
    onDelete?.(uuids);
  };

  return (
    <>
      <DeleteIntegrationModal
        costModel={costModel}
        isOpen={isModalOpen}
        onClose={handleOnModalClose}
        onDelete={handleOnModalDelete}
        sources={sources}
        uuid={uuid}
      />
      {getActions()}
    </>
  );
};

export { DeleteIntegrationAction };

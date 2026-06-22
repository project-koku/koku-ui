import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import { formatPath } from 'utils/paths';

interface CreateCostModelActionOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
}

type CreateCostModelActionProps = CreateCostModelActionOwnProps;

const CreateCostModelAction: React.FC<CreateCostModelActionProps> = ({ canWrite, isDisabled }) => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();

  const getActions = () => {
    const getTooltip = children => {
      const msg = intl.formatMessage(messages.readOnlyPermissions);
      return <Tooltip content={msg}>{children}</Tooltip>;
    };

    const button = (
      <Button
        aria-label={intl.formatMessage(messages.costModelsWizardCreateCostModel)}
        iconPosition="right"
        isAriaDisabled={!canWrite || isDisabled}
        onClick={() => handleOnCreate()}
        variant={ButtonVariant.primary}
      >
        {intl.formatMessage(messages.costModelsWizardCreateCostModel)}
      </Button>
    );
    return canWrite ? button : getTooltip(button);
  };

  // Handlers

  const handleOnCreate = () => {
    navigate(formatPath(routes.costModelCreate.path), {
      replace: true,
      state: {
        ...(location?.state || {}),
      },
    });
  };

  return getActions();
};

export { CreateCostModelAction };

import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import { formatPath } from 'utils/paths';

interface CreateExchangeRateActionOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  isSecondary?: boolean;
}

type CreateExchangeRateActionProps = CreateExchangeRateActionOwnProps;

const CreateExchangeRateAction: React.FC<CreateExchangeRateActionProps> = ({ canWrite, isDisabled, isSecondary }) => {
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
        aria-label={intl.formatMessage(messages.createExchangeRate)}
        icon={isSecondary ? <ExternalLinkAltIcon /> : undefined}
        iconPosition="right"
        isAriaDisabled={!canWrite || isDisabled}
        onClick={() => handleOnCreate()}
        variant={isSecondary ? ButtonVariant.secondary : ButtonVariant.primary}
      >
        {intl.formatMessage(messages.createExchangeRate)}
      </Button>
    );
    return canWrite ? button : getTooltip(button);
  };

  // Handlers

  const handleOnCreate = () => {
    navigate(formatPath(routes.priceListCreate.path), {
      replace: true,
      state: {
        ...(location?.state || {}),
      },
    });
  };

  return getActions();
};

export { CreateExchangeRateAction };

import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import { formatPath } from 'utils/paths';

interface NoCostModelsStateOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
}

// defaultIntl required for testing
const NoCostModelsState: React.FC<NoCostModelsStateOwnProps> = ({ canWrite, isDisabled }) => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();

  const handleOnCreate = () => {
    navigate(formatPath(routes.costModelCreate.path), {
      replace: true,
      state: {
        ...(location?.state || {}),
      },
    });
  };

  return (
    <EmptyState
      headingLevel="h5"
      icon={PlusCircleIcon}
      titleText={intl.formatMessage(messages.costModelsEmptyState)}
      variant={EmptyStateVariant.lg}
    >
      <EmptyStateBody>{intl.formatMessage(messages.costModelsEmptyStateDesc)}</EmptyStateBody>
      <EmptyStateFooter>
        <>
          <Button isAriaDisabled={!canWrite || isDisabled} onClick={handleOnCreate} variant={ButtonVariant.primary}>
            {intl.formatMessage(messages.costModelsWizardCreateCostModel)}
          </Button>
          <br />
          <br />
          <a href={intl.formatMessage(messages.docsCostModels)} rel="noreferrer" target="_blank">
            {intl.formatMessage(messages.costModelsEmptyStateLearnMore)}
          </a>
        </>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export { NoCostModelsState };

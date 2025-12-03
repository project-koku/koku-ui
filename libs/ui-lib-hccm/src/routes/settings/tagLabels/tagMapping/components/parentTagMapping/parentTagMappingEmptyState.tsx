import messages from '@koku-ui/i18n/locales/messages';
import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateVariant,
} from '@patternfly/react-core';
import React from 'react';
import { useIntl } from 'react-intl';

interface ParentTagMappingEmptyStateOwnProps {
  onClose(event);
  onReset(event);
}

type ParentTagMappingEmptyStateProps = ParentTagMappingEmptyStateOwnProps;

const ParentTagMappingEmptyState: React.FC<ParentTagMappingEmptyStateProps> = ({
  onClose,
  onReset,
}: ParentTagMappingEmptyStateProps) => {
  const intl = useIntl();

  return (
    <EmptyState
      headingLevel="h5"
      titleText={intl.formatMessage(messages.tagMappingWizardSuccess)}
      variant={EmptyStateVariant.lg}
      className="pf-m-redhat-font"
    >
      <EmptyStateBody>
        {intl.formatMessage(messages.tagMappingWizardSuccessDesc, {
          learnMore: (
            <a href={intl.formatMessage(messages.docsTagMapping)} rel="noreferrer" target="_blank">
              {intl.formatMessage(messages.learnMore)}
            </a>
          ),
          warning: <b>{intl.formatMessage(messages.noMappedTagsWarning)}</b>,
        })}
      </EmptyStateBody>
      <EmptyStateFooter>
        <div>
          <Button onClick={onClose} variant={ButtonVariant.primary}>
            {intl.formatMessage(messages.tagMappingWizardNavToTagMapping)}
          </Button>
        </div>
        <div>
          <Button onClick={onReset} variant={ButtonVariant.link}>
            {intl.formatMessage(messages.tagMappingWizardNavToCreateTagMapping)}
          </Button>
        </div>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export { ParentTagMappingEmptyState };

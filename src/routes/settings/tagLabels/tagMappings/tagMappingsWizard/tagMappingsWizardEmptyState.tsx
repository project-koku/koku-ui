import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
  Icon,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

import { styles } from './tagMappingsWizard.styles';

interface TagMappingsEmptyStateOwnProps {
  onClose(event);
  onReset(event);
}

type TagMappingsEmptyStateProps = TagMappingsEmptyStateOwnProps;

const TagMappingsEmptyState: React.FC<TagMappingsEmptyStateProps> = ({
  onClose,
  onReset,
}: TagMappingsEmptyStateProps) => {
  const intl = useIntl();

  return (
    <EmptyState variant={EmptyStateVariant.lg} className="pf-m-redhat-font">
      <EmptyStateHeader
        titleText={intl.formatMessage(messages.tagMappingsWizardSuccess)}
        icon={
          <Icon status="success" style={styles.icon}>
            <EmptyStateIcon icon={CheckCircleIcon} />
          </Icon>
        }
        headingLevel="h5"
      />
      <EmptyStateBody>
        {intl.formatMessage(messages.tagMappingsWizardSuccessDesc, {
          learnMore: (
            <a href={intl.formatMessage(messages.docsTagMappings)} rel="noreferrer" target="_blank">
              {intl.formatMessage(messages.learnMore)}
            </a>
          ),
          warning: <b>{intl.formatMessage(messages.noMappedTagsWarning)}</b>,
        })}
      </EmptyStateBody>
      <EmptyStateFooter>
        <div>
          <Button onClick={onClose} variant={ButtonVariant.primary}>
            {intl.formatMessage(messages.tagMappingsWizardNavToTagMappings)}
          </Button>
        </div>
        <div>
          <Button onClick={onReset} variant={ButtonVariant.link}>
            {intl.formatMessage(messages.tagMappingsWizardNavToCreateTagMapping)}
          </Button>
        </div>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export { TagMappingsEmptyState };

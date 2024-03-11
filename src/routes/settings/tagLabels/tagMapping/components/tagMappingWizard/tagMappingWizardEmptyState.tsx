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

import { styles } from './tagMappingWizard.styles';

interface TagMappingEmptyStateOwnProps {
  onClose(event);
  onReset(event);
}

type TagMappingEmptyStateProps = TagMappingEmptyStateOwnProps;

const TagMappingEmptyState: React.FC<TagMappingEmptyStateProps> = ({ onClose, onReset }: TagMappingEmptyStateProps) => {
  const intl = useIntl();

  return (
    <EmptyState variant={EmptyStateVariant.lg} className="pf-m-redhat-font">
      <EmptyStateHeader
        titleText={intl.formatMessage(messages.tagMappingWizardSuccess)}
        icon={
          <Icon status="success" style={styles.icon}>
            <EmptyStateIcon icon={CheckCircleIcon} />
          </Icon>
        }
        headingLevel="h5"
      />
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

export { TagMappingEmptyState };

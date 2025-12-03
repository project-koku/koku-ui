import messages from '@koku-ui/i18n/locales/messages';
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import React from 'react';
import { useIntl } from 'react-intl';

import { ParentTagMapping } from './components/parentTagMapping';

interface TagMappingEmptyStateOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  onWizardClose();
}

type TagMappingEmptyStateProps = TagMappingEmptyStateOwnProps;

const TagMappingEmptyState: React.FC<TagMappingEmptyStateProps> = ({
  canWrite,
  isDisabled,
  onWizardClose,
}: TagMappingEmptyStateOwnProps) => {
  const intl = useIntl();

  return (
    <EmptyState
      headingLevel="h5"
      icon={PlusCircleIcon}
      titleText={intl.formatMessage(messages.noMappedTags)}
      variant={EmptyStateVariant.lg}
      className="pf-m-redhat-font"
    >
      <EmptyStateBody>
        {intl.formatMessage(messages.noMappedTagsDesc, {
          learnMore: (
            <a href={intl.formatMessage(messages.docsTagMapping)} rel="noreferrer" target="_blank">
              {intl.formatMessage(messages.learnMore)}
            </a>
          ),
          warning: <b>{intl.formatMessage(messages.noMappedTagsWarning)}</b>,
        })}
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <ParentTagMapping canWrite={canWrite} isDisabled={isDisabled} onClose={onWizardClose} />
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export { TagMappingEmptyState };

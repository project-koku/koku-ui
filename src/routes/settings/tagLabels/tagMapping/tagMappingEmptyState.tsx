import {
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';
import { ParentTagMapping } from 'routes/settings/tagLabels/tagMapping/components/parentTagMapping';

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
    <EmptyState variant={EmptyStateVariant.lg} className="pf-m-redhat-font">
      <EmptyStateHeader
        titleText={intl.formatMessage(messages.noMappedTags)}
        icon={<EmptyStateIcon icon={PlusCircleIcon} />}
        headingLevel="h5"
      />
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

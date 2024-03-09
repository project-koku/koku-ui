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
import { TagMappingsWizard } from 'routes/settings/tagLabels/tagMappings/tagMappingsWizard';

interface TagMappingsEmptyStateOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  onWizardClose();
}

type TagMappingsEmptyStateProps = TagMappingsEmptyStateOwnProps;

const TagMappingsEmptyState: React.FC<TagMappingsEmptyStateProps> = ({
  canWrite,
  isDisabled,
  onWizardClose,
}: TagMappingsEmptyStateOwnProps) => {
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
            <a href={intl.formatMessage(messages.docsTagMappings)} rel="noreferrer" target="_blank">
              {intl.formatMessage(messages.learnMore)}
            </a>
          ),
          warning: <b>{intl.formatMessage(messages.noMappedTagsWarning)}</b>,
        })}
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <TagMappingsWizard canWrite={canWrite} isDisabled={isDisabled} onClose={onWizardClose} />
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export { TagMappingsEmptyState };

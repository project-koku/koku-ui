import {
  Button,
  ButtonVariant,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
  Tooltip,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import messages from 'locales/messages';
import React from 'react';
import { useIntl } from 'react-intl';

interface TagMappingsEmptyStateOwnProps {
  canWrite?: boolean;
  isDisabled?: boolean;
  onCreateTagMapping();
}

type TagMappingsEmptyStateProps = TagMappingsEmptyStateOwnProps;

const TagMappingsEmptyState: React.FC<TagMappingsEmptyStateProps> = ({
  canWrite,
  isDisabled,
  onCreateTagMapping,
}: TagMappingsEmptyStateOwnProps) => {
  const intl = useIntl();

  const getActions = () => {
    const getTooltip = children => {
      if (!canWrite) {
        const disableTagsTooltip = intl.formatMessage(messages.readOnlyPermissions);
        return <Tooltip content={disableTagsTooltip}>{children}</Tooltip>;
      }
      return children;
    };

    return getTooltip(
      <Button isAriaDisabled={isDisabled} key="save" onClick={onCreateTagMapping} variant={ButtonVariant.primary}>
        {intl.formatMessage(messages.createTagMapping)}
      </Button>
    );
  };

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
        <EmptyStateActions>{getActions()}</EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  );
};

export { TagMappingsEmptyState };

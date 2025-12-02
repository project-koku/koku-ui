import messages from '@koku-ui/i18n/locales/messages';
import type { EmptyStateProps } from '@patternfly/react-core';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateVariant,
  Stack,
  StackItem,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { createMapStateToProps } from '../../../../store/common';
import { sourcesSelectors } from '../../../../store/sourceSettings';

interface OwnProps {
  actionButton: React.ReactNode;
  title: string;
  description: React.ReactNode;
}
type ErrorEmptyProps = Pick<EmptyStateProps, 'variant'>;
type ErrorStateProps = ErrorEmptyProps & OwnProps;

export const ErrorState: React.FC<ErrorStateProps> = ({ variant, actionButton, title, description }) => {
  return (
    <EmptyState headingLevel="h4" icon={ExclamationCircleIcon} titleText={title} variant={variant}>
      <EmptyStateBody>
        <Stack>
          <StackItem>{description}</StackItem>
        </Stack>
      </EmptyStateBody>
      <EmptyStateFooter>{actionButton}</EmptyStateFooter>
    </EmptyState>
  );
};

interface SourcesErrorStateProps extends WrappedComponentProps {
  onRefresh: () => void;
}

export const SourceStepErrorStateBase: React.FC<SourcesErrorStateProps> = ({ intl, onRefresh }) => {
  const title = intl.formatMessage(messages.costModelsWizardSourceErrorTitle);
  const description = intl.formatMessage(messages.costModelsWizardSourceErrorDesc, {
    url: (
      <a href={intl.formatMessage(messages.redHatStatusUrl)} rel="noreferrer" target="_blank">
        "Status Page"
      </a>
    ),
  });
  const actionButton = <Button onClick={onRefresh}>{intl.formatMessage(messages.costModelsRefreshDialog)}</Button>;
  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size={TitleSizes.xl}>
          {intl.formatMessage(messages.costModelsWizardSourceTitle)}
        </Title>
      </StackItem>
      <StackItem>
        <ErrorState
          variant={EmptyStateVariant.lg}
          actionButton={actionButton}
          description={description}
          title={title}
        />
      </StackItem>
    </Stack>
  );
};
const SourceStepErrorState = injectIntl(SourceStepErrorStateBase);
export { SourceStepErrorState };

interface SourcesModalErrorOwnProps {
  // TBD...
}

interface SourcesModalErrorStateProps {
  query: any;
}

interface SourcesModalErrorDispatchProps {
  onRefresh: () => void;
}

type SourcesModalErrorProps = SourcesModalErrorOwnProps &
  SourcesModalErrorStateProps &
  SourcesModalErrorDispatchProps &
  WrappedComponentProps;

export const SourcesModalErrorStateBase: React.FC<SourcesModalErrorProps> = ({ intl, onRefresh }) => {
  const title = intl.formatMessage(messages.costModelsAssignSourcesErrorTitle);
  const description = intl.formatMessage(messages.costModelsAssignSourcesErrorDesc, {
    url: (
      <a href={intl.formatMessage(messages.redHatStatusUrl)} rel="noreferrer" target="_blank">
        "Status Page"
      </a>
    ),
  });
  const actionButton = <Button onClick={onRefresh}>{intl.formatMessage(messages.costModelsRefreshDialog)}</Button>;
  return (
    <ErrorState variant={EmptyStateVariant.lg} actionButton={actionButton} description={description} title={title} />
  );
};

const mapStateToProps = createMapStateToProps<SourcesModalErrorOwnProps, SourcesModalErrorStateProps>(state => {
  return {
    query: sourcesSelectors.query(state),
  };
});

const mapDispatchToProps = (stateProps, dispatchProps): SourcesModalErrorDispatchProps => {
  const { query } = stateProps;
  const { fetch } = dispatchProps;
  const searchTerm = Object.keys(query).reduce((acc, curr) => {
    if (query[curr] === null) {
      return acc;
    }
    if (acc === '') {
      return `${curr}=${query[curr]}`;
    }
    return `${acc}&${curr}=${query[curr]}`;
  }, '');

  return {
    onRefresh: () => fetch(searchTerm),
  };
};

export const SourcesModalErrorState = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(SourcesModalErrorStateBase)
);

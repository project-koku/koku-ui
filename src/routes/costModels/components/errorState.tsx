import type { EmptyStateProps } from '@patternfly/react-core';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Stack,
  StackItem,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import global_DangerColor_100 from '@patternfly/react-tokens/dist/js/global_danger_color_100';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { RootState } from 'store/rootReducer';
import { sourcesActions, sourcesSelectors } from 'store/sourceSettings';

interface OwnProps {
  actionButton: React.ReactNode;
  title: string;
  description: React.ReactNode;
}
type ErrorEmptyProps = Pick<EmptyStateProps, 'variant'>;
type ErrorStateProps = ErrorEmptyProps & OwnProps;

export const ErrorState: React.FC<ErrorStateProps> = ({ variant, actionButton, title, description }) => {
  return (
    <EmptyState variant={variant}>
      <EmptyStateIcon icon={ExclamationCircleIcon} color={global_DangerColor_100.value} />
      <Title headingLevel="h4" size="lg">
        {title}
      </Title>
      <EmptyStateBody>
        <Stack>
          <StackItem>{description}</StackItem>
        </Stack>
      </EmptyStateBody>
      {actionButton}
    </EmptyState>
  );
};

interface SourcesErrorStateProps extends WrappedComponentProps {
  onRefresh: () => void;
}

export const SourceStepErrorStateBase: React.FC<SourcesErrorStateProps> = ({ intl, onRefresh }) => {
  const title = intl.formatMessage(messages.costModelsWizardSourceErrorTitle);
  const description = intl.formatMessage(messages.costModelsWizardSourceErrorDescription, {
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
          variant={EmptyStateVariant.large}
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

export const SourcesModalErrorStateBase: React.FC<SourcesErrorStateProps> = ({ intl, onRefresh }) => {
  const title = intl.formatMessage(messages.costModelsAssignSourcesErrorTitle);
  const description = intl.formatMessage(messages.costModelsAssignSourcesErrorDescription, {
    url: (
      <a href={intl.formatMessage(messages.redHatStatusUrl)} rel="noreferrer" target="_blank">
        "Status Page"
      </a>
    ),
  });
  const actionButton = <Button onClick={onRefresh}>{intl.formatMessage(messages.costModelsRefreshDialog)}</Button>;
  return (
    <ErrorState variant={EmptyStateVariant.large} actionButton={actionButton} description={description} title={title} />
  );
};

export const SourcesModalErrorState = injectIntl(
  connect(
    (state: RootState) => ({
      query: sourcesSelectors.query(state),
    }),
    dispatch => ({
      fetch: (query: string) => sourcesActions.fetchSources(query)(dispatch),
    }),
    (stateProps, dispatchProps) => {
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
    }
  )(SourcesModalErrorStateBase)
);

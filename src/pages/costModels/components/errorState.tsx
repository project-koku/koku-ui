import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateProps,
  EmptyStateVariant,
  Stack,
  StackItem,
  Title,
  TitleSizes,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import global_DangerColor_100 from '@patternfly/react-tokens/dist/js/global_danger_color_100';
import { createIntlEnv } from 'components/i18n/localeEnv';
import messages from 'locales/messages';
import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'store/rootReducer';
import { sourcesActions, sourcesSelectors } from 'store/sourceSettings';

interface OwnProps {
  actionButton: React.ReactNode;
  title: string;
  description: React.ReactNode;
}
type ErrorEmptyProps = Pick<EmptyStateProps, 'variant'>;
type ErrorStateProps = ErrorEmptyProps & OwnProps;

export const ErrorState: React.FunctionComponent<ErrorStateProps> = ({ variant, actionButton, title, description }) => {
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

interface SourcesErrorStateProps {
  onRefresh: () => void;
}

export const SourceStepErrorState: React.FunctionComponent<SourcesErrorStateProps> = ({ onRefresh }) => {
  const intl = createIntlEnv();
  const title = intl.formatMessage(messages.CostModelsWizardSourceErrorTitle);
  const description = intl.formatMessage(messages.CostModelsWizardSourceErrorDescription, {
    statusUrl: (
      <a href={intl.formatMessage(messages.RedHatStatusUrl)} rel="noreferrer" target="_blank">
        "Status Page"
      </a>
    ),
  });
  const actionButton = <Button onClick={onRefresh}>{intl.formatMessage(messages.CostModelsRefreshDialog)}</Button>;
  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size={TitleSizes.xl}>
          {intl.formatMessage(messages.CostModelsWizardSourceTitle)}
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

export const SourcesModalErrorStateBase: React.FunctionComponent<SourcesErrorStateProps> = ({ onRefresh }) => {
  const intl = createIntlEnv();
  const title = intl.formatMessage(messages.CostModelsDetailsAssignSourcesErrorTitle);
  const description = intl.formatMessage(messages.CostModelsDetailsAssignSourcesErrorDescription, {
    statusUrl: (
      <a href={intl.formatMessage(messages.RedHatStatusUrl)} rel="noreferrer" target="_blank">
        "Status Page"
      </a>
    ),
  });
  const actionButton = <Button onClick={onRefresh}>{intl.formatMessage(messages.CostModelsRefreshDialog)}</Button>;
  return (
    <ErrorState variant={EmptyStateVariant.large} actionButton={actionButton} description={description} title={title} />
  );
};

export const SourcesModalErrorState = connect(
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
)(SourcesModalErrorStateBase);

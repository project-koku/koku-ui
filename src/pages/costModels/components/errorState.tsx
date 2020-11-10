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
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import global_DangerColor_100 from '@patternfly/react-tokens/dist/js/global_danger_color_100';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const title = t('cost_models_wizard.source.error.title');
  const description = (
    <Trans i18nKey="cost_models_wizard.source.error.desc">
      Try refreshing this step or you can skip this step (as it is optional) and assign the source to the cost model at
      a later time. If the problem persists, contact your organization administrator or visit our{' '}
      <a href="status.redhat.com">status page</a> for known outages.
    </Trans>
  );
  const actionButton = (
    <Button onClick={onRefresh}>{t('cost_models_details.assign_sources_error_action_button')}</Button>
  );
  return (
    <Stack hasGutter>
      <StackItem>
        <Title headingLevel="h2" size="xl">
          {t('cost_models_wizard.source.title')}
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
  const { t } = useTranslation();
  const title = t('cost_models_details.assign_sources_error_title');
  const description = (
    <Trans i18nKey="cost_models_details.assign_sources_error_desc">
      You cannot assign a source at this time. Try refreshing this page. If the problem persists, contact your
      organization administrator or visit our <a href="status.redhat.com">status page</a> for known outages.
    </Trans>
  );
  const actionButton = (
    <Button onClick={onRefresh}>{t('cost_models_details.assign_sources_error_action_button')}</Button>
  );
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

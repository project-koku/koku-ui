import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { BinocularsIcon } from '@patternfly/react-icons/dist/js/icons/binoculars-icon';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

interface LoadingStateProps extends InjectedTranslateProps {
  icon?: string;
}

const LoadingStateBase: React.SFC<LoadingStateProps> = ({
  icon = BinocularsIcon,
  t,
}) => {
  const title = t('loading_state.sources_title');
  const subTitle = t('loading_state.sources_desc');

  return (
    <EmptyState variant={EmptyStateVariant.large} className="pf-m-redhat-font">
      <Spinner size="lg" />
      <Title headingLevel="h2" size="lg">
        {title}
      </Title>
      <EmptyStateBody>{subTitle}</EmptyStateBody>
    </EmptyState>
  );
};

const LoadingState = translate()(LoadingStateBase);

export { LoadingState };

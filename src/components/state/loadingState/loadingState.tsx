import {
  EmptyState,
  EmptyStateBody,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { BinocularsIcon } from '@patternfly/react-icons';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { styles } from './loadingState.styles';

interface LoadingStateProps extends WrappedComponentProps {
  icon?: string;
}

const LoadingStateBase: React.SFC<LoadingStateProps> = ({
  icon = BinocularsIcon,
  intl,
}) => {
  const title = intl.formatMessage({ id: 'loading_state.sources_title' });
  const subTitle = intl.formatMessage({ id: 'loading_state.sources_desc' });

  return (
    <div style={styles.container}>
      <EmptyState>
        <Spinner size="lg" />
        <Title size="lg">{title}</Title>
        <EmptyStateBody>{subTitle}</EmptyStateBody>
      </EmptyState>
    </div>
  );
};

const LoadingState = injectIntl(LoadingStateBase);

export { LoadingState };

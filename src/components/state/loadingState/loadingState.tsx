import {
  EmptyState,
  EmptyStateBody,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { BinocularsIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { styles } from './loadingState.styles';

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
    <div className={css(styles.container)}>
      <EmptyState>
        <Spinner size="lg" />
        <Title size="lg">{title}</Title>
        <EmptyStateBody>{subTitle}</EmptyStateBody>
      </EmptyState>
    </div>
  );
};

const LoadingState = translate()(LoadingStateBase);

export { LoadingState };

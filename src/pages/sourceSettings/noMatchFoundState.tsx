import {
  EmptyState as PfEmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { styles } from './noMatchFoundState.styles';

const NoMatchFoundStateBase: React.SFC<InjectedTranslateProps> = ({ t }) => {
  return (
    <div className={css(styles.container)}>
      <PfEmptyState>
        <EmptyStateIcon icon={SearchIcon} />
        <Title size="lg">{t('no_match_found_state.title')}</Title>
        <EmptyStateBody>{t('no_match_found_state.desc')}</EmptyStateBody>
      </PfEmptyState>
    </div>
  );
};

const NoMatchFoundState = translate()(NoMatchFoundStateBase);

export { NoMatchFoundState };

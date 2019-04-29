import {
  EmptyState as PfEmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
  TitleSize,
} from '@patternfly/react-core';
import { MoneyCheckAltIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { styles } from './noRatesState.styles';

interface Props extends InjectedTranslateProps {
  cluster: string;
}

const NoRatesStateBase: React.SFC<Props> = ({ t, cluster }) => {
  return (
    <div className={css(styles.container)}>
      <PfEmptyState>
        <EmptyStateIcon icon={MoneyCheckAltIcon} />
        <Title size={TitleSize.lg}>{t('no_rates_state.title')}</Title>
        <EmptyStateBody>{t('no_rates_state.desc', { cluster })}</EmptyStateBody>
      </PfEmptyState>
    </div>
  );
};

export const NoRatesState = translate()(NoRatesStateBase);

import {
  EmptyState as PfEmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { MoneyCheckAltIcon } from '@patternfly/react-icons/dist/js/icons/money-check-alt-icon';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';

import { styles } from './noRatesState.styles';

interface Props extends InjectedTranslateProps {
  cluster: string;
}

const NoRatesStateBase: React.SFC<Props> = ({ t, cluster }) => {
  return (
    <div style={styles.container}>
      <PfEmptyState>
        <EmptyStateIcon icon={MoneyCheckAltIcon} />
        <Title headingLevel="h2" size="xl">
          {t('no_rates_state.title')}
        </Title>
        <EmptyStateBody>{t('no_rates_state.desc', { cluster })}</EmptyStateBody>
      </PfEmptyState>
    </div>
  );
};

export const NoRatesState = translate()(NoRatesStateBase);

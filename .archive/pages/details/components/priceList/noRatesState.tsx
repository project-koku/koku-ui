import { EmptyState as PfEmptyState, EmptyStateBody, EmptyStateIcon, Title, TitleSizes } from '@patternfly/react-core';
import { MoneyCheckAltIcon } from '@patternfly/react-icons/dist/esm/icons/money-check-alt-icon';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { styles } from './noRatesState.styles';

interface Props extends WithTranslation {
  cluster: string;
}

const NoRatesStateBase: React.SFC<Props> = ({ t, cluster }) => {
  return (
    <div style={styles.container}>
      <PfEmptyState>
        <EmptyStateIcon icon={MoneyCheckAltIcon} />
        <Title headingLevel="h2" size={TitleSizes.xl}>
          {t('no_rates_state.title')}
        </Title>
        <EmptyStateBody>{t('no_rates_state.desc', { cluster })}</EmptyStateBody>
      </PfEmptyState>
    </div>
  );
};

export const NoRatesState = withTranslation()(NoRatesStateBase);

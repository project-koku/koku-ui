import { Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { styles } from './costModelsDetails.styles';

const Header: React.SFC<InjectedTranslateProps> = ({ t }) => (
  <header className={css(styles.header)}>
    <Title className={css(styles.title)} size="2xl">
      {t('cost_models_details.header.title')}
    </Title>
    <Title size="md">{t('cost_models_details.header.sub')}</Title>
  </header>
);

export default Header;

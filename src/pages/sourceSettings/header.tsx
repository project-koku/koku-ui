import { Breadcrumb, BreadcrumbItem, Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';
import { styles } from './sourceSettings.styles';

const Header: React.SFC<InjectedTranslateProps> = ({ t }) => (
  <header className={css(styles.header)}>
    <Breadcrumb className={css(styles.breadcrumb)}>
      <BreadcrumbItem to="#">{t('setting')}</BreadcrumbItem>
      <BreadcrumbItem to="#" isActive>
        {t('cost_management')}
      </BreadcrumbItem>
    </Breadcrumb>
    <Title className={css(styles.title)} size="2xl">
      {t('source_details.title')}
    </Title>
  </header>
);

export default Header;

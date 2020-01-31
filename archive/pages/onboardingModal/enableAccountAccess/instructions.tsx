import { List, ListItem, Title } from '@patternfly/react-core';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';

const EnableAccountAccessInstructions: React.SFC<InjectedTranslateProps> = ({
  t,
}) => {
  return (
    <React.Fragment>
      <Title size="xl">
        {t('onboarding.enable_account_access.instructions_title')}
      </Title>
      <div>{t('onboarding.enable_account_access.intro')}</div>
      <br />
      <List>
        <ListItem>{t('onboarding.enable_account_access.select_role')}</ListItem>
        <ListItem>{t('onboarding.enable_account_access.copy_arn')}</ListItem>
      </List>
    </React.Fragment>
  );
};

export default EnableAccountAccessInstructions;

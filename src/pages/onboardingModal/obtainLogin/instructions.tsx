import { List, ListItem, Title } from '@patternfly/react-core';
import CopyClipboard from 'components/copyClipboard';
import React from 'react';
import { InjectedTranslateProps } from 'react-i18next';

const ObtainLoginInstructions: React.SFC<InjectedTranslateProps> = ({ t }) => {
  return (
    <React.Fragment>
      <Title size="xl">{t('onboarding.obtain_login.instructions_title')}</Title>
      <div>{t('onboarding.obtain_login.intro')}</div>
      <br />
      <List>
        <ListItem>{t('onboarding.obtain_login.obtain_token')}</ListItem>
        <ListItem>
          {t('onboarding.obtain_login.run_command')}
          <br />
          <CopyClipboard
            text="oc serviceaccounts get-token metering-operator > ocp_usage_token"
            aria-label="command line to obtain the token"
          />
        </ListItem>
        <ListItem>{t('onboarding.obtain_login.security')}</ListItem>
      </List>
    </React.Fragment>
  );
};

export default ObtainLoginInstructions;
